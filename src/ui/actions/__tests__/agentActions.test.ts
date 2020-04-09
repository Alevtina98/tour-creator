import agentActions from "../agentActions";
import chrome from "sinon-chrome/extensions";
import { postMessageParams, testPort } from "../../port";

describe("agentActions", function() {
    beforeAll(async () => {
        global.chrome = chrome;
        testPort.postMessage = jest.fn((obj: postMessageParams) => null);
    });
    afterAll(async () => {
        chrome.flush();
        delete global.chrome;
    });
    it("should be post on the enableSelectMode", async () => {
        agentActions.enableSelectMode();
        const messageObj = {
            name: "enableSelectMode",
            data: {},
            tabId: null
        };
        expect(testPort.postMessage).toHaveBeenCalledWith(messageObj);
    });
    it("should be post on the disableSelectMode", async () => {
        agentActions.disableSelectMode();
        const messageObj = {
            name: "disableSelectMode",
            data: {},
            tabId: null
        };
        expect(testPort.postMessage).toHaveBeenCalledWith(messageObj);
    });
    it("should be post on the runScript", async () => {
        agentActions.runScript("any_script");
        const messageObj = {
            name: "runScript",
            data: "any_script",
            tabId: null
        };
        expect(testPort.postMessage).toHaveBeenCalledWith(messageObj);
    });
    it("should be post on the disableRunScript", async () => {
        agentActions.disableRunScript();
        const messageObj = {
            name: "disableRunScript",
            data: {},
            tabId: null
        };
        expect(testPort.postMessage).toHaveBeenCalledWith(messageObj);
    });
});
