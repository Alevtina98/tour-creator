import React, { FC, memo } from "react";

interface ModalLockDevtoolsComponent {
    //modalName: string;
    show: boolean;
    //handleShow: () => void;
    text: string;
    handelCancel: () => void;
    buttonName?: string;
    //okTestId?: string;
    cancelTestId?: string;
    textTestId?: string;
    modalTestId?: string;
}

const ModalLockDevtoolsComponent: FC<ModalLockDevtoolsComponent> = ({
    buttonName,
    show,
    text,
    handelCancel,
    cancelTestId,
    textTestId,
    modalTestId
}) => {
    return (
        (show && (
            <div className="back-drop" data-testid={modalTestId || ""}>
                <div
                    className="alert alert-light"
                    role="alert"
                    style={{
                        textAlign: "center",
                        background: "rgb(255,255,255)",
                        width: "500px",
                        margin: "auto"
                    }}
                    data-testid={textTestId || ""}
                >
                    {text}
                    <button
                        onClick={handelCancel}
                        type="button"
                        className="btn btn-light"
                        data-testid={cancelTestId || ""}
                    >
                        {buttonName || "Отмена"}
                    </button>
                </div>
            </div>
        )) ||
        null
    );
};
export default memo(ModalLockDevtoolsComponent);
