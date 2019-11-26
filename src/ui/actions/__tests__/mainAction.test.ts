import * as mainActions from "../mainAction";
import mainReducer from "../../reducers/MainReducer";

describe("mainActions", function() {
    const initialState = {
        connected: false
    };
    it("should return correct type", function() {
        expect(mainActions.connectSuccess()).toEqual({
            type: "CONNECTION_SUCCESS"
        });
    });
    it("should change state", function() {
        expect(mainReducer(initialState, mainActions.connectSuccess())).toEqual({
            ...initialState,
            connected: true
        });
    });
});
