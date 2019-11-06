import React, {FC, memo} from "react";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";

interface ModalTextComponentProps {
    modalName: string;
    show: boolean;
    handleShow: () => void;
    text: string;
    handelCancel: () => void;
    handelOk: () => void;
    okButtonName?: string;
    okTestId?: string;
    cancelTestId?: string;
    textTestId?: string;
    modalTestId?: string;
}

const  ModalTextComponent: FC<ModalTextComponentProps> = ( {modalName, show, handleShow, text, handelCancel, handelOk,
                                                                   okButtonName, okTestId, cancelTestId, textTestId, modalTestId} ) => {
    return (
        <Modal show={show} onHide={handleShow} data-testid={modalTestId || ""}>
            <Modal.Header>{modalName}</Modal.Header>
            <Modal.Body>
                <p data-testid={textTestId || ""}>{text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handelCancel} data-testid={cancelTestId || ""}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handelOk} data-testid={okTestId || ""}>
                    {okButtonName}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default memo( ModalTextComponent);

