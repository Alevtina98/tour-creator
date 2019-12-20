import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import {combineReducers, Dispatch} from "redux";
import {
    setTourDB,
    SelectedTourAction,
    setTourXML,
    //isLoadingDB,
    setLoadBocklyEnabled,
    setLoadBocklyDisabled,
    setListTour,
    setTourJS, setErrorsRunTour, addErrorsRunTour, addErrorRunTour
} from "../actions/selectedTourAction";
import uuid from "uuid";
import {StoreType} from "./index";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    //isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
    listTour: ScriptValue[];
    tourJS: string;
    errorsRunTour: string[];
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
const errorsRunTourReducer = createReducer<string[]>([]).handleAction(
    setErrorsRunTour,
    (state, action) => action.payload
).handleAction(
    addErrorRunTour,
    (state, action) => [...state, action.payload]
);



//const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const listTourReducer = createReducer<ScriptValue[]>([]).handleAction(setListTour, (state, action) => action.payload);
const tourJSReducer = createReducer<string>("").handleAction(setTourJS, (state, action) => action.payload);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: tourDBReducer,
    tourXML: tourBlocklyReducer,
    //isLoadingDB: isLoadingDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer,
    listTour: listTourReducer,
    //toutDBKey: SelectedIndexReducer
    tourJS: tourJSReducer,
    errorsRunTour: errorsRunTourReducer
});

export default SelectedTourReducer;
