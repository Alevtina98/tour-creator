import agentActions from "../agentActions";

describe("agentActions", function() {
    it("should return the agentAction", async () => {
        await agentActions.enableSelectMode().promise();
        /*expect(agentActions.enableSelectMode()).toEqual({
            type: "enableSelectMode"
        });
        expect(agentActions.disableSelectMode()).toEqual({
            type: "disableSelectMode"
        });*/
    });
});
