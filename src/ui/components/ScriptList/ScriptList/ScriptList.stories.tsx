import ProviderWithComponent from "../../../store/ProviderWithComponent";
import * as React from "react";
import ScriptList from "./ScriptList";
import { getInitData, ScriptValue } from "../../../util/restClient/requestTour";

export default {
    title: "MainContainer/PanelContainer/BurgerMenuContainer/ScriptList",
    component: ProviderWithComponent(ScriptList)()
};

const storeTour: ScriptValue = getInitData();
//const tour: ScriptValue = getInitData({ key: "custom-key2" });
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
