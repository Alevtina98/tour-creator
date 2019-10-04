import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import {delToDb, loadToDb, saveToDb} from "../actions/selectedTourAction";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useInputValue } from "../hooks/useInputValue";

export interface ScriptButtons {
    tourDB: ScriptValue;
    tourXML: string;
}
/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptsButtons = () => {
    const [show, setShow] = useState(false);
    const name = useInputValue("");
    const desc = useInputValue("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, tourXML } = useSelector<StoreType, ScriptButtons>(({ SelectedTourState }) => SelectedTourState);

    const saveCode = () => {
        dispatch(
            saveToDb({
                name: name.value,
                date: Date().toLocaleLowerCase(),
                desc: desc.value,
                code: tourXML
            })
        ); //Отправка экшена
        //Как перерисовать BlocklyComponent???
        handleClose();
    };
    const loadCode = () => {
        //Как перерисовать ScriptList???
        dispatch(loadToDb());
    };
    const deleteCode = () => {
        //Как перерисовать ScriptList???
        dispatch(delToDb());
    };

    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary" onClick={loadCode}>
                    Загрузить
                </button>

                <button type="button" className="btn btn-secondary" onClick={handleShow}>
                    Сохранить
                </button>
                <button type="button" className="btn btn-secondary">
                    Редактировать
                </button>
                <button type="button" className="btn btn-secondary" onClick={deleteCode}>
                    Удалить
                </button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="" aria-label="Tourname" aria-describedby="basic-addon1" {...name} />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Описание</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" {...desc} />
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

export default ScriptsButtons;
