import React, { FC, memo, useEffect, useRef } from "react";
import ScriptsButtons from "../../components/ScriptButtons/ScriptButtons";
import ScriptList from "../../components/ScriptList/ScriptList/ScriptList";
import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import DateOnPanel from "../../components/DateOnPanel/DateOnPanel";
import ScriptButtons from "../../components/ScriptButtons/ScriptButtons";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { MainComponentProps } from "../MainContainer/MainContainer";

export interface PanelComponentProps {
    connected: boolean;
}
const PanelContainer = () => {
    const { connected } = useSelector<StoreType, PanelComponentProps>(({ MainState }) => ({
        connected: MainState.connected
    }));
    return (
        <div className="relative panel">
            <ScriptButtons />
            <ConnectionStatus connection={connected} />
            <DateOnPanel data-testid="panel-date"/>
        </div>
    );
};

export default memo(PanelContainer);
