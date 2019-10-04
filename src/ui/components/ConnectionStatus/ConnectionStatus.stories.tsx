import React from "react";
import ConnectionStatus from "./ConnectionStatus";

export default { title: "ConnectionStatus" };

export const isConnected = () => <ConnectionStatus connection />;
export const isNotConnected = () => <ConnectionStatus connection={false} />;
