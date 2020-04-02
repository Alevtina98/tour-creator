import * as mainActions from "../mainAction";
import mainReducer from "../../reducers/MainReducer";

describe("mainActions", function() {
    it("should return correct type", function() {
        expect(mainActions.connectSuccess()).toEqual({
            type: "CONNECTION_SUCCESS"
        });
        expect(mainActions.burgerOpen()).toEqual({
            type: "BURGER_OPEN"
        });
        expect(mainActions.burgerClose()).toEqual({
            type: "BURGER_CLOSE"
        });
    });
});

