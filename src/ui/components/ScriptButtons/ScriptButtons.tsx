import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { closeSelectedTour, saveTour, setErrorsRunTour } from "../../actions/selectedTourAction";
import { Button, ButtonToolbar } from "react-bootstrap";
import BurgerMenuContainer from "../../containers/BurgerMenuContainer/BurgerMenuContainer";
import agentActions from "../../actions/agentActions";
import ModalLockDevtoolsComponent from "../ModalTemplates/ModalLockDevtoolsComponent";
import { getInitData, TourType } from "../../util/restClient/requestTour";
import {setModal, setModalStatus, setModalTour} from "../../actions/modalAction";

export interface ScriptButtons {
    tourDB: TourType;
    blocklyReloadEnabled: boolean;
    tourJS: string;
    errorsRunTour: string[];
}

const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, blocklyReloadEnabled, tourJS, errorsRunTour } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );
    //модальное окно на воспроизведение тура
    const [showRun, setShowRun] = useState(false);
    /*
     c запуском модальных окон
   */
    // из ModalsScript.tsx
    const onShowCreated = () => {
        const newTour: TourType = getInitData();
        dispatch(setModal(newTour, "create"));
    };
    const onShowCopy = () => {
        const newName = tourDB.name + " - копия";
        dispatch(setModal({ ...tourDB, name: newName }, "copy"));
    };
    // локально
    const onShowRun = () => {
        setShowRun(true);
    };
    const onCloseRun = () => {
        setShowRun(false);
        agentActions.disableRunScript();
    };
    const runTour = () => {
        agentActions.runScript(tourJS);
        dispatch(setErrorsRunTour([]));
        onShowRun();
    };
    /*
      без запуска модальных окон
    */
    const saveCode = () => {
        dispatch(saveTour(tour));
    };
    const closeTour = () => {
        dispatch(closeSelectedTour());
    };
    return (
        <div className="relative">
            <div id="outer-container">
                <BurgerMenuContainer />
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={onShowCreated} data-testid="createTourButton">
                    Создать
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={onShowCopy}
                    disabled={!blocklyReloadEnabled}
                    data-testid="copyTourButton"
                >
                    Сохранить как
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={saveCode}
                    disabled={!blocklyReloadEnabled}
                    data-testid="saveTourButton"
                >
                    Сохранить
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={runTour}
                    disabled={!blocklyReloadEnabled}
                    data-testid="runTourButton"
                >
                    Запустить
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={closeTour}
                    disabled={!blocklyReloadEnabled}
                    data-testid="closeTourButton"
                >
                    Закрыть
                </Button>
            </ButtonToolbar>

            <ModalLockDevtoolsComponent
                show={showRun}
                text="Для завершения просмотра тура нажмите"
                handelCancel={onCloseRun}
                buttonName="Завершить"
                errors={errorsRunTour}
            />
        </div>
    );
};

export default ScriptButtons;
