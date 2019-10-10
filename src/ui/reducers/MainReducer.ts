import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { connectSuccess } from "../actions/mainAction";

export interface MainReducerState {
    connected: boolean;
}

const connectedReducer = createReducer<boolean>(true).handleAction(connectSuccess, () => true);

const mainReducer = combineReducers<MainReducerState>({
    connected: connectedReducer
});

export default mainReducer;
