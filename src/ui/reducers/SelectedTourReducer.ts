import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    setTourDB,
    SelectedTourAction,
    setTourXML,
    isLoadingDB,
    setLoadBocklyEnabled,
    setLoadBocklyDisabled,
    setListTour, setTourJS
} from "../actions/selectedTourAction";
import uuid from "uuid";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
    listTour: ScriptValue[];
    tourJS: string;
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
    setTourDB,
    (state, action) => action.payload
);
const tourBlocklyReducer = createReducer<string>("").handleAction(setTourXML, (state, action) => action.payload);
const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const listTourReducer = createReducer<ScriptValue[]>([]).handleAction(setListTour, (state, action) => action.payload);
const tourJSReducer = createReducer<string>("").handleAction(setTourJS, (state, action) => action.payload);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: tourDBReducer,
    tourXML: tourBlocklyReducer,
    isLoadingDB: isLoadingDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer,
    listTour: listTourReducer,
    //toutDBKey: SelectedIndexReducer
    tourJS: tourJSReducer
});

export default SelectedTourReducer;
