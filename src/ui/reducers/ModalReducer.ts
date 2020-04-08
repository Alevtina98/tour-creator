import { createReducer } from "typesafe-actions";
import { clearModal, setModal } from "../actions/modalAction";
import { setInspectDisabled } from "../actions/inspectAction";
import { TourType } from "../util/tour";

export type StatusType =
    | "delete"
    | "show"
    | "create"
    | "copy"
    | "edit"
    | "inspect"
    | "save_before_close"
    | "save_before_create";

export interface ModalState {
    tour: TourType | null;
    status: StatusType | null;
}
export const initModal: ModalState = {
    tour: null,
    status: null
};
type Actions = ReturnType<typeof setInspectDisabled | typeof setModal | typeof clearModal>;

const ModalReducer = createReducer<ModalState, Actions>(initModal)
    .handleAction(setModal, (state, action) => action.payload)
    .handleAction(clearModal, () => initModal)
    .handleAction(setInspectDisabled, () => initModal);

export default ModalReducer;
