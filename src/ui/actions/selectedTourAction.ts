import { ActionType, createAsyncAction, createStandardAction } from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import uuid from "uuid";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<ScriptValue[]>();
export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setTourJS = createStandardAction("SET_TOUR_JS")<string>();

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};
export const saveDescTour = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("saveTour");
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    const saveTour: ScriptValue = { ...tourDB, date: Date() };
    if (saveTour.key === selectedTour.key) {
        dispatch(setTourDB(saveTour));
    }
    (await IDB()).put("script", saveTour, saveTour.key);
    loadListTour()(dispatch, getState);
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    if (key == store.SelectedTourState.tourDB.key) dispatch(setLoadBocklyDisabled());
    (await IDB()).delete("script", key);
    clearInterval(periodicallySaveTimer);
    loadListTour()(dispatch, getState);
};
let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("periodicallySave");
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        saveSelectedTour()(dispatch, getState);
        loadListTour()(dispatch, getState);
    }, 5000);
};
export const loadToDb = (key: string) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: ScriptValue | undefined = await (await IDB()).get("script", key);
    if (tour) dispatch(setTourDB(tour));
    //console.log(tour);
    return dispatch(setLoadBocklyEnabled());
};
export const createNewTour = (name: string, desc: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch, getState);
    const tour: ScriptValue = {
        name: name,
        date: "",
        desc: desc,
        code: "",
        key: uuid.v4()
    };
    dispatch(setTourDB(tour));
    return window.setTimeout(() => {
        dispatch(setLoadBocklyEnabled());
    }, 5);
};
export const createCopyTour = (name: string, desc: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch, getState);
    const store = getState();
    const tour: ScriptValue = {
        name: name,
        date: "",
        desc: desc,
        code: store.SelectedTourState.tourXML,
        key: uuid.v4()
    };
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
        date: Date()
    };
    dispatch(setTourDB(saveTour));
    await (await IDB()).put("script", saveTour, saveTour.key);
};
export const closeSelectedTour = () => (dispatch: Dispatch, getState: () => StoreType) => {
    dispatch(setLoadBocklyDisabled());
    const tour: ScriptValue = {
        name: "",
        date: "",
        desc: "",
        code: "",
        key: ""
    };
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export type SelectedTourAction = ActionType<typeof setTourDB>;
