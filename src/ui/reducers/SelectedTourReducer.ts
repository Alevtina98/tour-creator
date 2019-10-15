import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    settourDB,
    SelectedTourAction,
    setTourXML,
    isLoadingDB,
    setLoadBocklyEnabled, setLoadBocklyDisabled
} from "../actions/selectedTourAction";
import uuid from "uuid";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
    //toutDBKey: string;
}
const initScriptValue = {
    name: "NewTour",
    date: "",
    desc: "",
    code: "",
    key: uuid.v4()
};
const tourDBReducer = createReducer<ScriptValue, SelectedTourAction>(initScriptValue).handleAction(
    settourDB,
    (state, action) => action.payload
);
const TourBlocklyReducer = createReducer<string>("").handleAction(setTourXML, (state, action) => action.payload);
const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: tourDBReducer,
    tourXML: TourBlocklyReducer,
    isLoadingDB: isLoadingDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer
    //toutDBKey: SelectedIndexReducer
});

export default SelectedTourReducer;
