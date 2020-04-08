import React from "react";
import PanelContainer from "./PanelContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import { getInitData, TourType } from "../../util/tour";

export default { title: "MainContainer/PanelContainer/Panel", component: ProviderWithComponent(PanelContainer) };

const storeTour: TourType = getInitData();
export const panel = () => (
    <div>
        {ProviderWithComponent(PanelContainer, {
            SelectedTourState: {
                selectedTour: storeTour
            }
        } as any)()}
    </div>
);
