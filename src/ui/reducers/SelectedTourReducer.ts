import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import {
    setSelectedTour,
    SelectedTourAction,
    setTourOpen,
    setTourClose,
    setListTour,
    setErrorsRunTour,
    addErrorRunTour,
    setPeriodicSaveEnabled,
    setPeriodicSaveDisabled
} from "../actions/selectedTourAction";
import { getInitData, TourType } from "../util/tour";

export interface SelectedTourReducerState {
    selectedTour: TourType;
    periodicSave: boolean;
    tourOpen: boolean;
    listTour: TourType[];
    errorsRunTour: string[];
}
const initTourType = getInitData();
const selectedTourReducer = createReducer<TourType, SelectedTourAction>(initTourType).handleAction(
    setSelectedTour,
    (state, action) => action.payload
);
const periodicSaveReducer = createReducer<boolean>(false)
    .handleAction(setPeriodicSaveEnabled, () => true)
    .handleAction(setPeriodicSaveDisabled, () => false);

const blocklyLoadReducer = createReducer<boolean>(false)
    .handleAction(setTourOpen, () => true)
    .handleAction(setTourClose, () => false);
const listTourReducer = createReducer<TourType[]>([]).handleAction(setListTour, (state, action) => action.payload);

const errorsRunTourReducer = createReducer<string[]>([])
    .handleAction(setErrorsRunTour, (state, action) => action.payload)
    .handleAction(addErrorRunTour, (state, action) => [...state, action.payload]);

const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    selectedTour: selectedTourReducer,
    periodicSave: periodicSaveReducer,
    tourOpen: blocklyLoadReducer,
    listTour: listTourReducer,
    errorsRunTour: errorsRunTourReducer
});

export default SelectedTourReducer;
