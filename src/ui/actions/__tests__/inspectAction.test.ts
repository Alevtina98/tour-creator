import * as inspectActions from "../inspectAction";
import InspectReducer from "../../reducers/InspectReducer";


describe("inspectAction", function() {
    const initialState = {
        selector: "",
        isInspectEnabled: false
    };
    it("should return correct type", function() {
        expect(inspectActions.setInspectEnabled()).toEqual({
            type: "SET_INSPECT_ENABLED"
        });
        expect(inspectActions.setInspectDisabled()).toEqual({
            type: "SET_INSPECT_DISABLED"
        });
        expect(inspectActions.setCurrentSelector("")).toEqual({
            type: "SET_CURRENT_SELECTOR"
        });
    });
    it("should change state", function() {
        expect(InspectReducer(initialState, inspectActions.setInspectEnabled())).toEqual({
            ...initialState,
            isInspectEnabled: true
        });
        expect(InspectReducer(initialState, inspectActions.setInspectDisabled())).toEqual({
            ...initialState,
            isInspectEnabled: false
        });
        expect(InspectReducer(initialState, inspectActions.setCurrentSelector("div"))).toEqual({
            ...initialState,
            selector: "div"
        });
    });
});
