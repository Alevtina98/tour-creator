import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import {
    closeSelectedTour,
    createNewTour,
    saveSelectedTour, setTourDB
} from "../../actions/selectedTourAction";
import { Button, ButtonToolbar, FormControl, InputGroup, Modal } from "react-bootstrap";
import BurgerMenuContainer from "../../containers/BurgerMenuContainer/BurgerMenuContainer";
import {useControlledInputValue} from "../../hooks/useControleInputValue";
import agentActions from "../../actions/agentActions";
import {useInputValue} from "../../hooks/useInputValue";

export interface ScriptButtons {
    tourDB: ScriptValue;
    blocklyReloadEnabled: boolean;
    tourJS: string;
}

/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, blocklyReloadEnabled, tourJS } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );
    const [show, setShow] = useState(false);
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
        console.log("tourJS >>", tourJS);

    };
    return (
        <div className="relative">
            {/* //<div className="btn-group" role="group" aria-label="Basic example">*/}
            <div id="outer-container">
                <BurgerMenuContainer />
                {/*<main id="page-wrap">
                Проекты
                </main>*/}
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
            {/*  </div>*/}
            <Modal show={show} onHide={handleShow}>
                <Modal.Header>Сохранение тура</Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="TournewName" aria-newDescribedby="basic-addon1" {...newName} />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Описание</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" {...newDesc} />
                </InputGroup>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={saveCode}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCreated} onHide={handleShowCreated}>
                <Modal.Header>Создание тура</Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="TournewName" aria-newDescribedby="basic-addon1" {...newTourName} />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Описание</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" {...newTourDesc} />
                </InputGroup>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreated}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={createdNewTour}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ScriptButtons;
