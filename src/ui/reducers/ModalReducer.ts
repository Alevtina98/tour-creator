import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { TourType } from "../util/restClient/requestTour";
import { setModalStatus, setModalTour } from "../actions/modalAction";

export interface ModalReducerState {
    tour: TourType | null;
    status: string | null;
}

const tourModalReducer = createReducer<TourType | null>(null).handleAction(
    setModalTour,
    (state, action) => action.payload
);

const statusModalReducer = createReducer<string | null>(null).handleAction(
    setModalStatus,
    (state, action) => action.payload
);

const ModalReducer = combineReducers<ModalReducerState>({
    tour: tourModalReducer,
    status: statusModalReducer
});

export default ModalReducer;
