import React, { FC, memo } from "react";
import { Button, Modal } from "react-bootstrap";

export interface ModalProps {
    modalName: string;
    children: any;
    onClose: () => void;
    onApply: () => void;
    showCancel?: boolean;
    applyName?: string;
    closeName?: string;
}

const ModalMain: FC<ModalProps> = ({
    children,
    modalName,
    onApply,
    onClose,
    applyName = "Ок",
    closeName = "Отмена"
}) => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>{modalName}</Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" data-testid="cancelTestId" onClick={onClose}>
                    {closeName}
                </Button>
                <Button variant="primary" data-testid="okTestId" onClick={onApply}>
                    {applyName}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default memo(ModalMain);
