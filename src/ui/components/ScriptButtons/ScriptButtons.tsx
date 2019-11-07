import React, { useState } from "react";
import { ScriptValue } from "../../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { closeSelectedTour, createNewTour, saveSelectedTour, setTourDB } from "../../actions/selectedTourAction";
import { Button, ButtonToolbar } from "react-bootstrap";
import BurgerMenuContainer from "../../containers/BurgerMenuContainer/BurgerMenuContainer";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import agentActions from "../../actions/agentActions";
import ModalComponent from "../ModalInputsComponent";
import ModalLockDevtoolsComponent from "../ModalLockDevtoolsComponent";

export interface ScriptButtons {
    tourDB: ScriptValue;
    blocklyReloadEnabled: boolean;
    tourJS: string;
}

const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, blocklyReloadEnabled, tourJS } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );
    const [show, setShow] = useState(false);
    const [showRunTour, setShowRunTour] = useState(false);
    const [showCreated, setShowCreated] = useState(false);

    const { setValue: setNameValue, ...newName } = useControlledInputValue(tourDB.name);
    const { setValue: setDescValue, ...newDesc } = useControlledInputValue(tourDB.desc);
    const { setValue: setNewTourNameValue, ...newTourName } = useControlledInputValue("NewTour");
    const { setValue: setNewTourDescValue, ...newTourDesc } = useControlledInputValue("");

    const handleShow = () => {
        setNameValue(tourDB.name);
        setDescValue(tourDB.desc);
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };
    const handleShowCreated = () => {
        setNewTourNameValue("NewTour");
        setNewTourDescValue("");
        setShowCreated(true);
    };
    const handleCloseCreated = () => {
        setShowCreated(false);
    };
    const handleShowRunTour = () => {
        setShowRunTour(true);
    };
    const handleCloseRunTour = () => {
        setShowRunTour(false);
        agentActions.disableRunScript();
    };

    const saveCode = () => {
        dispatch(
            setTourDB({
                name: newName.value,
                date: tourDB.date,
                desc: newDesc.value,
                code: tourDB.code,
                key: tourDB.key
            })
        );
        dispatch(saveSelectedTour());
        handleClose();
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
        handleShowRunTour();
        console.log("tourJS >>", tourJS);
    };

    return (
        <div className="relative">
            <div id="outer-container">
                <BurgerMenuContainer />
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={handleShowCreated}>
                    Создать
                </Button>
                <Button size="sm" variant="light" onClick={runTour} disabled={!blocklyReloadEnabled}>
                    Запустить
                </Button>
                <Button size="sm" variant="light" onClick={handleShow} disabled={!blocklyReloadEnabled}>
                    Сохранить
                </Button>
                <Button size="sm" variant="light" onClick={closeTour} disabled={!blocklyReloadEnabled}>
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
                modalName="Сохранение тура"
                show={show}
                handleShow={handleShow}
                inputName={newName}
                inputDesc={newDesc}
                handelCancel={handleClose}
                handelOk={saveCode}
                okButtonName="Сохранить"
            />
            <ModalLockDevtoolsComponent
                show={showRunTour}
                text="Для завершения просмотра тура нажмите"
                handelCancel={handleCloseRunTour}
            />
        </div>
    );
};

export default ScriptButtons;
