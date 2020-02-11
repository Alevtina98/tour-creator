import { TourType } from "./restClient/requestTour";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import React, { memo, ReactElement } from "react";
import { createCopyTour, createNewTour, delToDb, saveTour } from "../actions/selectedTourAction";
import ModalInputsComponent from "../components/ModalTemplates/ModalInputsComponent";
import ModalMain from "../components/ModalTemplates/ModalMain";
import agentActions from "../actions/agentActions";
import ErrorsRunScript from "../components/ModalTemplates/ErrorsRunScript";
import { setInspectDisabled } from "../actions/inspectAction";
import { StatusType } from "../reducers/ModalReducer";

export interface ModelsScriptProps {
    tour: TourType | null;
    status: StatusType;
}
const ModalsScript = () => {
    const dispatch = useDispatch();
    const { tour, status } = useSelector<StoreType, ModelsScriptProps>(({ ModalState }) => ({
        tour: ModalState.tour,
        status: ModalState.status
    }));
    const errorsRunTour = useSelector<StoreType, string[]>(({ SelectedTourState }) => SelectedTourState.errorsRunTour);
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
        dispatch(delToDb());
    };
    const closeInspect = () => {
        dispatch(setInspectDisabled());
        agentActions.disableSelectMode();
    };
    const closeRun = () => {
        agentActions.disableRunScript();
    };
    const components = {
        create: <ModalInputsComponent modalName="Создание тура" onApply={createdNewTour} applyName="Создать" />,
        copy: <ModalInputsComponent modalName="Создание копии тура" onApply={copyTour} applyName="Создать копию" />,
        edit: (
            <ModalInputsComponent
                modalName="Редактирование шаблона"
                onApply={editTour}
                applyName="Сохранить изменения"
            />
        ),
        delete: (
            <ModalMain modalName="Подтверждение удаления тура" onApply={deleteTour} applyName="Удалить">
                Вы действительно хотите удалить {tour ? tour.name : "тур"}?
            </ModalMain>
        ),
        show: (
            <ModalMain modalName="Воспроизведение тура" onClose={closeRun} closeName="Завершить">
                <ErrorsRunScript errors={errorsRunTour} />
            </ModalMain>
        ),
        inspect: (
            <ModalMain modalName="Определение селектора" onClose={closeInspect} closeName="Отмена">
                Выберите элемент на основной странице
            </ModalMain>
        )
    };

    return <div>{components[status]}</div>;
};

export default memo(ModalsScript);
