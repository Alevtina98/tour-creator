import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../../AgentHandler";
import PanelContainer from "../PanelContainer/PanelContainer";
import TourEditorContainer from "../EditorContainer/EditorContainer";
import "../../blocklyDefinitions";
import TourModal from "../../components/TourModal";
import { StoreType } from "../../reducers";
import Notifications from "react-notification-system-redux";
import { TourType } from "../../util/tour";

const MainComponent = () => {
    const dispatch = useDispatch();
    const modalTour = useSelector<StoreType, TourType | null>(({ ModalState }) => ModalState.tour);
    const notifications = useSelector<StoreType, any>(({ notifications }) => notifications);

    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
    }, [dispatch]);

    const style = {
        NotificationItem: {
            DefaultStyle: {
                margin: "10px 5px 2px 1px"
            },
            success: {
                color: "red"
            }
        }
    };

    return (
        <div className="main-container">
            <PanelContainer />
            <TourEditorContainer />
            {modalTour !== null && <TourModal />}
            <Notifications notifications={notifications} style={style} />
        </div>
    );
};

export default memo(MainComponent);
