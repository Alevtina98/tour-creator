import { createStandardAction } from "typesafe-actions";
import { TourType } from "../util/restClient/requestTour";
import { Dispatch } from "redux";
import { StatusType } from "../reducers/ModalReducer";

export const setModalTour = createStandardAction("SET_TOUR_MODAL")<TourType | null>();
export const setModalStatus = createStandardAction("SET_STATUS_MODAL")<StatusType>();
//export const clearModalTour = createStandardAction("CLEAN_TOUR_MODAL")();
//export const clearModalStatus = createStandardAction("CLEAN_STATUS_MODAL")();

export const setModal = (tour: TourType, status: StatusType) => (dispatch: Dispatch) => {
    dispatch(setModalTour(tour));
    dispatch(setModalStatus(status));
};
export const clearModal = () => (dispatch: Dispatch) => {
    dispatch(setModalTour(null));
    dispatch(setModalStatus(null));
};