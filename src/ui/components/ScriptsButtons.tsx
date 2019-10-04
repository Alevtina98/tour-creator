import React, { useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { saveToDb } from "../actions/selectedTourAction";
import { Button, Modal } from "react-bootstrap";

export interface ScriptsButtons {
    tourDB: ScriptValue;
    tourXML: string;
}
/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptsButtons = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, tourXML } = useSelector<StoreType, ScriptsButtons>(({ SelectedTourState }) => SelectedTourState);
    const saveCode = () => {
        dispatch(
            saveToDb({
                name: "Новый тур",
                date: Date().toLocaleLowerCase(),
                desc: "newTour сохранен по нажатию кнопки",
                code: tourXML,
            }),
        ); //Отправка экшена
        //Как перерисовать BlocklyComponent???
        handleClose();
    };
    const loadCode = () => {
        //Как перерисовать ScriptList???
    };
    const deleteCode = () => {
        //Как перерисовать ScriptList???
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
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveCode}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ScriptsButtons;
