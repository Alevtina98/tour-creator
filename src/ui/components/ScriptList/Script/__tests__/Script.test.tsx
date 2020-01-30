import React from "react";
import { render, cleanup, fireEvent, waitForElement, waitForElementToBeRemoved } from "@testing-library/react";
import ProviderWithComponent from "../../../../store/ProviderWithComponent";
import Script from "../Script";
import IDB from "../../../../util/indexedDB";
import { getInitData, TourType } from "../../../../util/restClient/requestTour";

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: TourType = getInitData();
    const onClick = jest.fn();
    it("should Script render", () => {
        const onClick = jest.fn();
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        expect(getByTestId("tour-name").textContent).toBe("custom name");
        expect(getByTestId("tour-time").textContent).toBe("24-10-2019 в 10:52:15");
    });
    it("should ModelChange render", async () => {
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        fireEvent.click(getByTestId("edit-button"));
        await waitForElement(() => getByTestId("edit-model"));
        expect(getByTestId("changeName").value).toBe(testTour.name);
        expect(getByTestId("changeDesc").value).toBe(testTour.desc);
        fireEvent.click(getByTestId("cancel-edit-button"));
        await waitForElementToBeRemoved(() => getByTestId("edit-model"));
        fireEvent.click(getByTestId("edit-button"));
        await waitForElement(() => getByTestId("edit-model"));
        fireEvent.click(getByTestId("save-edit-button"));
        await waitForElementToBeRemoved(() => getByTestId("edit-model"));
    });
    it("should ModelDel render", async () => {
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        fireEvent.click(getByTestId("del-button"));
        await waitForElement(() => getByTestId("del-model"));
        expect(getByTestId("del-name").textContent).toBe("Вы действительно хотите удалить custom name?");
        fireEvent.click(getByTestId("cancel-del-button"));
        await waitForElementToBeRemoved(() => getByTestId("del-model"));
        fireEvent.click(getByTestId("del-button"));
        await waitForElement(() => getByTestId("del-model"));
        fireEvent.click(getByTestId("save-del-button"));
        await waitForElementToBeRemoved(() => getByTestId("del-model"));
    });
    it("should ModelChange", async () => {
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        await (await IDB()).put("script", testTour, testtour.id);
        fireEvent.click(getByTestId("edit-button"));
        expect(getByTestId("changeName").value).toBe(testTour.name);
        expect(getByTestId("changeDesc").value).toBe(testTour.desc);
        fireEvent.click(getByTestId("cancel-edit-button"));
        //Отмена изменения
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), { target: { value: "change custom name" } });
        fireEvent.click(getByTestId("cancel-edit-button"));
        const tour_get: TourType | undefined = await (await IDB()).get("script", testtour.id);
        expect(tour_get.name).toBe(testTour.name);
        //Сохранение изменения
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), { target: { value: "change custom name" } });
        fireEvent.click(getByTestId("save-edit-button"));
        const tour_get3: TourType | undefined = await (await IDB()).get("script", testtour.id);
        expect(tour_get3.name).toBe("change custom name");
        (await IDB()).delete("script", testtour.id);
    });
    it("should ModelDel", async () => {
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        await (await IDB()).put("script", testTour, testtour.id);
        //Отмена удаления
        fireEvent.click(getByTestId("del-button"));
        fireEvent.click(getByTestId("cancel-del-button"));
        const tour_test2_get: TourType | undefined = await (await IDB()).get("script", testtour.id);
        expect(tour_test2_get).not.toBeUndefined();
        //Подтверждение удаления
        fireEvent.click(getByTestId("del-button"));
        fireEvent.click(getByTestId("save-del-button"));
        const tour_test2_get3: TourType | undefined = await (await IDB()).get("script", testtour.id);
        expect(tour_test2_get3).toBeUndefined();
    });
});
