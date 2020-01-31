import React, { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import AgentHandler from "../../AgentHandler";
import PanelContainer from "../PanelContainer/PanelContainer";
import TourEditorContainer from "../EditorContainer/EditorContainer";
import "../../blocklyDefinitions";

const MainComponent = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
    }, [dispatch]);
    return (
        <div className="main-container">
            <PanelContainer />
            <TourEditorContainer />
        </div>
    );
};

export default memo(MainComponent);
