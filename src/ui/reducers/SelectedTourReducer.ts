import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { setCode, SelectedTourAction } from "../actions/SelectedTourAction";

export interface SelectedTourReducerState {
    name: string;
    date: string;
    desc: string;
    code: string;
}

const codeReducer = createReducer<string, SelectedTourAction>("").handleAction(
    setCode,
    (state, action) => action.payload,
);
const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    code: codeReducer,
});

export default SelectedTourReducer;
