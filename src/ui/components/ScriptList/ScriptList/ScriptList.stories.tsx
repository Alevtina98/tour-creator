import { ScriptValue } from "../../../util/indexedDB";
import ProviderWithComponent from "../../../store/ProviderWithComponent";
import * as React from "react";
import ScriptList from "./ScriptList";

export default {
    title: "MainContainer/PanelContainer/BurgerMenuContainer/ScriptList",
    component: ProviderWithComponent(ScriptList)()
};

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
const onClickScript = () => {};
const onClickEsc = () => {};
export const scriptListComponent = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(
            () => <ScriptList onClickScript={onClickScript()} onClickEsc={onClickEsc()} isOpen={true} />,
            {
                SelectedTourState: {
                    tourDB: storeTour
                }
            } as any
        )()}
    </div>
);
