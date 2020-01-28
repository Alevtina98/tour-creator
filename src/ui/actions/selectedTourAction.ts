import { ActionType, createStandardAction } from "typesafe-actions";
import IDB from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
//import uuid from "uuid";
import {getAllTours, getInitData, getTourById, ScriptValue} from "../util/restClient/requestTour";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<ScriptValue[]>();
export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setTourJS = createStandardAction("SET_TOUR_JS")<string>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await getAllTours();
    //await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};
export const saveDescTour = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("saveTour");
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    const saveTour: ScriptValue = { ...tourDB, dateChange: Date() };
    if (saveTour.key === selectedTour.key) {
        dispatch(setTourDB(saveTour));
    }
    (await IDB()).put("script", saveTour, saveTour.key);
    loadListTour()(dispatch);
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    if (key == store.SelectedTourState.tourDB.key) dispatch(setLoadBocklyDisabled());
    (await IDB()).delete("script", key);
    clearInterval(periodicallySaveTimer);
    loadListTour()(dispatch);
};
let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("periodicallySave");
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        saveSelectedTour()(dispatch, getState);
        loadListTour()(dispatch);
    }, 5000);
};
export const loadToDb = (key: string) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: ScriptValue | undefined = await getTourById(key);
    //(await IDB()).get("script", key);
    if (tour) dispatch(setTourDB(tour));
    //console.log(tour);
    return dispatch(setLoadBocklyEnabled());
};
export const createNewTour = (name: string | null, desc: string | null) => async (dispatch: Dispatch) => {
    closeSelectedTour()(dispatch);
    const tour: ScriptValue = getInitData({
        name: name,
        desc: desc
    });
    dispatch(setTourDB(tour));
    return window.setTimeout(() => {
        dispatch(setLoadBocklyEnabled());
    }, 5);
};
export const createCopyTour = (name: string | null, desc: string | null) => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch);
    const store = getState();
    const tour: ScriptValue = getInitData({
        name: name,
        desc: desc,
        code: store.SelectedTourState.tourXML,
        codeJS: store.SelectedTourState.tourJS
    });
    //key: uuid.v4()
    dispatch(setTourDB(tour));
    return window.setTimeout(() => {
        dispatch(setLoadBocklyEnabled());
    }, 5);
};
export const saveSelectedTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("saveSelectedTour");
    const store = getState();
    const saveTour: ScriptValue = {
        ...store.SelectedTourState.tourDB,
        code: store.SelectedTourState.tourXML,
        codeJS: store.SelectedTourState.tourJS
    };
    dispatch(setTourDB(saveTour));
    await (await IDB()).put("script", saveTour, saveTour.key);
};
export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: ScriptValue = getInitData();
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export type SelectedTourAction = ActionType<typeof setTourDB>;
