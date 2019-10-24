import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import ProviderWithComponent from "../../../../store/ProviderWithComponent";
import Script from "../Script";
import { ScriptValue } from "../../../../util/indexedDB";

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
        expect(getByTestId("tour-time").textContent).toBe("24-10-2019 в 10:52");
    });
    it("should Script onClick", () => {
        const { getByTestId, queryByText } = render(
            ProviderWithComponent(() => <Script onClick={onClick} tour={testTour} />, {
                SelectedTourState: {
                    tourDB: {
                        key: "test-key"
                    }
                }
            } as any)()
        );
        expect(queryByText("Редактирование шаблона")).toBeNull();
        fireEvent.click(getByTestId("edit-button"));
        expect(queryByText("Редактирование шаблона")).not.toBeNull();
    });
});
