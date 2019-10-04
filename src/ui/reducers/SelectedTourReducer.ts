import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { setTourDB, SelectedTourAction, setTourBlockly } from "../actions/selectedTourAction";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
}
const initScriptValue = {
    name: "",
    date: Date(),
    desc: "newTour",
    code: "",
    dateLastSave: ""
};
const TourDBReducer = createReducer<ScriptValue, SelectedTourAction>(initScriptValue).handleAction(
    setTourDB,
    (state, action) => action.payload
);
const TourBlocklyReducer = createReducer<string>("").handleAction(setTourBlockly, (state, action) => action.payload);
const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: TourDBReducer,
    tourXML: TourBlocklyReducer
});

export default SelectedTourReducer;
