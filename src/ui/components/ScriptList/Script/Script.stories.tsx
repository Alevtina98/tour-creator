import React from "react";
import Script from "./Script";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { getInitData, ScriptValue } from "../../../util/restClient/requestTour";

const storeTour: ScriptValue = getInitData();
const tour: ScriptValue = getInitData({ key: "custom-key2" });
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
