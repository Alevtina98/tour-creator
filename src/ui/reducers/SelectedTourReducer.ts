import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { setTourDB, SelectedTourAction, setTourXML, setKey} from "../actions/selectedTourAction";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    //selectedIndex: string;
}
const initScriptValue = {
    name: "",
    date: "",
    desc: "",
    code: ""
};
const TourDBReducer = createReducer<ScriptValue, SelectedTourAction>(initScriptValue).handleAction(
    setTourDB,
    (state, action) => action.payload
);
const TourBlocklyReducer = createReducer<string>("").handleAction(setTourXML, (state, action) => action.payload);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: TourDBReducer,
    tourXML: TourBlocklyReducer,
    //selectedIndex: SelectedIndexReducer
});

export default SelectedTourReducer;
