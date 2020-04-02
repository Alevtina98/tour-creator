import inspectReducer from "../InspectReducer";
import * as inspectAction from "../../actions/inspectAction"

describe("InspectReducer", function() {
    const initialState = {
        selector: "",
        isInspectEnabled: false
    };
    it("should change state", function() {
        expect(inspectReducer(initialState, inspectAction.setInspectEnabled())).toEqual({
            ...initialState,
            isInspectEnabled: true
        });
        expect(inspectReducer(initialState, inspectAction.setInspectDisabled())).toEqual({
            ...initialState,
            isInspectEnabled: false
        });
        expect(inspectReducer(initialState, inspectAction.setCurrentSelector("any_selector"))).toEqual({
            ...initialState,
            selector: "any_selector"
        });
    });
});