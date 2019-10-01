import { ActionType, createStandardAction } from "typesafe-actions";
import { ScriptValue } from "../util/indexedDB";

export const setTourDB = createStandardAction("SET_TOUR")<ScriptValue>();
export const setTourBlockly = createStandardAction("SET_TOUR_XML")<string>();

export type SelectedTourAction = ActionType<typeof setTourDB>;