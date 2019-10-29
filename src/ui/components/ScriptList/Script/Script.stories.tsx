import React from "react";
import Script from "./Script";

import { ScriptValue } from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import TourEditorContainer from "../../../containers/EditorContainer/EditorContainer";

export default { title: "MainContainer/PanelContainer/BurgerMenuContainer/ScriptList/Script", component: ProviderWithComponent(Script)() };

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
const onClick = () => {};
export const selectedScript = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(() => <Script tour={storeTour} onClick={onClick()} />, {
            SelectedTourState: {
                tourDB: storeTour
            }
        } as any)()}
    </div>
);
export const script = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(() => <Script tour={tour} onClick={onClick()} />, {
            SelectedTourState: {
                tourDB: storeTour
            }
        } as any)()}
    </div>
);
