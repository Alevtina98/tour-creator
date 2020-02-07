import React, { FC, memo, useEffect } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import { TourType } from "../../util/restClient/requestTour";
import ModalContainer from "./ModalMain";
import { useDispatch, useSelector } from "react-redux";
import { clearModal, setModalTour } from "../../actions/modalAction";
import { StoreType } from "../../reducers";

export interface ModelsScriptProps {
    tour: TourType | null;
}
interface ModalInputsComponentProps {
    modalName: string;
    onApply: () => void;
    onClose?: () => void;
    applyName?: string;
    closeName?: string;
}

const ModalInputsComponent: FC<ModalInputsComponentProps> = ({
    modalName,
    onApply,
    onClose = () => {},
    applyName,
    closeName
}) => {
    const dispatch = useDispatch();
    const { tour } = useSelector<StoreType, ModelsScriptProps>(({ ModalState }) => ({
        tour: ModalState.tour
    }));
    const { setValue: setNameValue, ...name } = useControlledInputValue(tour ? tour.name : "");
    const { setValue: setDescValue, ...desc } = useControlledInputValue(tour ? tour.desc : "");
    /* useEffect(() => {
        setNameValue("");

q


        setDescValue("");
    }, [setDescValue, setNameValue, status]);*/
    const onCloseModalInputs = () => {
        dispatch(clearModal());
        onClose();
    };
    const onApplyModalInputs = () => {
        if (tour) {
            dispatch(setModalTour({ ...tour, name: name.value, desc: desc.value }));
            //debugger
            onApply();
        }
        onCloseModalInputs();
    };
    return (
        <ModalContainer
            onClose={onCloseModalInputs}
            onApply={onApplyModalInputs}
            modalName={modalName}
            applyName={applyName}
            closeName={closeName}
        >
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Название</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    aria-label="TournewName"
                    aria-newDescribedby="basic-addon1"
                    data-testid="nameTestId"
                    {...name}
                />
            </InputGroup>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>Описание</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="textarea" aria-label="With textarea" data-testid="descTestId" {...desc} />
            </InputGroup>
        </ModalContainer>
    );
};
export default memo(ModalInputsComponent);
