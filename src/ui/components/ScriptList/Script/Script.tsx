import React, { FC, useState } from "react";
import { ScriptValue } from "../../../util/indexedDB";
import { delToDb, loadListTour, loadToDb, saveTour, setTourDB } from "../../../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { useInputValue } from "../../../hooks/useInputValue";
import { format } from "date-fns";
import { Button, ButtonToolbar, FormControl, InputGroup, Modal } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import { ScriptListProps } from "../ScriptList/ScriptList";
import cn from "classnames";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ScriptProps {
    tour: ScriptValue;
    onClick: any;
}

const Script: FC<ScriptProps> = ({ tour, onClick }) => {
    const dispatch = useDispatch();
    const selectedTourKey: string = useSelector<StoreType, string>(({ SelectedTourState }) => SelectedTourState.tourDB.key);

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
        //создается новая версия
        dispatch(saveTour(tour));
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
        dispatch(loadListTour());
    };
    //загрузка
    const loadTour = () => {
        onClick();
        if (selectedTourKey != tour.key) {
            dispatch(loadToDb(tour.key));
        }
    };

    return (
        <div>
            <div
                className={cn("tour", {
                    "tour--active": selectedTourKey === tour.key
                })}
                onClick={loadTour}
            >
                <div className="tour-name" data-testid="tour-name">
                    <small>{tour.name}</small>
                </div>
                <div className="tour-time" data-testid="tour-time">
                    <small>{format(new Date(tour.date), "dd-MM-yyyy в HH:mm")}</small>
                </div>
                <div />
                <ButtonToolbar className="tour-buttons">
                    <Button variant="light" size="sm" onClick={changeCode} data-testid="edit-button">
                        <FontAwesomeIcon icon={faEdit} className="i-close" color="#A1A2A2" />
                    </Button>
                    <Button variant="light" size="sm" onClick={deleteCode}>
                        <FontAwesomeIcon icon={faTrashAlt} className="i-close" color="#A1A2A2" />
                    </Button>
                </ButtonToolbar>
            </div>
            <Modal show={show} onHide={handleShow}>
                <Modal.Header>Редактирование шаблона</Modal.Header>
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
