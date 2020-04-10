import React, { FC, memo } from "react";
import { Button, Modal } from "react-bootstrap";
import { clearModal } from "../../actions/modalAction";
import { useDispatch, useSelector } from "react-redux";
import { TourType } from "../../util/tour";
import { StoreType } from "../../reducers";
import { ModalState } from "../../reducers/ModalReducer";

export interface ModalProps {
    show?: boolean;
    modalName: string;
    children: any;
    hideApply?: boolean;
    hideClose?: boolean;
    onClose?: (tour: TourType | null) => void;
    onApply?: (tour: TourType | null) => void;
    showCancel?: boolean;
    applyName?: string;
    closeName?: string;
}

const ModalMain: FC<ModalProps> = ({
    show = true,
    children,
    hideApply = true,
    hideClose = true,
    modalName,
    onApply = (tour: TourType | null) => {},
    onClose = (tour: TourType | null) => {},
    applyName = "Ок",
    closeName = "Отмена"
}) => {
    const dispatch = useDispatch();

    const { tour, status } = useSelector<StoreType, ModalState>(({ ModalState }) => ({
        tour: ModalState.tour,
        status: ModalState.status
    }));
    const onApplyModel = () => {
        onApply(tour);
        onCloseModel();
    };
    const onCloseModel = () => {
        onClose(tour);
        dispatch(clearModal());
    };
    return (
        <Modal show={show} onHide={onCloseModel} backdrop="static">
            <Modal.Header closeButton>{modalName}</Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                {hideClose && (
                    <Button variant="secondary" data-testid="cancelTestId" onClick={onCloseModel}>
                        {closeName}
                    </Button>
                )}
                {hideApply && (
                    <Button variant="primary" data-testid="okTestId" onClick={onApplyModel}>
                        {applyName}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
export default memo(ModalMain);
