import {cleanup, queryByTestId, render, waitForElement} from "@testing-library/react";
import { ScriptValue } from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import Script from "../../ScriptList/Script/Script";
import React from "react";
import DateOnPanel from "../DateOnPanel";
import { format } from "date-fns";

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: ScriptValue = {
        key: "custom-key",
        name: "custom name",
        code: "<xml/>",
        desc: "custom description",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    };
    it("date show", () => {
        const { getByTestId, queryByTestId, debug } = render(
            ProviderWithComponent(() => <DateOnPanel showDate={true}/>, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourXML: testTour.code,
                    blocklyReloadEnabled: true
                }
            } as any)()
        );
        debug();
        expect(getByTestId("panel-date").textContent).toBe(
            `Последнее сохранение ${format(new Date(testTour.date), "dd-MM-yyyy в HH:mm:ss")}`
        );
        expect(queryByTestId("panel-not-date")).toBeNull();
        expect(queryByTestId("panel-not-save")).toBeNull();
    });
    it("without date", () => {
        const { getByTestId, queryByTestId } = render(
            ProviderWithComponent(DateOnPanel, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourXML: testTour.code,
                    blocklyReloadEnabled: true
                }
            } as any)()
        );
        expect(getByTestId("panel-not-date").textContent).toBe("Все изменения сохранены");
        expect(queryByTestId("panel-date")).toBeNull();
        expect(queryByTestId("panel-not-save")).toBeNull();
    });
    it("not save", () => {
        const { getByTestId, queryByTestId, debug } = render(
            ProviderWithComponent(DateOnPanel, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourXML: "new code",
                    blocklyReloadEnabled: true
                }
            } as any)()
        );
        expect(getByTestId("panel-not-save").textContent).toBe("...");
        debug();
        expect(queryByTestId("panel-date")).toBeNull();
        expect(queryByTestId("panel-not-date")).toBeNull();
    });
    it("not load tour", () => {
        const { queryByTestId } = render(
            ProviderWithComponent(DateOnPanel, {
                SelectedTourState: {
                    blocklyReloadEnabled: false
                }
            } as any)()
        );
        expect(queryByTestId("panel-date")).toBeNull();
        expect(queryByTestId("panel-not-date")).toBeNull();
        expect(queryByTestId("panel-not-save")).toBeNull();
    });
});
