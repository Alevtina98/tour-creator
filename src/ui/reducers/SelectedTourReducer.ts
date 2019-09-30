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
const nameReducer = createReducer<string, SelectedTourAction>("");
const dateReducer = createReducer<string, SelectedTourAction>("");
const deskReducer = createReducer<string, SelectedTourAction>("");
const codeReducer = createReducer<string, SelectedTourAction>("").handleAction(
    setCode,
    (state, action) => action.payload,
);
const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    name: nameReducer,
    date: dateReducer,
    desc: deskReducer,
    code: codeReducer,
});

export default SelectedTourReducer;
