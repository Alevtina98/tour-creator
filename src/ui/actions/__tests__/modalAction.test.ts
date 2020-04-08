import * as modalAction from "../modalAction";
import { ModalState } from "../../reducers/ModalReducer";
import { getInitData } from "../../util/tour";

describe("modalAction", function() {
    const testModal: ModalState = {
        tour: getInitData(),
        status: "create"
    };
    it("should return correct type", function() {
        expect(modalAction.setModal(testModal)).toEqual({
            meta: undefined,
            payload: testModal,
            type: "SET_MODAL"
        });
        expect(modalAction.clearModal()).toEqual({
            type: "CLEAR_MODAL"
        });
    });
});
