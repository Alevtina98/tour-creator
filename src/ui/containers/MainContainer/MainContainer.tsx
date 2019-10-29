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
        // this.props.script = demo();
        // console.log("Script -> ",demo());
    }, [dispatch]);
    /* useEffect(() => {
        window.addEventListener("beforeunload", () => dispatch(saveSelectedTour()));
    }, [dispatch]);*/
    return (
        <div className="main-selector">
            <PanelContainer />
            <TourEditorContainer />
        </div>
    );
};

export default memo(MainComponent);
