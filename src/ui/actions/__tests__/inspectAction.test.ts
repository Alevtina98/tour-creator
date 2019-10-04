import * as inspectActions from "../inspectAction";

describe("inspectAction", function() {
    it("should return correct type", function() {
        expect(inspectActions.setInspectEnabled()).toEqual({
            type: "SET_INSPECT_ENABLED"
        });
    });
});
