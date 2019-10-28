import React from "react";
import {render, cleanup, fireEvent, waitForElement, waitForElementToBeRemoved, getByText, findByRole} from "@testing-library/react";
import ProviderWithComponent from "../../../../store/ProviderWithComponent";
import Script from "../Script";
import IDB, { ScriptValue } from "../../../../util/indexedDB";
import 'fake-indexeddb/auto';

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: ScriptValue = {
        key: "custom-key",
        name: "custom name",
        code: "...",
        desc: "custom description",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    };
    const onClick = jest.fn();
    it("should Script render", () => {
        const onClick = jest.fn();
        const { getByTestId } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );
        expect(getByTestId("tour-name").textContent).toBe("custom name");
        expect(getByTestId("tour-time").textContent).toBe("24-10-2019 в 10:52:15");
    });
    it("should Script ModelOnClickShow", async () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );
        //expect(queryByText("Редактирование шаблона")).toBeNull();
        //expect(document.body.classList.contains("modal-open")).toBe(false);
        //expect(getByTestId("edit-model")).toBeNull();

        fireEvent.click(getByTestId("edit-button"));
        expect(getByTestId("edit-model")).not.toBeNull();
        fireEvent.click(getByTestId("cancel-edit-button"));
        expect(getByTestId("edit-model")).toBeNull();

        fireEvent.click(getByTestId("edit-button"));
        fireEvent.click(getByTestId("save-edit-button"));

        await waitForElementToBeRemoved(() => getByText("edit-button"))
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.abort(getByTestId("edit-model"));
    });
    it("should Script ModelChange", async () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );

        await (await IDB()).put("script", testTour, testTour.key);
        const result: ScriptValue | undefined = await (await IDB()).get("script", testTour.key);
        console.log("result >>", result );
        console.log(result);

        fireEvent.click(getByTestId("edit-button"));
        expect(queryByText("Редактирование шаблона")).not.toBeNull();
        expect(getByTestId("changeName").value).toBe("custom name");
        expect(getByTestId("changeDesc").value).toBe("custom description");
        fireEvent.click(getByTestId("cancel-edit-button"));

        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.click(getByTestId("cancel-edit-button"));
        expect(testTour.name).toBe("custom name");

        fireEvent.click(getByTestId("edit-button"));
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.abort(getByTestId("edit-model"));
        expect(testTour.name).toBe("custom name");

        fireEvent.click(getByTestId("edit-button"));
        expect(queryByText("fade modal show")).toBeNull();
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.click(getByTestId("save-edit-button"));
        expect(testTour.name).toBe("change custom name");
    });
    it("should Script ModelDel", () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );
        fireEvent.click(getByTestId("del-model"));
        expect(queryByText("Подтверждение удаления тура")).not.toBeNull();
        fireEvent.click(getByTestId("cancel-del-button"));

        fireEvent.click(getByTestId("del-button"));
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.click(getByTestId("cancel-del-button"));
        expect(testTour.name).toBe("custom name");

        fireEvent.click(getByTestId("del-button"));
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.abort(getByTestId("del-model"));
        expect(testTour.name).toBe("custom name");

        fireEvent.click(getByTestId("del-button"));
        fireEvent.change(getByTestId("changeName"), {target: {value: "change custom name"}});
        fireEvent.click(getByTestId("save-edit-button"));
        expect(testTour.name).toBe("change custom name");
    });
    it("should Script ModelOnClickDelete", () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );
        expect(queryByText("Подтверждение удаления тура")).toBeNull();
        fireEvent.click(getByTestId("delete-button"));
        expect(queryByText("Подтверждение удаления тура")).not.toBeNull();
    });
});
