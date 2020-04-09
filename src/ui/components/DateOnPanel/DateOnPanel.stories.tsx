import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import DateOnPanel from "./DateOnPanel";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs, text } from "@storybook/addon-knobs";
import { getInitData, TourType } from "../../util/tour";

const storeTour: TourType = getInitData();
const showDate = storiesOf("MainContainer/PanelContainer/InfoOnPanel", module)
    .addDecorator(withKnobs)
    .add("dateSaveInfo", () => (
        <div className="relative panel">
            <div />
            <div />
            {ProviderWithComponent(() => <DateOnPanel showDate={boolean("showDate", false)} />, {
                SelectedTourState: {
                    selectedTour: storeTour,
                    tourOpen: boolean("tourOpen", true),
                    tourXML: text("tourXML", storeTour.code || "")
                }
            } as any)()}
        </div>
    ));
