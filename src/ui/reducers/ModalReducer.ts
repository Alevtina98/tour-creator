import { createReducer } from "typesafe-actions";
import { TourType } from "../util/restClient/requestTour";
import { clearModal, setModal } from "../actions/modalAction";
import { setInspectDisabled } from "../actions/inspectAction";

export type StatusType = "delete" | "show" | "create" | "copy" | "edit" | "inspect";

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
    .handleAction(clearModal || setInspectDisabled, () => initModal);

export default ModalReducer;
