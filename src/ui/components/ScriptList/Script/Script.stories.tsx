import React from "react";
import Script from "./Script";
import { ScriptValue } from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";

const storeTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
const tour: ScriptValue = {
    key: "custom-key2",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
const checkTour = () => {
    if (boolean("selectedTour", true)) return storeTour;
    return tour;
};
const onClick = () => {};

const script = storiesOf("MainContainer/PanelContainer/BurgerMenuContainer/ScriptList/Script", module)
    .addDecorator(withKnobs)
    .add("editor", () => (
        <div className="relative list-tour-group">
            {ProviderWithComponent(() => <Script tour={checkTour()} onClick={onClick()} />, {
                SelectedTourState: {
                    tourDB: storeTour
                }
            } as any)()}
        </div>
    ));
