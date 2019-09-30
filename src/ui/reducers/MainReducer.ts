import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    connectSuccess,
    CurrentSelectorAction,
    setCurrentSelector,
    SetInspectActions,
    setInspectDisabled,
    setInspectEnabled,
} from "../actions/mainAction";

export interface MainReducerState {
    connected: boolean;
    selector: string;
    isInspectEnabled: boolean;
}

/*export const initialMainState = {
    connected: false,
    selector: "",
    isInspectEnabled: false,
};*/
const connectedReducer = createReducer<boolean>(false).handleAction(connectSuccess, () => true);
const selectorReducer = createReducer<string, CurrentSelectorAction>("").handleAction(
    setCurrentSelector,
    (state, action) => action.payload,
);
const inspectReducer = createReducer<boolean, SetInspectActions>(false)
    .handleAction(setInspectEnabled, () => true)
    .handleAction(setInspectDisabled, () => false)
    .handleAction(setCurrentSelector, () => false);
const mainReducer = combineReducers<MainReducerState>({
    connected: connectedReducer,
    selector: selectorReducer,
    isInspectEnabled: inspectReducer,
});

export default mainReducer;
