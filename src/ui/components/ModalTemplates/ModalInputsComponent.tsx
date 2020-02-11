import React, { FC, memo } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import ModalContainer from "./ModalMain";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { ModalState } from "../../reducers/ModalReducer";
import { setModal } from "../../actions/modalAction";
import { TourType } from "../../util/restClient/requestTour";

interface ModalInputsComponentProps {
    modalName: string;
    onApply?: () => void;
    onClose?: () => void;
    applyName?: string;
    closeName?: string;
}

const ModalInputsComponent: FC<ModalInputsComponentProps> = ({
    modalName,
    onApply = () => {},
    onClose = () => {},
    applyName,
    closeName
}) => {
    const dispatch = useDispatch();
    const { tour, status } = useSelector<StoreType, ModalState>(({ ModalState }) => ({
        tour: ModalState.tour,
        status: ModalState.status
    }));
    const { setValue: setNameValue, ...name } = useControlledInputValue(tour ? tour.name : "");
    const { setValue: setDescValue, ...desc } = useControlledInputValue(tour ? tour.desc : "");
    const onApplyModalInputs = () => {
        if (tour) {
            const editTour: TourType = { ...tour, name: name.value, desc: desc.value };
            dispatch(setModal({ tour: editTour, status: status }));
            onApply();
        }
    };
    return (
        <ModalContainer
            onClose={onClose}
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
