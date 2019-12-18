import ScriptButtons from "../ScriptButtons";
import { ScriptValue } from "../../../util/indexedDB";
import { cleanup, render } from "@testing-library/react";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import * as React from "react";
import sinonChrome from "sinon-chrome";

const testTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
describe("ScriptButtons", () => {
    /*beforeAll(() => {
        chrome = sinonChrome;
    });*/
    beforeEach(() => {
        cleanup();
    });
    it("should ScriptButtons render", () => {
        const { queryByTestId, debug } = render(
            ProviderWithComponent(() => <ScriptButtons />, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourJS: "",
                    blocklyReloadEnabled: true
                },
                MainState: {
                    connection: true
                }
            } as any)()
        ); /*debug();
        expect(queryByTestId("createTourButton").textContent).not.toBeNull;
        expect(queryByTestId("copyTourButton").textContent).not.toBeNull;
        expect(queryByTestId("saveTourButton").textContent).not.toBeNull;
        expect(queryByTestId("runTourButton").textContent).not.toBeNull;*/
    });
    afterEach(() => {
        sinonChrome.reset();
    });
});
