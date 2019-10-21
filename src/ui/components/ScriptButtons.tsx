import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import {createNewTour, delToDb, loadToDb, periodicallySave, saveTour} from "../actions/selectedTourAction";
import {Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup, Modal} from "react-bootstrap";
import { useInputValue } from "../hooks/useInputValue";
import { FC, memo } from "react";
import { format } from "date-fns";
import Script from "./Script";
import uuid from "uuid";
import HamburgerButton from "./HamburgerButton";
import BurgerMenu from "./BurgerMenu";

export interface ScriptButtons {
    tourDB: ScriptValue;
}

/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptButtons = () => {
    const [show, setShow] = useState(false);
    const newName = useInputValue("");
    const newDesc = useInputValue("");

    const handleClose = () => {
        setShow(false);
        newName.value = "";
        newDesc.value = "";
    };
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB } = useSelector<StoreType, ScriptButtons>(({ SelectedTourState }) => SelectedTourState);
    const saveCode = () => {
        dispatch(
            saveTour({
                name: newName.value,
                date: tourDB.date,
                desc: newDesc.value,
                code: tourDB.code,
                key: tourDB.key
            })
        );
        handleClose();
    };
    const newTour = () => {
        dispatch(createNewTour());
    };
    return (
        <div className="relative">
            {/* //<div className="btn-group" role="group" aria-label="Basic example">*/}
            <div id="outer-container" className="burgerStyle">
                <BurgerMenu />
                {/*<main id="page-wrap">
                Проекты
                </main>*/}
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={newTour}>
                    Создать
                </Button>
                <Button size="sm" variant="light" onClick={handleShow}>
                    Сохранить
                </Button>
            </ButtonToolbar>
            {/*  </div>*/}
            <Modal show={show} onHide={handleShow}>
                <Modal.Header></Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* eslint-disable-next-line max-len */}
                    <FormControl
                        placeholder=""
                        aria-label="TournewName"
                        aria-newDescribedby="basic-addon1"
                        {...newName}
                    />
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
