import { createStandardAction } from "typesafe-actions";
import { ModalState } from "../reducers/ModalReducer";

export const setModal = createStandardAction("SET_MODAL")<ModalState>();
export const clearModal = createStandardAction("CLEAR_MODAL")();
