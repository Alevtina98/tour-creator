import {ActionType, createAsyncAction, createStandardAction} from "typesafe-actions";
import IDB, { ScriptValue } from "../util/indexedDB";
import {Dispatch} from "redux";
import {StoreType} from "../reducers";

export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourBlockly = createStandardAction("SET_TOUR_XML")<string>();


export const saveToDb = (tourDB: ScriptValue) => async (dispatch: Dispatch, getState: () => StoreType) => {
    //const store = getState();
    dispatch(setTourDB(tourDB));
    (await IDB()).put("script", tourDB, tourDB.name + tourDB.date);
};

export type SelectedTourAction = ActionType<typeof setTourDB>;
