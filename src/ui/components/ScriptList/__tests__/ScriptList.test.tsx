import { cleanup, render } from "@testing-library/react";
import { ScriptValue } from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import Script from "../../ScriptList/Script/Script";
import React from "react";
import ScriptList from "../../ScriptList/ScriptList/ScriptList";
import DateOnPanel from "../../DateOnPanel/DateOnPanel";
import { format } from "date-fns";

describe("Script", () => {
    beforeEach(cleanup);
    const testTour: ScriptValue[] = [
        {
            key: "custom-key",
            name: "custom name",
            code: "<xml/>",
            desc: "custom description",
            date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
        },
        {
            key: "custom-key2",
            name: "custom name2",
            code: "<xml/>",
            desc: "custom description2",
            date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
        },
        {
            key: "custom-key3",
            name: "custom name3",
            code: "<xml/>",
            desc: "custom description3",
            date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
        },
        {
            key: "custom-key4",
            name: "custom name4",
            code: "<xml/>",
            desc: "custom description4",
            date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
        }
    ];
    const onClick = () => {};
    it("should ScriptList render", () => {
        const { getByTestId, queryByTestId, debug } = render(
            ProviderWithComponent(() => <ScriptList onClickScript={onClick()} onClickEsc={onClick()} isOpen={true}/>, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourXML: testTour.code,
                    blocklyReloadEnabled: true
                }
            } as any)()
        );
        debug();
        /*expect(getByTestId("panel-date").textContent).toBe(
            `Последнее сохранение ${format(new Date(testTour.date), "dd-MM-yyyy в HH:mm:ss")}`
        );*/
        expect(queryByTestId("list-button-close")).not.toBeNull();
        expect(queryByTestId("list-search")).not.toBeNull();
    });
});
