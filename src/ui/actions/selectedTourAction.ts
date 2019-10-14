import { ActionType, createAsyncAction, createStandardAction } from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import ConfigFiles from "../../initContent/content";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const isLoadingDB = createStandardAction("IS_LOADING_DB")();
export const settourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setKey = createStandardAction("SET_KEY")<string>();

// eslint-disable-next-line @typescript-eslint/require-await
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setLoadBocklyDisabled());
    //console.log("dispatch(setLoadBocklyDisabled());");
    //const store = getState();
    const tour: ScriptValue = {
        name: "",
        date: "",
        desc: "",
        code: "",//ConfigFiles.INITIAL_XML,
        key: ""
    };
    dispatch(settourDB(tour));
    return window.setTimeout(() => {
        dispatch(setLoadBocklyEnabled());
    }, 5);
};
export const saveToDb = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(settourDB(tourDB));
    (await IDB()).put("script", tourDB, tourDB.key);
};
export const loadToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setLoadBocklyDisabled());
    //console.log("dispatch(setLoadBocklyDisabled());");
    //const store = getState();
    const tour: ScriptValue | undefined = await (await IDB()).get("script", key);
    if (tour) dispatch(settourDB(tour));
    return dispatch(setLoadBocklyEnabled());
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("DelKey >> ",getState().SelectedTourState.selectedIndex);
   // const store = getState();
    (await IDB()).delete("script", key);
};
export type SelectedTourAction = ActionType<typeof settourDB>;
