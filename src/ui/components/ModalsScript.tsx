import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import React, { memo } from "react";
import { closeSelectedTour, createNewTour, delToDb, saveTour } from "../actions/selectedTourAction";
import ModalInputsComponent from "./ModalTemplates/ModalInputsComponent";
import ModalMain from "./ModalTemplates/ModalMain";
import agentActions from "../actions/agentActions";
import ErrorsRunScript from "./ModalTemplates/ErrorsRunScript";
import { setInspectDisabled } from "../actions/inspectAction";
import { ModalState } from "../reducers/ModalReducer";
import { setModal } from "../actions/modalAction";
import { getInitData, TourType } from "../util/tour";

const ModalsScript = () => {
    const dispatch = useDispatch();
    const { tour, status } = useSelector<StoreType, ModalState>(({ ModalState }) => ({
        tour: ModalState.tour,
        status: ModalState.status
    }));
    const errorsRunTour = useSelector<StoreType, string[]>(({ SelectedTourState }) => SelectedTourState.errorsRunTour);
    const createdNewTour = () => {
        dispatch(createNewTour());
    };
    const saveAndModalCreateTour = () => {
        dispatch(saveTour());
        modalCreateTour();
    };
    const modalCreateTour = () => {
        const newTour: TourType = getInitData();
        dispatch(setModal({ tour: newTour, status: "create" }));
    };
    const saveAndCloseTour = () => {
        dispatch(saveTour());
        closeTour();
    };
    const closeTour = () => {
        dispatch(closeSelectedTour());
    };
    const editTour = () => {
        dispatch(saveTour());
    };
    const deleteTour = () => {
        dispatch(delToDb());
    };
    const closeInspect = () => {
        dispatch(setInspectDisabled());
        agentActions.disableSelectMode();
    };
    const endRun = () => {
        agentActions.disableRunScript();
    };
    const components = {
        create: <ModalInputsComponent modalName="Создание тура" onApply={createdNewTour} applyName="Создать" />,
        copy: (
            <ModalInputsComponent modalName="Создание копии тура" onApply={createdNewTour} applyName="Создать копию" />
        ),
        edit: (
            <ModalInputsComponent
                modalName="Редактирование шаблона"
                onApply={editTour}
                applyName="Сохранить изменения"
            />
        ),
        save_before_close: (
            <ModalMain modalName="Сохранение тура" onApply={saveAndCloseTour} onClose={closeTour} applyName="Сохранить">
                Сохранить "{tour ? tour.name : "тур"}" перед закрытием?
            </ModalMain>
        ),
        save_before_create: (
            <ModalMain
                modalName="Сохранение тура"
                onApply={saveAndModalCreateTour}
                onClose={modalCreateTour}
                applyName="Сохранить"
            >
                Сохранить "{tour ? tour.name : "тур"}" перед закрытием?
            </ModalMain>
        ),
        delete: (
            <ModalMain modalName="Подтверждение удаления тура" onApply={deleteTour} applyName="Удалить">
                Вы действительно хотите удалить "{tour ? tour.name : "тур"}"?
            </ModalMain>
        ),
        show: (
            <ModalMain modalName="Воспроизведение тура" onClose={endRun} closeName="Завершить" hideApply={false}>
                <ErrorsRunScript errors={errorsRunTour} />
            </ModalMain>
        ),
        inspect: (
            <ModalMain modalName="Определение селектора" onClose={closeInspect} hideApply={false}>
                Выберите элемент на основной странице
            </ModalMain>
        )
    };

    return <div>{status ? components[status] : null}</div>;
};

export default memo(ModalsScript);
