import React, { FC, useState } from "react";
import { ScriptValue } from "../../../util/indexedDB";
import {
    delToDb,
    loadListTour,
    loadToDb,
    saveDescTour,
} from "../../../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup, Modal } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import cn from "classnames";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useControlledInputValue } from "../../../hooks/useControleInputValue";

export interface ScriptProps {
    tour: ScriptValue;
    onClick: any;
}

const Script: FC<ScriptProps> = ({ tour, onClick }) => {
    const dispatch = useDispatch();
    const selectedTourKey: string = useSelector<StoreType, string>(
        ({ SelectedTourState }) => SelectedTourState.tourDB.key
    );

    //для работы с модальным окном
    const { setValue: setNameValue, ...newName } = useControlledInputValue(tour.name);
    const { setValue: setDescValue, ...newDesc } = useControlledInputValue(tour.desc);
    const [show, setShow] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const handleShow = () => setShow(true);
    const handleShowDel = () => setShowDel(true);
    const handleClose = () => setShow(false);
    const handleCloseDel = () => setShowDel(false);
    //редактирование
    const saveChangeCode = () => {
        const updatedTour = { ...tour };
        //Если имя тура не указано, оно остается прежним
        if (newName.value != "") updatedTour.name = newName.value;
        updatedTour.desc = newDesc.value;
        dispatch(saveDescTour(updatedTour));
        handleClose();
       // console.log("tour.name >> ", tour.name);
    };
    const changeCode = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setNameValue(tour.name);
        setDescValue(tour.desc);
        handleShow();
    };
    const saveDeleteCode = () => {
        dispatch(delToDb(tour.key));
        handleCloseDel();
    };
    //удаление
    const deleteCode = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setNameValue(tour.name);
        setDescValue(tour.desc);
        handleShowDel();
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
                    <small>{format(new Date(tour.date), "dd-MM-yyyy в HH:mm:ss")}</small>
                </div>
                <div />
                <ButtonToolbar className="tour-buttons">
                    <ButtonGroup>
                        <Button variant="light" size="sm" onClick={changeCode} data-testid="edit-button">
                            <FontAwesomeIcon icon={faEdit} className="i-close" color="#A1A2A2" />
                        </Button>
                        <Button variant="light" size="sm" onClick={deleteCode} data-testid="del-button">
                            <FontAwesomeIcon icon={faTrashAlt} className="i-close" color="#A1A2A2" />
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>

            <Modal show={show} onHide={handleShow} data-testid="edit-model">
                <Modal.Header>Редактирование шаблона</Modal.Header>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text>Название</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        aria-label="TournewName"
                        aria-newDescribedby="basic-addon1"
                        data-testid="changeName"
                        {...newName}
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Описание</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl as="textarea" aria-label="With textarea" data-testid="changeDesc" {...newDesc} />
                </InputGroup>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} data-testid="cancel-edit-button">
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={saveChangeCode} data-testid="save-edit-button">
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDel} onHide={handleShowDel} data-testid="del-model">
                <Modal.Header>Подтверждение удаления тура</Modal.Header>
                <Modal.Body>
                    <p data-testid="del-name">Вы действительно хотите удалить "{tour.name}"?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDel} data-testid="cancel-del-button">
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={saveDeleteCode} data-testid="save-del-button">
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Script;
