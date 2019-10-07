import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { connectSuccess, setLoadBocklyDisabled, setLoadBocklyEnabled } from "../actions/mainAction";

export interface MainReducerState {
    connected: boolean;
    blocklyReloadEnabled: boolean;
}

const connectedReducer = createReducer<boolean>(true).handleAction(connectSuccess, () => true);
const blocklyLoadReducer = createReducer<boolean>(true)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const mainReducer = combineReducers<MainReducerState>({
    connected: connectedReducer,
    blocklyReloadEnabled: blocklyLoadReducer
});

export default mainReducer;
