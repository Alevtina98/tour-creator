import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { TourType } from "../util/restClient/requestTour";
import { setModalStatus, setModalTour } from "../actions/modalAction";
import { setInspectDisabled } from "../actions/inspectAction";

export type StatusType = "delete" | "show" | "create" | "copy" | "edit" | "inspect" | null;

export interface ModalReducerState {
    tour: TourType | null;
    status: StatusType;
}

type Actions = ReturnType<typeof setInspectDisabled | typeof setModalTour | typeof setModalStatus>;

const tourModalReducer = createReducer<TourType | null, Actions>(null)
    .handleAction(setModalTour, (state, action) => action.payload)
    .handleAction(setInspectDisabled, () => null);

const statusModalReducer = createReducer<StatusType, Actions>(null)
    .handleAction(setModalStatus, (state, action) => action.payload)
    .handleAction(setInspectDisabled, () => null);

const ModalReducer = combineReducers<ModalReducerState>({
    tour: tourModalReducer,
    status: statusModalReducer
});

export default ModalReducer;
