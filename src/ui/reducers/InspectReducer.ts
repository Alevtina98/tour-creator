import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    CurrentSelectorAction,
    setCurrentSelector,
    SetInspectActions,
    setInspectDisabled,
    setInspectEnabled,
} from "../actions/inspectAction";

export interface InspectReducerState {
    selector: string;
    isInspectEnabled: boolean;
}

const selectorReducer = createReducer<string, CurrentSelectorAction>("").handleAction(
    setCurrentSelector,
    (state, action) => action.payload,
);
const inspectReducer = createReducer<boolean, SetInspectActions>(false)
    .handleAction(setInspectEnabled, () => true)
    .handleAction(setInspectDisabled, () => false)
    .handleAction(setCurrentSelector, () => false);

const InspectReducer = combineReducers<InspectReducerState>({
    selector: selectorReducer,
    isInspectEnabled: inspectReducer,
});

export default InspectReducer;
