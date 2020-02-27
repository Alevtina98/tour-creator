import React, { FC, memo } from "react";
import { Navbar } from "react-bootstrap";

export interface ConnectionStatusProps {
    connection: boolean;
}

const connectionStatusStyle = {
    /* width: 6,
    height: 6,
    marginRight: 6,*/
    // display: "inline-block"
};

const ConnectionStatus: FC<ConnectionStatusProps> = ({ connection }) => {
    const color = connection ? "green" : "red";
    return (
        <Navbar.Brand
            style={{
                // ...connectionStatusStyle,
                color: connection ? "" : "rgba(145,145,145,0.6)"
            }}
        >
            Tour-Creator
        </Navbar.Brand>
    );
};

export default memo(ConnectionStatus);
