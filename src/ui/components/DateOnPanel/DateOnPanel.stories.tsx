import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import {ScriptValue} from "../../util/indexedDB";
import DateOnPanel from "./DateOnPanel";

export default { title: "MainContainer/PanelContainer/DateOnPanel", component: ProviderWithComponent(DateOnPanel)() };

const storeTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};

export const showDate = () => (
    <div className="relative panel">
        <div/>
        <div/>
        {ProviderWithComponent(() => <DateOnPanel showDate={true} />, {
            SelectedTourState: {
                tourDB: storeTour,
                blocklyReloadEnabled: true,
                tourXML: storeTour.code
            }

        } as any)()}
    </div>
);
export const notShowDate = () => (
    <div className="relative panel">
        <div />
        <div />
        {ProviderWithComponent(() => <DateOnPanel />, {
            SelectedTourState: {
                tourDB: storeTour,
                blocklyReloadEnabled: true,
                tourXML: storeTour.code
            }

        } as any)()}
    </div>
);
export const notSave = () => (
    <div className="relative panel">
        <div/>
        <div/>
        {ProviderWithComponent(() => <DateOnPanel />, {
            SelectedTourState: {
                tourDB: storeTour,
                blocklyReloadEnabled: true,
                tourXML: ""
            }

        } as any)()}
    </div>
);

