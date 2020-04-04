import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    setSelectedTour,
    SelectedTourAction,
    setLoadBocklyEnabled,
    setLoadBocklyDisabled,
    setListTour,
    setErrorsRunTour,
    addErrorRunTour
} from "../actions/selectedTourAction";
import { getInitData, TourType } from "../util/restClient/requestTour";

export interface SelectedTourReducerState {
    selectedTour: TourType;
    blocklyReloadEnabled: boolean;
    listTour: TourType[];
    errorsRunTour: string[];
}
const initTourType = getInitData();
const selectedTourReducer = createReducer<TourType, SelectedTourAction>(initTourType).handleAction(
    setSelectedTour,
    (state, action) => action.payload
);
const errorsRunTourReducer = createReducer<string[]>([])
    .handleAction(setErrorsRunTour, (state, action) => action.payload)
    .handleAction(addErrorRunTour, (state, action) => [...state, action.payload]);

const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setLoadBocklyEnabled, () => true)
    .handleAction(setLoadBocklyDisabled, () => false);
const listTourReducer = createReducer<TourType[]>([]).handleAction(setListTour, (state, action) => action.payload);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    selectedTour: selectedTourReducer,
    blocklyReloadEnabled: blocklyLoadReducer,
    listTour: listTourReducer,
    errorsRunTour: errorsRunTourReducer
});

export default SelectedTourReducer;
