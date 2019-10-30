import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import { ScriptValue } from "../../util/indexedDB";
import ScriptButtons from "./ScriptButtons";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";

const storeTour: ScriptValue = {
    key: "custom-key2",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};

const buttons = storiesOf("MainContainer/PanelContainer/ScriptButtons", module)
    .addDecorator(withKnobs)
    .add("buttons", () => (
        <div className="relative list-tour-group">
            {ProviderWithComponent(ScriptButtons, {
                SelectedTourState: {
                    blocklyReloadEnabled: boolean("blocklyReloadEnabled", false)
                }
            } as any)()}
        </div>
    ));
