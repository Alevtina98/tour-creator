import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { getInitData, TourType } from "../util/restClient/requestTour";
import { setIdDeleted, setTourModal } from "../actions/modalAction";

export interface ModalReducerState {
    tour: TourType;
    idDeleted: number;
}

const tourModalReducer = createReducer<TourType>(getInitData()).handleAction(
    setTourModal,
    (state, action) => action.payload
);
const tourIdDelReducer = createReducer<number>(-1).handleAction(setIdDeleted, (state, action) => action.payload);

const ModalReducer = combineReducers<ModalReducerState>({
    tour: tourModalReducer,
    idDeleted: tourIdDelReducer
});

export default ModalReducer;
