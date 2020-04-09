import { cleanup, render } from "@testing-library/react";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import Script from "../../ScriptList/Script/Script";
import React from "react";
import DateOnPanel from "../DateOnPanel";
import { format } from "date-fns";
import { getDateClientFormat, getInitData, TourType } from "../../../util/tour";

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: TourType = getInitData();
    it("date show", () => {
        const { getByTestId, queryByTestId, debug } = render(
            ProviderWithComponent(() => <DateOnPanel showDate={true} />, {
                SelectedTourState: {
                    selectedTour: testTour,
                    tourXML: testTour.code,
                    tourOpen: true
                }
            } as any)()
        );
        debug();
        expect(getByTestId("panel-date").textContent).toBe(
            `Последнее сохранение ${getDateClientFormat(testTour.dateChange)}`
        );
        expect(queryByTestId("panel-not-date")).toBeNull();
        expect(queryByTestId("panel-not-save")).toBeNull();
    });
    it("without date", () => {
        const { getByTestId, queryByTestId } = render(
            ProviderWithComponent(DateOnPanel, {
                SelectedTourState: {
                    selectedTour: testTour,
                    tourXML: testTour.code,
                    tourOpen: true
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
                    selectedTour: testTour,
                    tourXML: "new code",
                    tourOpen: true
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
                    tourOpen: false
                }
            } as any)()
        );
        expect(queryByTestId("panel-date")).toBeNull();
        expect(queryByTestId("panel-not-date")).toBeNull();
        expect(queryByTestId("panel-not-save")).toBeNull();
    });
});
