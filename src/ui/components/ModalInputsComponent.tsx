import React, {FC, memo} from "react";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";

interface ModalInputsComponentProps {
    modalName: string;
    show: boolean;
    handleShow: () => void;
    inputName: any;
    inputDesc: any;
    handelCancel: () => void;
    handelOk: () => void;
    okButtonName?: string;
    okTestId?: string;
    cancelTestId?: string;
    nameTestId?: string;
    descTestId?: string;
    modalTestId?: string;
}

const  ModalInputsComponent: FC<ModalInputsComponentProps> = ( {modalName, show, handleShow, inputName, inputDesc, handelCancel, handelOk,
                                                       okButtonName, okTestId, cancelTestId, nameTestId, descTestId, modalTestId} ) => {
    return (
        <Modal show={show} onHide={handleShow} data-testid={modalTestId || ""}>
            <Modal.Header>{modalName}</Modal.Header>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Название</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="TournewName" aria-newDescribedby="basic-addon1" data-testid={nameTestId || ""} {...inputName} />
            </InputGroup>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>Описание</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="textarea" aria-label="With textarea" data-testid={descTestId || ""} {...inputDesc} />
            </InputGroup>
            <Modal.Footer>
                <Button variant="secondary" data-testid={cancelTestId  || ""} onClick={handelCancel}>
                    Отмена
                </Button>
                <Button variant="primary" data-testid={okTestId || ""} onClick={handelOk}>
                    {okButtonName || "ОК"}
                </Button>
            </Modal.Footer>
        </Modal>
        );
};
export default memo( ModalInputsComponent);

