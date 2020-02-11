import React, { memo, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import AgentHandler from "../../AgentHandler";
import PanelContainer from "../PanelContainer/PanelContainer";
import TourEditorContainer from "../EditorContainer/EditorContainer";
import "../../blocklyDefinitions";
import ModelsScript from "../../util/ModalsScript";
import {StoreType} from "../../reducers";
import {TourType} from "../../util/restClient/requestTour";

const MainComponent = () => {
    const dispatch = useDispatch();
    const modalTour = useSelector<StoreType, TourType | null>(({ ModalState }) => ModalState.tour);

    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
    }, [dispatch]);
    return (
        <div className="main-container">
            <PanelContainer />
            <TourEditorContainer />
            {modalTour !== null && <ModelsScript />}
        </div>
    );
};

export default memo(MainComponent);
