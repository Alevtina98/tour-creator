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
import { getCurrentJs, getJsSettersNameAndDesc } from "../util/jsCodeTour";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setTourDB = createStandardAction("SET_TOUR")<TourType>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await getAllTours();
    dispatch(setListTour(result));
};
export const loadToDb = (key: number) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: TourType | undefined = await getTourById(key);
    try {
        dispatch(setTourDB(tour));
        dispatch(setLoadBocklyEnabled());
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        return console.log("ERROR MODAL CREATED");
    }
    //setCurrentTour(tour.name, tour.desc, tour.code, tour.codeJS)(dispatch, getState);
    tour.codeJS = getJsSettersNameAndDesc(tour.name || "", tour.desc || "") + tour.codeJS;
    const createdTour: TourType = await createTour(tour);
    try {
        if (store.ModalState.status === "copy") {
            dispatch(success({ title: createdTour?.name + " сохранен как копия " }));
        }
        if (store.SelectedTourState.blocklyReloadEnabled) {
            closeSelectedTour()(dispatch);
        }
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
export const setCurrentTour = (
    newName: string | null,
    newDesc: string | null,
    newXml: string | null,
    newJs: string | null,
    dateSaveCurrentTour: string | null
) => (dispatch: Dispatch, getState: () => StoreType) => {
    const tourDB: TourType = getState().SelectedTourState.tourDB;
    const currentName: string | null = newName || tourDB.name;
    const currentDesc: string | null = newDesc || tourDB.desc;
    const currentXml: string | null = newXml || tourDB.code;
    const currentJs: string | null = getCurrentJs(currentName, currentDesc, currentXml, newJs);
    const currentDateChange: string = dateSaveCurrentTour || (currentXml !== tourDB.code ? "" : tourDB.dateChange);
    const currentTour: TourType = {
        ...tourDB,
        name: currentName,
        desc: currentDesc,
        code: currentXml,
        codeJS: currentJs,
        dateChange: currentDateChange
    };
    dispatch(setTourDB(currentTour));
};
export const saveTour = (period?: boolean) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    const tourForSaved: TourType = store.ModalState.tour || selectedTour;
    if (store.ModalState.status === "edit") {
        tourForSaved.codeJS = getCurrentJs(tourForSaved.name, tourForSaved.desc, tourForSaved.code, null);
    }
    try {
        const savedTour: TourType = await updateTour(tourForSaved);
        loadListTour()(dispatch);
        if (store.ModalState.status === "edit" && savedTour.id !== selectedTour.id) {
            return;
        }
        setCurrentTour(savedTour.name, savedTour.desc, null, null, savedTour.dateChange)(dispatch, getState);
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

export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: TourType = getInitData();
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export const delToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED");
        return;
    }
    const key: number = tour.id;
    await deleteTourById(key);
    try {
        if (key == store.SelectedTourState.tourDB.id) {
            closeSelectedTour()(dispatch);
            //dispatch(burgerClose());
        }
        loadListTour()(dispatch);
        dispatch(success({ title: tour.name + " удален" }));
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export type SelectedTourAction = ActionType<typeof setTourDB>;
