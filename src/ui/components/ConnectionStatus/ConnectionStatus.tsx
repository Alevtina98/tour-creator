import React, { FC, memo } from "react";

export interface ConnectionStatusProps {
    connection: boolean;
}

const connectionStatusStyle = {
    width: 6,
    height: 6,
    marginRight: 6,
    display: "inline-block"
};

const ConnectionStatus: FC<ConnectionStatusProps> = ({ connection }) => {
    const color = connection ? "green" : "red";
    return (
        <div
            style={{
                ...connectionStatusStyle,
                background: color
            }}
        />
    );
};

export default memo(ConnectionStatus);
