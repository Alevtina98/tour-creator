import ScriptButtons from "../ScriptButtons";
import { cleanup, render } from "@testing-library/react";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import * as React from "react";
import sinonChrome from "sinon-chrome";
import { getInitData, TourType } from "../../../util/restClient/requestTour";

const testTour: TourType = getInitData();
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
                    selectedTour: testTour,
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
