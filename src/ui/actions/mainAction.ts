import { ActionType, createStandardAction } from "typesafe-actions";

export const connectSuccess = createStandardAction("CONNECTION_SUCCESS")();
export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();