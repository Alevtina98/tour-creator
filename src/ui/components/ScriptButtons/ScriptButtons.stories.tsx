import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import ConnectionStatus from "../ConnectionStatus/ConnectionStatus";
import {ScriptValue} from "../../util/indexedDB";
import ScriptButtons from "./ScriptButtons";

export default { title: "MainContainer/PanelContainer/ScriptButtons", component: ProviderWithComponent(ScriptButtons) };

const storeTour: ScriptValue = {
    key: "custom-key2",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
export const isLoadTour = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(ScriptButtons, {
            SelectedTourState: {
                blocklyReloadEnabled: true
            }
        } as any)()}
    </div>
);
export const isNotLoadTour = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(ScriptButtons, {
            SelectedTourState: {
                blocklyReloadEnabled: false
            }
        } as any)()}
    </div>
);

