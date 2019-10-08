import { ActionType, createAsyncAction, createStandardAction } from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";

export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourXML = createStandardAction("SET_TOUR_XML")<string>();
export const setKey = createStandardAction("SET_KEY")<string>();
export const saveToDb = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setTourDB(tourDB));
    (await IDB()).put("script", tourDB, tourDB.name + tourDB.date);
};
export const changeToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    loadToDb();

};
export const loadToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();

    const store = getState();
    const tour: ScriptValue | undefined = await (await IDB()).get("script", store.SelectedTourState.selectedIndex);
    if (tour) {
        dispatch(setTourDB(tour));
        dispatch(setTourXML(tour.code));
    }
};
export const delToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    //console.log("DelKey >> ",getState().SelectedTourState.selectedIndex);
    const store = getState();
    (await IDB()).delete("script", store.SelectedTourState.selectedIndex);
};
export type SelectedTourAction = ActionType<typeof setTourDB>;
