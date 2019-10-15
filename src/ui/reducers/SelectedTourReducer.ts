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
    setListTour
} from "../actions/selectedTourAction";
import uuid from "uuid";

export interface SelectedTourReducerState {
    tourDB: ScriptValue;
    tourXML: string;
    isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
    listTour: ScriptValue[];
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
const TourBlocklyReducer = createReducer<string>("").handleAction(setTourXML, (state, action) => action.payload);
const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const ListTourReducer = createReducer<ScriptValue[]>([]).handleAction(setListTour, (state, action) => action.payload);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: tourDBReducer,
    tourXML: TourBlocklyReducer,
    isLoadingDB: isLoadingDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer,
    listTour: ListTourReducer
    //toutDBKey: SelectedIndexReducer
});

export default SelectedTourReducer;
