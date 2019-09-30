import { ScriptValue } from "../util/indexedDB";
import { ActionType, createStandardAction } from "typesafe-actions";

export const connectSuccess = createStandardAction("CONNECTION_SUCCESS")();

export const setCurrentSelector = createStandardAction("SET_CURRENT_SELECTOR")<string>();

export const setInspectEnabled = createStandardAction("SET_INSPECT_ENABLED")();
export const setInspectDisabled = createStandardAction("SET_INSPECT_DISABLED")();

export const setCode = (script: ScriptValue) => ({
    type: "SET_CODE",
    payload: {
        script,
    },
});

export type CurrentSelectorAction = ActionType<typeof setCurrentSelector>;
export type SetInspectActions = ActionType<
    typeof setInspectDisabled | typeof setInspectEnabled | typeof setCurrentSelector
>;
