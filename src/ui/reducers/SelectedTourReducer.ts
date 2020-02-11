import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    setTourDB,
    SelectedTourAction,
    setLoadBocklyEnabled,
    setLoadBocklyDisabled,
    setListTour,
    setErrorsRunTour,
    addErrorRunTour,
    editTourDB
} from "../actions/selectedTourAction";
import { getInitData, TourType } from "../util/restClient/requestTour";

export interface SelectedTourReducerState {
    tourDB: TourType;
    blocklyReloadEnabled: boolean;
    listTour: TourType[];
    errorsRunTour: string[];
}
const initTourType = getInitData();
const tourDBReducer = createReducer<TourType, SelectedTourAction>(initTourType)
    .handleAction(setTourDB, (state, action) => action.payload)
    .handleAction(editTourDB, (state, action) => ({
        ...state,
        ...action.payload
    }));

const errorsRunTourReducer = createReducer<string[]>([])
    .handleAction(setErrorsRunTour, (state, action) => action.payload)
    .handleAction(addErrorRunTour, (state, action) => [...state, action.payload]);

const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const listTourReducer = createReducer<TourType[]>([]).handleAction(setListTour, (state, action) => action.payload);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    tourDB: tourDBReducer,
    blocklyReloadEnabled: blocklyLoadReducer,
    listTour: listTourReducer,
    errorsRunTour: errorsRunTourReducer
});

export default SelectedTourReducer;
