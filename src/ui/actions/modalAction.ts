import { createStandardAction } from "typesafe-actions";
import { TourType } from "../util/restClient/requestTour";

export const setTourModal = createStandardAction("SET_TOUR_MODAL")<TourType>();
export const setIdDeleted = createStandardAction("SET_ID_MODAL")<number>();
