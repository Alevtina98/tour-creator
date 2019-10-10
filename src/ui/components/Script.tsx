import React, { FC, useState } from "react";
import { ScriptValue } from "../util/indexedDB";
import { delToDb, loadToDb, saveToDb, setTourDB } from "../actions/selectedTourAction";
import { useDispatch } from "react-redux";
import { useInputValue } from "../hooks/useInputValue";
import { format } from "date-fns";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";

export interface ScriptProps {
    tour: ScriptValue;
}

const Script: FC<ScriptProps> = ({ tour }) => {
    const key: string = tour.name + tour.date;
    const dispatch = useDispatch();
    const [del, setDel] = useState(false);
    //для работы с модальным окном
    const newName = useInputValue("");
    const newDesc = useInputValue("");
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    //редактирование
    const saveChangeCode = () => {
        //Если имя тура не указано, оно остается прежним
        if (newName.value != "") tour.name = newName.value;
        tour.date = format(new Date(), "yyyy-MM-dd HH:mm");
        tour.desc = newDesc.value; //Как позволить пользователю редактировать существующее описание??
        //старая версия удаляется
        dispatch(delToDb(key));
        setDel(true);
        //создается новая версия
        dispatch(
            saveToDb({
                name: tour.name,
                date: tour.date,
                desc: tour.desc,
                code: tour.code
            })
        );
        setDel(false);
        handleClose();
    };
    const changeCode = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        //dispatch(setTourDB(tour));
        handleShow();
    };
    //удаление
    const deleteCode = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(delToDb(key));
        setDel(true);
    };
    //загрузка
    const loadTour = () => {

        dispatch(loadToDb(key));

    };
    if (del) return null;
    else
        return (
            <div>
                <div className="tour" onClick={loadTour}>
                    <small className="tour-name">{tour.name}</small>
                    <small className="tour-time">{tour.date}</small>
                    <div className="btn-group tour-button" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-light btn-sm" onClick={changeCode}>
                            Редактировать
                        </button>
                        <button type="button" className="btn btn-light btn-sm" onClick={deleteCode}>
                            Удалить
                        </button>
                    </div>
                </div>
                <Modal show={show} onHide={handleShow}>
                    <Modal.Header></Modal.Header>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Название</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder={tour.name}
                            aria-label="TournewName"
                            aria-newDescribedby="basic-addon1"
                            {...newName}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Описание</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder={tour.desc} as="textarea" aria-label="With textarea" {...newDesc} />
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

export default Script;
