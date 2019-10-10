import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { delToDb, loadToDb, saveToDb } from "../actions/selectedTourAction";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useInputValue } from "../hooks/useInputValue";
import { FC, memo } from "react";
import { format } from "date-fns";
import Script from "./Script";

export interface ScriptButtons {
    tourDB: ScriptValue;
    tourXML: string;
}

/*export interface DateFormat {
    dayNumber: number;
}*/
const SaveTour = () => {
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
    const { tourDB, tourXML } = useSelector<StoreType, ScriptButtons>(({ SelectedTourState }) => SelectedTourState);

    const saveCode = () => {
        dispatch(
            saveToDb({
                name: newName.value,
                date: format(new Date(), "yyyy-MM-dd HH:mm"),
                desc: newDesc.value,
                code: tourXML
            })
        ); //Отправка экшена
        //Как перерисовать ScriptList???
        handleClose();

    };

    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary" onClick={handleShow}>
                    Сохранить
                </button>
            </div>
            <Modal show={show} onHide={handleShow}>
                <Modal.Header ></Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* eslint-disable-next-line max-len */}
                    <FormControl placeholder="" aria-label="TournewName" aria-newDescribedby="basic-addon1" {...newName} />
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

export default SaveTour;
