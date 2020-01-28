import { cleanup, render } from "@testing-library/react";
import IDB from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import React from "react";
import ScriptList from "../../ScriptList/ScriptList/ScriptList";
import "fake-indexeddb/auto";
import { getInitData, ScriptValue } from "../../../util/restClient/requestTour";

describe("ScriptList", () => {
    beforeEach(cleanup);
    const testTour: ScriptValue[] = [
        getInitData({
            key: "custom-key",
            name: "custom name"
        }),
        getInitData({
            key: "custom-key2",
            name: "custom name2",
        }),
        getInitData({
            key: "custom-key3",
            name: "custom name3",
        }),
        getInitData({
            key: "custom-key4",
            name: "custom name4",
        })
    ];
    const onClick = () => {};
    it("should ScriptList render", async () => {
        const { queryByTestId } = render(
            ProviderWithComponent(() => <ScriptList onClickScript={onClick()} onClickEsc={onClick()} isOpen={true} />, {
                SelectedTourState: {
                    tourDB: testTour,
                    tourXML: testTour[0].code,
                    blocklyReloadEnabled: true
                }
            } as any)()
        );
        // debug();
        const promiseAdd = testTour.map(async el => await (await IDB()).add("script", el, el.key));
        await Promise.all(promiseAdd);
        const promiseList = testTour.map(async el => await (await IDB()).get("script", el.key));
        const result = await Promise.all(promiseList);
        expect(testTour).toStrictEqual(result);

        expect(queryByTestId("list-button-close")).not.toBeNull();
        expect(queryByTestId("list-search")).not.toBeNull();
    });
});
