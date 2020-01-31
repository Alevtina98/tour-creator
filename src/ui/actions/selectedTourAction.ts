import { ActionType, createStandardAction } from "typesafe-actions";
import IDB from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
//import uuid from "uuid";
import {
    createTour,
    deleteTourById,
    getAllTours,
    getInitData,
    getTourById,
    TourType,
    updateTour
} from "../util/restClient/requestTour";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setTourDB = createStandardAction("SET_TOUR")<TourType>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setTourJS = createStandardAction("SET_TOUR_JS")<string>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await getAllTours();
    //await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    //(await IDB()).delete("script", key);
    const ok: boolean = await deleteTourById(key);
    if (ok) {
        if (key == store.SelectedTourState.tourDB.id.toString()) dispatch(setLoadBocklyDisabled());
        //(await IDB()).delete("script", key);
        clearInterval(periodicallySaveTimer);
        loadListTour()(dispatch);
    } else console.log("Ошибка при удалении тура");
};
export const saveDescTour = (tourDB: TourType) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("saveTour");
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    // (await IDB()).put("script", saveTour, saveTour.id);
    const updatedTour: TourType = await updateTour(tourDB);
    if (updatedTour) {
        if (tourDB.id === selectedTour.id) {
            dispatch(setTourDB(tourDB));
        }
        loadListTour()(dispatch);
    } else console.log("Ошибка при сохранении измененного тура");
};
export const saveSelectedTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("saveSelectedTour");
    const store = getState();
    const saveTour: TourType = {
        ...store.SelectedTourState.tourDB,
        code: store.SelectedTourState.tourXML,
        codeJS: store.SelectedTourState.tourJS
    };
    //await (await IDB()).put("script", saveTour, saveTour.id);
    const updatedTour: TourType = await updateTour(saveTour);
    if (updatedTour) {
        dispatch(setTourDB(saveTour));
    } else console.log("Ошибка при сохранении измененного тура");
};

let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("periodicallySave");
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        saveSelectedTour()(dispatch, getState);
        loadListTour()(dispatch);
    }, 10000);
};
export const loadToDb = (key: number) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: TourType | undefined = await getTourById(key);
    //(await IDB()).get("script", key);
    if (tour) dispatch(setTourDB(tour));
    //console.log(tour);
    return dispatch(setLoadBocklyEnabled());
};
export const createNewTour = (name: string | null, desc: string | null) => async (dispatch: Dispatch) => {
    const tour: TourType = getInitData({
        name: name,
        desc: desc
    });
    const createdTour: TourType = await createTour(tour);
    if (createdTour) {
        closeSelectedTour()(dispatch);
        //console.log("createdTour >> ", createdTour);
        dispatch(setTourDB(createdTour));
        loadListTour()(dispatch);
        return window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    } else console.log("Ошибка при создании тура");
};
export const createCopyTour = (name: string | null, desc: string | null) => async (
    dispatch: Dispatch,
    getState: () => StoreType
) => {
    closeSelectedTour()(dispatch);
    const store = getState();
    const tour: TourType = getInitData({
        name: name,
        desc: desc,
        code: store.SelectedTourState.tourXML,
        codeJS: store.SelectedTourState.tourJS
    });
    //key: uuid.v4()
    const createdTour: TourType = await createTour(tour);
    if (createdTour) {
        dispatch(setTourDB(createdTour));
        loadListTour()(dispatch);
        return window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    } else console.log("Ошибка при создании копии тура");
};
export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: TourType = getInitData();
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export type SelectedTourAction = ActionType<typeof setTourDB>;
