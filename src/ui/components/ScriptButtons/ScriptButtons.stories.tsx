import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import ScriptButtons from "./ScriptButtons";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { getInitData, TourType } from "../../util/restClient/requestTour";

const storeTour: TourType = getInitData();

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
