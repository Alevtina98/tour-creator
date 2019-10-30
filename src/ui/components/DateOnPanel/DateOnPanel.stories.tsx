import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import { ScriptValue } from "../../util/indexedDB";
import DateOnPanel from "./DateOnPanel";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs, text } from "@storybook/addon-knobs";

const storeTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
const showDate = storiesOf("MainContainer/PanelContainer/InfoOnPanel", module)
    .addDecorator(withKnobs)
    .add("dateSaveInfo", () => (
        <div className="relative panel">
            <div />
            <div />
            {ProviderWithComponent(() => <DateOnPanel showDate={boolean("showDate", false)} />, {
                SelectedTourState: {
                    tourDB: storeTour,
                    blocklyReloadEnabled: boolean("blocklyReloadEnabled", true),
                    tourXML: text("tourXML", storeTour.code)
                }
            } as any)()}
        </div>
    ));
