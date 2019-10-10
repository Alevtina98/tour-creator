import { ActionType, createAsyncAction, createStandardAction } from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const isLoadingDB = createStandardAction("IS_LOADING_DB")();
export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setKey = createStandardAction("SET_KEY")<string>();
export const saveToDb = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setTourDB(tourDB));
    (await IDB()).put("script", tourDB, tourDB.name + tourDB.date);
};
export const loadToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setLoadBocklyDisabled());
    //console.log("dispatch(setLoadBocklyDisabled());");
    //const store = getState();
    const tour: ScriptValue | undefined = await (await IDB()).get("script", key);
    if (tour) dispatch(setTourDB(tour));
    return dispatch(setLoadBocklyEnabled());
};
export const delToDb = (key: string) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("DelKey >> ",getState().SelectedTourState.selectedIndex);
   // const store = getState();
    (await IDB()).delete("script", key);
};
export type SelectedTourAction = ActionType<typeof setTourDB>;
