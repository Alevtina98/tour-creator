import React from "react";
import {
    render,
    cleanup,
    fireEvent,
    waitForElement,
    waitForElementToBeRemoved,
    getByText,
    findByRole
} from "@testing-library/react";
import ProviderWithComponent from "../../../../store/ProviderWithComponent";
import Script from "../Script";
import IDB, { ScriptValue } from "../../../../util/indexedDB";
import "fake-indexeddb/auto";

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: ScriptValue = {
        key: "custom-key",
        name: "custom name",
        code: "<xml/>",
        desc: "custom description",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    };
    const onClick = jest.fn();
    it("should Script render", () => {
        const onClick = jest.fn();
        const { getByTestId } = render(ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)());
        /*ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );*/
        expect(getByTestId("tour-name").textContent).toBe("custom name");
        expect(getByTestId("tour-time").textContent).toBe("24-10-2019 в 10:52:15");
    });
    it("should Script ModelOnClickShow", async () => {
        const { getByTestId, queryByText,  } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)()
        );
        //expect(queryByText("Редактирование шаблона")).toBeNull();
        //expect(document.body.classList.contains("modal-open")).toBe(false);
        //expect(getByTestId("edit-model")).toBeNull();

        /*expect(queryByText("Подтверждение удаления тура")).toBeNull();
        fireEvent.click(getByTestId("delete-button"));
        expect(queryByText("Подтверждение удаления тура")).not.toBeNull();

        fireEvent.click(getByTestId("edit-button"));
        expect(getByTestId("edit-model")).not.toBeNull();
        fireEvent.click(getByTestId("cancel-edit-button"));
        expect(getByTestId("edit-model")).toBeNull();

        fireEvent.click(getByTestId("edit-button"));
        fireEvent.click(getByTestId("save-edit-button"));

        await waitForElementToBeRemoved(() => getByText("edit-button"));
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.abort(getByTestId("edit-model"));*/
        fireEvent.abort(getByTestId("edit-button"));
        expect(getByTestId("changeName").value).toBe(testTour.name);
        expect(getByTestId("changeDesc").value).toBe(testTour.desc);
    });
    it("should Script ModelChange", async () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)()
        );
        await (await IDB()).put("script", testTour, testTour.key);
        fireEvent.click(getByTestId("edit-button"));
        expect(queryByText("Редактирование шаблона")).not.toBeNull();
        expect(getByTestId("changeName").value).toBe("custom name");
        expect(getByTestId("changeDesc").value).toBe("custom description");
        fireEvent.click(getByTestId("cancel-edit-button"));
        //Отмена изменения
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), { target: { value: "change custom name" } });
        fireEvent.click(getByTestId("cancel-edit-button"));
        const tour_get: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_get.name).toBe("custom name");
        //Прерывание изменения
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), { target: { value: "change custom name" } });
        fireEvent.abort(getByTestId("edit-model"));
        const tour_get2: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_get2.name).toBe("custom name");
        //Сохранение изменения
        fireEvent.click(getByTestId("edit-button"));
        expect(queryByText("fade modal show")).toBeNull();
        fireEvent.change(getByTestId("changeName"), { target: { value: "change custom name" } });
        fireEvent.click(getByTestId("save-edit-button"));
        const tour_get3: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_get3.name).toBe("change custom name");
        (await IDB()).delete("script", testTour.key);
    });
    it("should Script ModelDel", async () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />)()
        );
        await (await IDB()).put("script", testTour, testTour.key);
        //Отмена удаления
        fireEvent.click(getByTestId("del-button"));
        fireEvent.click(getByTestId("cancel-del-button"));
        const tour_test2_get: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_test2_get).not.toBeUndefined();
        //прерывание удаления
        fireEvent.click(getByTestId("del-button"));
        fireEvent.abort(getByTestId("del-model"));
        const tour_test2_get2: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_test2_get2).not.toBeUndefined();
        //Подтверждение удаления
        fireEvent.click(getByTestId("del-button"));
        fireEvent.click(getByTestId("save-del-button"));
        const tour_test2_get3: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        expect(tour_test2_get3).toBeUndefined();
    });
});
