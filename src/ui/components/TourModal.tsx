import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import React, { memo } from "react";
import { closeSelectedTour, createNewTour, deleteTour, loadTour, saveTour } from "../actions/selectedTourAction";
import ModalInput from "./ModalTemplates/ModalInput";
import ModalMain from "./ModalTemplates/ModalMain";
import agentActions from "../actions/agentActions";
import ErrorsRunScript from "./ModalTemplates/ErrorsRunScript";
import { setInspectDisabled } from "../actions/inspectAction";
import { StatusType } from "../reducers/ModalReducer";
import { TourType } from "../util/tour";

export interface ModalsScriptState {
    selectedTour: TourType;
    tour: TourType | null;
    status: StatusType | null;
    errorsRunTour: string[];
}
const TourModal = () => {
    const dispatch = useDispatch();
    const { tour, status, selectedTour, errorsRunTour } = useSelector<StoreType, ModalsScriptState>(
        ({ ModalState, SelectedTourState }) => ({
            tour: ModalState.tour,
            status: ModalState.status,
            selectedTour: SelectedTourState.selectedTour,
            errorsRunTour: SelectedTourState.errorsRunTour
        })
    );
    const create = (tour: TourType | null) => {
        tour && dispatch(createNewTour(tour));
    };
    const edit = (tour: TourType | null) => {
        tour && dispatch(saveTour(tour));
    };
    const load = (tour: TourType | null) => {
        tour && dispatch(loadTour(tour.id));
    };
    const remove = (tour: TourType | null) => {
        tour && dispatch(deleteTour(tour));
    };
    const saveSelectedTour = () => {
        dispatch(saveTour(selectedTour));
    };
    const close = () => {
        dispatch(closeSelectedTour());
    };
    const endInspect = () => {
        dispatch(setInspectDisabled());
        agentActions.disableSelectMode();
    };
    const endRun = () => {
        agentActions.disableRunScript();
    };
    const modalSave = (afterSave: (tour: TourType | null) => void) => {
        return (
            <ModalMain modalName="Сохранение тура" onApply={saveSelectedTour} onClose={afterSave} applyName="Сохранить">
                Сохранить "{selectedTour.name}" перед закрытием?
            </ModalMain>
        );
    };
    const components = {
        save_before_close: modalSave(close),
        save_before_load: modalSave(load),
        save_before_create: modalSave(create),
        copy: <ModalInput modalName="Создание копии тура" onApply={create} applyName="Создать копию" />,
        edit: <ModalInput modalName="Редактирование шаблона" onApply={edit} applyName="Сохранить изменения" />,
        delete: (
            <ModalMain modalName="Подтверждение удаления тура" onApply={remove} applyName="Удалить">
                Вы действительно хотите удалить "{tour ? tour.name : "тур"}"?
            </ModalMain>
        ),
        show: (
            <ModalMain modalName="Воспроизведение тура" onClose={endRun} closeName="Завершить" hideApply={false}>
                <ErrorsRunScript errors={errorsRunTour} />
            </ModalMain>
        ),
        inspect: (
            <ModalMain modalName="Определение селектора" onClose={endInspect} hideApply={false}>
                Выберите элемент на основной странице
            </ModalMain>
        )
    };

    return <div>{status ? components[status] : null}</div>;
};

export default memo(TourModal);
