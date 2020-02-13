import React, { FC, memo } from "react";
import { Button, Modal } from "react-bootstrap";
import { clearModal } from "../../actions/modalAction";
import { useDispatch } from "react-redux";

export interface ModalProps {
    show?: boolean;
    modalName: string;
    children: any;
    hideApply?: boolean;
    hideClose?: boolean;
    onClose?: () => void;
    onApply?: () => void;
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
    onApply = () => {},
    onClose = () => {},
    applyName = "Ок",
    closeName = "Отмена"
}) => {
    const dispatch = useDispatch();
    const onCloseModel = () => {
        dispatch(clearModal());
        onClose();
    };
    const onApplyModel = () => {
        onApply();
        onCloseModel();
    };
    return (
        <Modal show={show} onHide={onCloseModel}>
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
