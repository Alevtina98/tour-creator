import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    setTourDB,
    SelectedTourAction,
    setTourXML,
    setKey,
    isLoadingDB,
    setLoadBocklyEnabled, setLoadBocklyDisabled
} from "../actions/selectedTourAction";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
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
const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(true)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: TourDBReducer,
    tourXML: TourBlocklyReducer,
    isLoadingDB: isLoadingDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer
    //selectedIndex: SelectedIndexReducer
});

export default SelectedTourReducer;
