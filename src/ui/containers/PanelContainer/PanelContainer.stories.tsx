import React from "react";
import PanelContainer from "./PanelContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import Script from "../../components/ScriptList/Script/Script";
import { ScriptValue } from "../../util/indexedDB";

export default { title: "MainContainer/PanelContainer/Panel", component: ProviderWithComponent(PanelContainer) };

const storeTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
export const panel = () => (
    <div>
        {ProviderWithComponent(PanelContainer, {
            SelectedTourState: {
                tourDB: storeTour
            }
        } as any)()}
    </div>
);
