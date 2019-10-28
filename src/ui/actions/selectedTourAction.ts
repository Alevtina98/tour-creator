import { ActionType, createAsyncAction, createStandardAction } from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import ConfigFiles from "../../initContent/content";
import { format } from "date-fns";
import uuid from "uuid";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const isLoadingDB = createStandardAction("IS_LOADING_DB")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<ScriptValue[]>();
export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setKey = createStandardAction("SET_KEY")<string>();

export const loadListTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const result = await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};
// eslint-disable-next-line @typescript-eslint/require-await
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch, getState);
    //console.log("dispatch(setLoadBocklyDisabled());");
    //const store = getState();
    const tour: ScriptValue = {
        name: "NewTour",
        date: "",
        desc: "",
        code: "",
        key: uuid.v4()
    };
    dispatch(setTourDB(tour));
    return window.setTimeout(() => {
        dispatch(setLoadBocklyEnabled());
    }, 5);
};
let periodicallySaveTimer = 0;
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
//фоновое сохранение тура
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("periodicallySave");
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        saveSelectedTour()(dispatch, getState);
        loadListTour()(dispatch, getState);
    }, 5000);
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
export const saveDescTour = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    console.log("saveTour");
    const store = getState();
    const selectedTour = store.SelectedTourState.tourDB;
    const saveTour: ScriptValue = { ...tourDB, date: Date() };
    if (saveTour.key === selectedTour.key) {
        dispatch(setTourDB(saveTour));
    }
    (await IDB()).put("script", saveTour, saveTour.key);
    loadListTour()(dispatch, getState);
};
//загрузка нового тура с пререзагрузкой блокли
export const loadToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    dispatch(setLoadBocklyDisabled());
    const tour: ScriptValue | undefined = await (await IDB()).get("script", key);
    if (tour) dispatch(setTourDB(tour));
    console.log(tour);
    return dispatch(setLoadBocklyEnabled());
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("DelKey >> ",getState().SelectedTourState.selectedIndex);
    // const store = getState();
    const store = getState();
    //console.log("saveDescTour");
    if (key == store.SelectedTourState.tourDB.key) dispatch(setLoadBocklyDisabled());
    (await IDB()).delete("script", key);
    clearInterval(periodicallySaveTimer);
};
export type SelectedTourAction = ActionType<typeof setTourDB>;
