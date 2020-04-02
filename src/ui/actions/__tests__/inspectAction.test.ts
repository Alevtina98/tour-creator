import * as inspectAction from "../inspectAction";

describe("inspectAction", function() {
    it("should return correct type", function() {
        expect(inspectAction.setInspectEnabled()).toEqual({
            type: "SET_INSPECT_ENABLED"
        });
        expect(inspectAction.setInspectDisabled()).toEqual({
            type: "SET_INSPECT_DISABLED"
        });
        expect(inspectAction.setCurrentSelector("any_selector")).toEqual({
            meta: undefined,
            payload: "any_selector",
            type: "SET_CURRENT_SELECTOR"
        });
    });
});
