import { createReducer } from "typesafe-actions";
import { combineReducers, Dispatch } from "redux";
import {
    setTourDB,
    SelectedTourAction,
    setTourXML,
    //isLoadingDB,
    setLoadBocklyEnabled,
    setLoadBocklyDisabled,
    setListTour,
    setTourJS,
    setErrorsRunTour,
    addErrorRunTour
} from "../actions/selectedTourAction";
import uuid from "uuid";
import { getInitData, TourType } from "../util/restClient/requestTour";

export interface SelectedTourReducerState {
    tourDB: TourType;
    tourXML: string;
    //isLoadingDB: boolean;
    blocklyReloadEnabled: boolean;
    listTour: TourType[];
    tourJS: string;
    errorsRunTour: string[];
    //toutDBKey: string;
}
const initTourType = getInitData();
const tourDBReducer = createReducer<TourType, SelectedTourAction>(initTourType).handleAction(
    setTourDB,
    (state, action) => action.payload
);
const tourBlocklyReducer = createReducer<string>("").handleAction(setTourXML, (state, action) => action.payload);
const errorsRunTourReducer = createReducer<string[]>([])
    .handleAction(setErrorsRunTour, (state, action) => action.payload)
    .handleAction(addErrorRunTour, (state, action) => [...state, action.payload]);

//const isLoadingDBReducer = createReducer<boolean>(false).handleAction(isLoadingDB, () => true);
//const SelectedIndexReducer = createReducer<string>("").handleAction(setKey, (state, action) => action.payload);
const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const listTourReducer = createReducer<TourType[]>([]).handleAction(setListTour, (state, action) => action.payload);
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
