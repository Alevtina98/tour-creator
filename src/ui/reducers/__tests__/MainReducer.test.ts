import * as mainAction from "../../actions/mainAction"
import mainReducer from "../MainReducer";


describe("MainReducer", function() {
    const initialState = {
        connected: false,
        burgerIsOpen: false
    };
    it("should change state", function() {
        expect(mainReducer(initialState, mainAction.connectSuccess())).toEqual({
            ...initialState,
            connected: true
        });
        expect(mainReducer(initialState, mainAction.burgerOpen())).toEqual({
            ...initialState,
            burgerIsOpen: true
        });
        expect(mainReducer(initialState, mainAction.burgerClose())).toEqual({
            ...initialState,
            burgerIsOpen: false
        });
    });
});