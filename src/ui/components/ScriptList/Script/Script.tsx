import React, { FC, useState } from "react";
import { delToDb, loadToDb, saveDescTour } from "../../../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import cn from "classnames";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useControlledInputValue } from "../../../hooks/useControleInputValue";
import ModalInputsComponent from "../../ModalInputsComponent";
import ModalTextComponent from "../../ModalTextComponent";
import {getDateClientFormat, TourType} from "../../../util/restClient/requestTour";

export interface ScriptProps {
    tour: TourType;
    onClick: any;
}

const Script: FC<ScriptProps> = ({ tour, onClick }) => {
    const dispatch = useDispatch();
    const selectedTourKey: string = useSelector<StoreType, string>(
        ({ SelectedTourState }) => SelectedTourState.tourDB.id
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
        if (newName.value != "") {
            updatedTour.name = newName.value;
        }
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
        dispatch(delToDb(tour.id));
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
        if (selectedTourKey != tour.id) {
            dispatch(loadToDb(tour.id));
        }
    };
    return (
        <div>
            <OverlayTrigger
                key="bottom"
                placement="bottom"
                overlay={(tour.desc && <Popover className="tooltip">{tour.desc}</Popover>) || <div />}
            >
                <div
                    className={cn("tour", {
                        "tour--active": selectedTourKey === tour.id
                    })}
                    onClick={loadTour}
                >
                    <div className="tour-name" data-testid="tour-name">
                        <small>{tour.name}</small>
                    </div>
                    <div className="tour-time" data-testid="tour-time">
                        <small>{getDateClientFormat(tour.dateChange)}</small>
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
            </OverlayTrigger>
            <ModalInputsComponent
                modalName="Редактирование шаблона"
                show={show}
                handleShow={handleShow}
                inputName={newName}
                inputDesc={newDesc}
                handelCancel={handleClose}
                handelOk={saveChangeCode}
                okButtonName="Сохранить изменения"
                nameTestId="changeName"
                descTestId="changeDesc"
                cancelTestId="cancel-edit-button"
                okTestId="save-edit-button"
                modalTestId="edit-model"
            />
            <ModalTextComponent
                modalName="Подтверждение удаления тура"
                show={showDel}
                handleShow={handleShowDel}
                text={`Вы действительно хотите удалить ${tour.name}?`}
                handelCancel={handleCloseDel}
                handelOk={saveDeleteCode}
                okButtonName="Удалить"
                textTestId="del-name"
                cancelTestId="cancel-del-button"
                okTestId="save-del-button"
                modalTestId="del-model"
            />
        </div>
    );
};

export default Script;
