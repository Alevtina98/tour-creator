import { ActionType, createStandardAction } from "typesafe-actions";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import {
    createTour,
    deleteTourById,
    getAllTours,
    getInitData,
    getTourById,
    TourType,
    updateTour
} from "../util/restClient/requestTour";
import { error, success } from "react-notification-system-redux";
import { burgerClose } from "./mainAction";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setTourDB = createStandardAction("SET_TOUR")<TourType>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();
export const setBlocklyRef = createStandardAction("SET_BLOCKLY_REF")<any | null>();

export const codeJSSetNameAndDesc = (name: string, desc: string) => {
    const nameAssignment: string | null = "TourHelper.setNameTour('" + name + "');\n";
    const descAssignment: string | null = "TourHelper.setDescTour('" + desc + "');\n\n";
    return nameAssignment + descAssignment;
};
export const editTourDB = (tourProps: TourType) => (dispatch: Dispatch, getState: () => StoreType) => {
    const storeTour = getState().SelectedTourState.tourDB;
    const tour: TourType = { ...storeTour, ...tourProps };
    tour.codeJS = codeJSSetNameAndDesc(tour.name || "", tour.desc || "") + tour.codeJS;
    dispatch(setTourDB(tour));
};

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await getAllTours();
    //await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};

export const delToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED");
        return;
    }
    const key: number = tour.id;
    //(await IDB()).delete("script", key);
    await deleteTourById(key);
    try {
        if (key == store.SelectedTourState.tourDB.id) {
            dispatch(setLoadBocklyDisabled());
            dispatch(setTourDB(getInitData()));
            dispatch(burgerClose());
        }
        clearInterval(periodicallySaveTimer);
        loadListTour()(dispatch);
        dispatch(success({ title: tour.name + " удален" }));
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};

export const saveTour = (period?: boolean) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    const tourForSaved: TourType = store.ModalState.tour || selectedTour;

    if (store.ModalState.status === "edit") {
        const xml = tourForSaved.code;
        const xmlDom = Blockly.Xml.textToDom(xml);
        const workspace = new Blockly.Workspace();
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        const jsFromXml: string = Blockly.JavaScript.workspaceToCode(workspace);
        tourForSaved.codeJS = codeJSSetNameAndDesc(tourForSaved.name || "", tourForSaved.desc || "") + jsFromXml;
    }
    //tourForSaved.codeJS = codeJSSetNameAndDesc(tourForSaved.name || "", tourForSaved.desc || "") + tourForSaved.codeJS;
    try {
        const savedTour: TourType = await updateTour(tourForSaved);
        if (tourForSaved.id === selectedTour.id) {
            dispatch(setTourDB(savedTour));
        }
        loadListTour()(dispatch);
        if (!period) {
            dispatch(success({ title: savedTour?.name + " сохранен" }));
        }
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        const store = getState();
        const tour: TourType = store.SelectedTourState.tourDB;
        if (tour.dateChange) return;
        saveTour(true)(dispatch, getState);
    }, 10000);
};
export const loadToDb = (key: number) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: TourType | undefined = await getTourById(key);
    //(await IDB()).get("script", key);
    try {
        dispatch(setTourDB(tour));
        dispatch(setLoadBocklyEnabled());
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export const createNewTour = (initTour?: TourType) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        return console.log("ERROR MODAL CREATED");
    }
    tour.codeJS = codeJSSetNameAndDesc(tour.name || "", tour.desc || "") + tour.codeJS;
    dispatch(setTourDB(tour));
    const createdTour: TourType = await createTour(tour);
    try {
        if (store.ModalState.status === "copy") {
            dispatch(success({ title: createdTour?.name + " сохранен как копия " }));
        }
        closeSelectedTour()(dispatch);
        dispatch(setTourDB(createdTour));
        loadListTour()(dispatch);
        return window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export const createCopyTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch);
    const store = getState();
    const tour: TourType = store.ModalState.tour;
    if (!tour) {
        return console.log("ERROR MODAL CREATED COPY");
    }
    createNewTour(tour)(dispatch, getState);
};
export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: TourType = getInitData();
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export type SelectedTourAction = ActionType<typeof setTourDB | typeof editTourDB>;
