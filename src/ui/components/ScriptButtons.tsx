import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import {
    closeSelectedTour,
    createNewTour,
    saveSelectedTour, setTourDB
} from "../actions/selectedTourAction";
import { Button, ButtonToolbar, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useInputValue } from "../hooks/useInputValue";
import BurgerMenu from "./BurgerMenu";
import {useControlledInputValue} from "../hooks/useControleInputValue";

export interface ScriptButtons {
    tourDB: ScriptValue;
    blocklyReloadEnabled: boolean;
}

/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, blocklyReloadEnabled } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );
    const [show, setShow] = useState(false);
    const { setValue: setNameValue, ...newName } = useControlledInputValue(tourDB.name);
    const { setValue: setDescValue, ...newDesc } = useControlledInputValue(tourDB.desc);

    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
        setNameValue(tourDB.name);
        setDescValue(tourDB.desc);
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
    const newTour = () => {
        dispatch(createNewTour());
    };
    const closeTour = () => {
        dispatch(closeSelectedTour());
    };
    return (
        <div className="relative">
            {/* //<div className="btn-group" role="group" aria-label="Basic example">*/}
            <div id="outer-container">
                <BurgerMenu />
                {/*<main id="page-wrap">
                Проекты
                </main>*/}
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={newTour}>
                    Создать
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
        </div>
    );
};

export default ScriptButtons;
