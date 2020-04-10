import React, { FC, memo } from "react";
import { FormControl, InputGroup } from "react-bootstrap";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import ModalMain from "./ModalMain";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { ModalState } from "../../reducers/ModalReducer";
import { setModal } from "../../actions/modalAction";
import { getCurrentJs, TourType } from "../../util/tour";

interface ModalInputProps {
    modalName: string;
    onApply?: (tour: TourType | null) => void;
    onClose?: (tour: TourType | null) => void;
    applyName?: string;
    closeName?: string;
}

const ModalInput: FC<ModalInputProps> = ({
    modalName,
    onApply = (tour: TourType | null) => {},
    onClose = (tour: TourType | null) => {},
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
        const newName: string = name.value;
        const newDesc: string = desc.value;
        const newCodeJS: string | null = tour ? getCurrentJs(newName, newDesc, tour.code) : null;
        const editedTour: TourType | null = tour ? { ...tour, name: newName, desc: newDesc, codeJS: newCodeJS } : null;
        dispatch(setModal({ tour: editedTour, status: status }));
        onApply(editedTour);
    };
    const onCloseModalInputs = () => {
        onClose(tour);
    };
    return (
        <ModalMain
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
        </ModalMain>
    );
};
export default memo(ModalInput);
