import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../../AgentHandler";
import PanelContainer from "../PanelContainer/PanelContainer";
import TourEditorContainer from "../EditorContainer/EditorContainer";
import "../../blocklyDefinitions";
import ModelsScript from "../../util/ModalsScript";
import { StoreType } from "../../reducers";
import { TourType } from "../../util/restClient/requestTour";
import Notifications from "react-notification-system-redux";

const MainComponent = () => {
    const dispatch = useDispatch();
    const modalTour = useSelector<StoreType, TourType | null>(({ ModalState }) => ModalState.tour);
    const notifications = useSelector<StoreType, any>(({ notifications }) => notifications);

    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
    }, [dispatch]);

    //Optional styling
    const style = {
        NotificationItem: {
            // Override the notification item
            DefaultStyle: {
                // Applied to every notification, regardless of the notification level
                margin: "10px 5px 2px 1px"
            },

            success: {
                // Applied only to the success notification item
                color: "red"
            }
        }
    };

    return (
        <div className="main-container">
            <PanelContainer />
            <TourEditorContainer />
            {modalTour !== null && <ModelsScript />}
            <Notifications notifications={notifications} style={style} />
        </div>
    );
};

export default memo(MainComponent);
