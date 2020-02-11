import { createStandardAction } from "typesafe-actions";
import { ModalReducerState } from "../reducers/ModalReducer";

export const setModal = createStandardAction("SET_MODAL")<ModalReducerState>();
export const clearModal = createStandardAction("CLEAR_MODAL")();
