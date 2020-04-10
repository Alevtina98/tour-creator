import ProviderWithComponent from "../../../store/ProviderWithComponent";
import * as React from "react";
import ScriptList from "./ScriptList";
import { getInitData, TourType } from "../../../util/tour";

export default {
    title: "MainContainer/PanelContainer/BurgerMenuContainer/ScriptList",
    component: ProviderWithComponent(ScriptList)()
};

const storeTour: TourType = getInitData();
const onClickEsc = () => {};
export const scriptListComponent = () => (
    <div className="relative list-tour-group">
        {ProviderWithComponent(() => <ScriptList onClickEsc={onClickEsc()} isOpen={true} />, {
            SelectedTourState: {
                selectedTour: storeTour
            }
        } as any)()}
    </div>
);
