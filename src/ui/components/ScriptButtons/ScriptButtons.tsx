import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import {
    closeSelectedTour,
    createCopyTour,
    createNewTour,
    saveSelectedTour, saveTour,
    setErrorsRunTour,
    setTourDB
} from "../../actions/selectedTourAction";
import { Button, ButtonToolbar } from "react-bootstrap";
import BurgerMenuContainer from "../../containers/BurgerMenuContainer/BurgerMenuContainer";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import agentActions from "../../actions/agentActions";
import ModalComponent from "../ModalInputsComponent";
import ModalLockDevtoolsComponent from "../ModalLockDevtoolsComponent";
import { TourType } from "../../util/restClient/requestTour";

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
    const [showRun, setShowRun] = useState(false);
    const [showCreated, setShowCreated] = useState(false);
    const [showCopy, setShowCopy] = useState(false);

    const { setValue: setNameValue, ...newName } = useControlledInputValue(tourDB.name || "");
    const { setValue: setDescValue, ...newDesc } = useControlledInputValue(tourDB.desc || "");
    const { setValue: setNewNameValue, ...newTourName } = useControlledInputValue("NewTour");
    const { setValue: setNewDescValue, ...newTourDesc } = useControlledInputValue("");

    const handleShowCreated = () => {
        setNewNameValue("NewTour");
        setNewDescValue("");
        setShowCreated(true);
    };
    const handleCloseCreated = () => {
        setShowCreated(false);
    };
    const handleShowRun = () => {
        setShowRun(true);
    };
    const handleCloseRun = () => {
        setShowRun(false);
        agentActions.disableRunScript();
    };
    const handleShowCopy = () => {
        setNameValue(tourDB.name + " - копия");
        setDescValue(tourDB.desc);
        setShowCopy(true);
    };
    const handleCloseCopy = () => {
        setNameValue(tourDB.name);
        setDescValue(tourDB.desc);
        setShowCopy(false);
    };
    const saveCode = () => {
        dispatch(saveTour(tourDB));
    };
    const copyTour = () => {
        dispatch(createCopyTour(newName.value, newDesc.value));
        handleCloseCopy();
    };
    const createdNewTour = () => {
        dispatch(createNewTour(newTourName.value, newTourDesc.value));
        handleCloseCreated();
    };
    const closeTour = () => {
        dispatch(closeSelectedTour());
    };
    const runTour = () => {
        agentActions.runScript(tourJS);
        dispatch(setErrorsRunTour([]));
        handleShowRun();
        //console.log("tourJS >>", tourJS);
    };

    return (
        <div className="relative">
            <div id="outer-container">
                <BurgerMenuContainer />
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={handleShowCreated} data-testid="createTourButton">
                    Создать
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={handleShowCopy}
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
            <ModalComponent
                modalName="Создание тура"
                show={showCreated}
                handleShow={handleShowCreated}
                inputName={newTourName}
                inputDesc={newTourDesc}
                handelCancel={handleCloseCreated}
                handelOk={createdNewTour}
                okButtonName="Создать"
            />
            <ModalComponent
                modalName="Создание копии тура"
                show={showCopy}
                handleShow={handleShowCopy}
                inputName={newName}
                inputDesc={newDesc}
                handelCancel={handleCloseCopy}
                handelOk={copyTour}
                okButtonName="Создать копию"
            />
            <ModalLockDevtoolsComponent
                show={showRun}
                text="Для завершения просмотра тура нажмите"
                handelCancel={handleCloseRun}
                buttonName="Завершить"
                errors={errorsRunTour}
            />
        </div>
    );
};

export default ScriptButtons;
