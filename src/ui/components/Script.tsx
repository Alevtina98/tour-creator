import React, { FC, useState } from "react";
import { ScriptValue } from "../util/indexedDB";
import {delToDb, loadListTour, loadToDb, saveTour, setTourDB} from "../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { useInputValue } from "../hooks/useInputValue";
import { format } from "date-fns";
import {Button, ButtonToolbar, FormControl, InputGroup, Modal} from "react-bootstrap";
import { StoreType } from "../reducers";
import { ScriptListProps } from "./ScriptList";
import cn from "classnames";
// eslint-disable-next-line @typescript-eslint/camelcase
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface ScriptProps {
    tour: ScriptValue;
    onClick: any;
}

export interface ScriptStorProps {
    tourDB: ScriptValue;
}
const Script: FC<ScriptProps> = ({ tour, onClick }) => {
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
    const loadTour = (e) => {
        onClick();
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
                <small className="tour-time">{format(new Date(tour.date), "dd-MM-yyyy в HH:mm")}</small>
                <ButtonToolbar className="tour-buttons">
                    <Button variant="light" size="sm" onClick={changeCode}>
                        <FontAwesomeIcon icon={faEdit} className="i-close" size="2x" color="#A1A2A2" />
                    </Button>
                    <Button variant="light" size="sm"  onClick={deleteCode}>
                        <FontAwesomeIcon icon={faTrashAlt} className="i-close" size="2x" color="#A1A2A2" />
                    </Button>
                </ButtonToolbar>
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
