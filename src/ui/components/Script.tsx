import React, { FC, useState } from "react";
import { ScriptValue } from "../util/indexedDB";
import {delToDb, loadListTour, loadToDb, saveTour, setTourDB} from "../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { useInputValue } from "../hooks/useInputValue";
import { format } from "date-fns";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import { StoreType } from "../reducers";
import { ScriptListProps } from "./ScriptList";
import cn from "classnames";

export interface ScriptProps {
    tour: ScriptValue;
}

export interface ScriptStorProps {
    tourDB: ScriptValue;
}
const Script: FC<ScriptProps> = ({ tour }) => {
    const dispatch = useDispatch();
    const { tourDB } = useSelector<StoreType, ScriptStorProps>(({ SelectedTourState }) => SelectedTourState);
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
        dispatch(delToDb(tour.key));
        setDel(true);
        //создается новая версия
        dispatch(
            saveTour({
                name: tour.name,
                date: tour.date,
                desc: tour.desc,
                code: tour.code,
                key: tour.key
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
        dispatch(loadListTour());
    };
    //удаление
    const deleteCode = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(delToDb(tour.key));
        setDel(true);
        dispatch(loadListTour());
    };
    //загрузка
    const loadTour = () => {
        if (tourDB.key != tour.key) {
            dispatch(loadToDb(tour.key));
        }
    };
    //if (del) return null;
    //
    return (
        <div>
            <div
                className={cn("tour", {
                    "tour--active": tourDB.key === tour.key
                })}
                onClick={loadTour}
            >
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
