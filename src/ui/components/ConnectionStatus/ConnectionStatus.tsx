import React, { FC, memo } from "react";
import { Nav, Navbar, OverlayTrigger, Popover } from "react-bootstrap";

export interface ConnectionStatusProps {
    connection: boolean;
}

const connectionStatusStyle = {
    display: "inline-block",
    marginLeft: "6px",
    padding: "3.5px"
};

const ConnectionStatus: FC<ConnectionStatusProps> = ({ connection }) => {
    return (
        <OverlayTrigger
            key="bottom"
            placement="bottom"
            overlay={
                <Popover id="popover-basic" className="tooltip">
                    {connection ? "Связь со страницей установлена" : "Нет связи со страницей"}
                </Popover>
            }
        >
            <Nav
                style={{
                    ...connectionStatusStyle,
                    backgroundColor: connection ? "green" : "red"
                }}
            >
                {" "}
            </Nav>
        </OverlayTrigger>
    );
};

export default memo(ConnectionStatus);
