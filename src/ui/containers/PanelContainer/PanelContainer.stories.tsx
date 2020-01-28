import React from "react";
import PanelContainer from "./PanelContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import { getInitData, ScriptValue } from "../../util/restClient/requestTour";

export default { title: "MainContainer/PanelContainer/Panel", component: ProviderWithComponent(PanelContainer) };

const storeTour: ScriptValue = getInitData();
export const panel = () => (
    <div>
        {ProviderWithComponent(PanelContainer, {
            SelectedTourState: {
                tourDB: storeTour
            }
        } as any)()}
    </div>
);
