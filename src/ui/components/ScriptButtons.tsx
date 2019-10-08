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


export interface ScriptButtons {
    tourDB: ScriptValue;
    tourXML: string;
}
export interface LoadStatusProps {
    load: any;
}

/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptsButtons: FC<LoadStatusProps> = ({ load }) => {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const newName = useInputValue("");
    const newDesc = useInputValue("");

    const handleClose = () => {
        setShow(false);
        setShow2(false);
        newName.value = "";
        newDesc.value = "";
    };
    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);
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
    const saveChangeCode = () => {
        const code = tourDB.code;
        let name = newName.value;
        if (name == "") name = tourDB.name;
        deleteCode();
        dispatch(
            saveToDb({
                name: name,
                date: format(new Date(), "yyyy-MM-dd HH:mm"),
                desc: newDesc.value,
                code: code
            })
        ); //Отправка экшена
        //Как перерисовать ScriptList???
        handleClose();
    };
    const saveNewCode = () => {

        saveCode();
    };
    const changeCode = () => {
        dispatch(loadToDb());
        newName.value = tourDB.name;
        newDesc.value = tourDB.desc;
        handleShow2();
    };
    const loadCode = () => {
        //Как перерисовать BlocklyComponent???
        dispatch(loadToDb());
        window.setTimeout(() => {
            load();
        }, 5);
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
                <button type="button" className="btn btn-secondary" onClick={changeCode}>
                    Редактировать
                </button>
                <button type="button" className="btn btn-secondary" onClick={deleteCode}>
                    Удалить
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

            <Modal show={show2} onHide={handleShow2}>
                <Modal.Header ></Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    {/* eslint-disable-next-line max-len */}
                    <FormControl placeholder={tourDB.name} aria-label="TournewName" aria-newDescribedby="basic-addon1" {...newName} />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Описание</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder={tourDB.desc} as="textarea" aria-label="With textarea" {...newDesc} />
                </InputGroup>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={saveChangeCode}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ScriptsButtons;
