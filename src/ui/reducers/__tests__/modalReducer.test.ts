import { initModal, ModalState } from "../ModalReducer";
import * as modalAction from "../../actions/modalAction";
import modalReducer from "../ModalReducer";
import { getInitData } from "../../util/tour";

describe("modalReducer", function() {
    const testModal: ModalState = {
        tour: getInitData(),
        status: "create"
    };
    // StatusType = "delete" | "show" | "create" | "copy" | "edit" | "inspect";
    it("should change state", function() {
        expect(modalReducer(initModal, modalAction.setModal(testModal))).toEqual(testModal);
        expect(modalReducer(initModal, modalAction.clearModal())).toEqual(initModal);
    });
});