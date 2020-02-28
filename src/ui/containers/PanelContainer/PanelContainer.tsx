import React, { memo } from "react";
import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import DateOnPanel from "../../components/DateOnPanel/DateOnPanel";
import ScriptButtons from "../../components/ScriptButtons/ScriptButtons";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { Navbar } from "react-bootstrap";
import BurgerMenuContainer from "../BurgerMenuContainer/BurgerMenuContainer";

export interface PanelComponentProps {
    connected: boolean;
}
const PanelContainer = () => {
    const { connected } = useSelector<StoreType, PanelComponentProps>(({ MainState }) => ({
        connected: MainState.connected
    }));
    return (
        <Navbar bg="dark" expand="sm" variant="dark">
            <div className="relative panel">
                <div id="outer-container" className="relative">
                    <BurgerMenuContainer />
                    <ConnectionStatus connection={connected} />
                </div>
                <ScriptButtons />
                <DateOnPanel data-testid="panel-date" />
            </div>
        </Navbar>
    );
};

export default memo(PanelContainer);
