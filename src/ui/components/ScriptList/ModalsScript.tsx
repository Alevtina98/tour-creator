import { TourType } from "../../util/restClient/requestTour";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import React, { memo } from "react";
import { createCopyTour, createNewTour, delToDb, saveTour } from "../../actions/selectedTourAction";
import ModalInputsComponent from "../ModalTemplates/ModalInputsComponent";

export interface ModelsScriptProps {
    tour: TourType | null;
    status: string | null;
}
const ModalsScript = () => {
    const dispatch = useDispatch();
    const { tour, status } = useSelector<StoreType, ModelsScriptProps>(({ ModalState }) => ({
        tour: ModalState.tour,
        status: ModalState.status
    }));
    const createdNewTour = () => {
        dispatch(createNewTour());
    };
    const copyTour = () => {
        dispatch(createCopyTour());
    };
    const editTour = () => {
        dispatch(saveTour());
    };
    const deleteTour = () => {
        if (tour) {
            dispatch(delToDb(tour.id));
        }
    };
    return (
        <div>
            {status === "create" && (
                <ModalInputsComponent modalName="Создание тура" onApply={createdNewTour} applyName="Создать" />
            )}
            {status === "copy" && (
                <ModalInputsComponent modalName="Создание копии тура" onApply={copyTour} applyName="Создать копию" />
            )}
            {status === "edit" && (
                <ModalInputsComponent
                    modalName="Редактирование шаблона"
                    onApply={editTour}
                    applyName="Сохранить изменения"
                />
            )}
            {/*{tourToDelete !== null && (
                <ModalTextComponent
                    modalName="Подтверждение удаления тура"
                    show={true}
                    handleShow={handleShowDel}
                    text={`Вы действительно хотите удалить ${tourToDelete.desc}?`}
                    handelCancel={handleClose}
                    handelOk={deleteTour}
                    okButtonName="Удалить"
                    textTestId="del-name"
                    cancelTestId="cancel-del-button"
                    okTestId="save-del-button"
                    modalTestId="del-model"
                />
            )}*/}
        </div>
    );
};

export default memo(ModalsScript);
