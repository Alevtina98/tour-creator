import { TourType } from "./restClient/requestTour";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import React, { memo, useEffect } from "react";
import { createCopyTour, createNewTour, delToDb, saveTour } from "../actions/selectedTourAction";
import ModalInputsComponent from "../components/ModalTemplates/ModalInputsComponent";
import ModalMain from "../components/ModalTemplates/ModalMain";
import agentActions from "../actions/agentActions";
import ErrorsRunScript from "../components/ModalTemplates/ErrorsRunScript";
import { setInspectDisabled } from "../actions/inspectAction";
import { StatusType } from "../reducers/ModalReducer";
import { clearModal } from "../actions/modalAction";

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
    const isInspect = useSelector<StoreType, boolean>(({ InspectState }) => InspectState.isInspectEnabled);
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
    /*const components = {
        create: <ModalInputsComponent modalName="Создание тура" onApply={createdNewTour} applyName="Создать" />,
    };*/

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
            {status === "delete" && (
                <ModalMain modalName="Подтверждение удаления тура" onApply={deleteTour} applyName="Удалить">
                    Вы действительно хотите удалить {tour ? tour.name : "тур"}?
                </ModalMain>
            )}
            {status === "show" && (
                <ModalMain modalName="Воспроизведение тура" onClose={closeRun} closeName="Завершить">
                    <ErrorsRunScript errors={errorsRunTour} />
                </ModalMain>
            )}
            {status === "inspect" && (
                <ModalMain modalName="Определение селектора" onClose={closeInspect} closeName="Отмена">
                    Выберите элемент на основной странице
                </ModalMain>
            )}
        </div>
    );
};

export default memo(ModalsScript);
