import { ActionType, createStandardAction } from "typesafe-actions";
import { ScriptValue } from "../util/indexedDB";

export const setTour = createStandardAction("SET_TOUR")<ScriptValue>();

export type SelectedTourAction = ActionType<typeof setTour>;