import { ActionType, createStandardAction } from "typesafe-actions";

export const setCode = createStandardAction("SET_CODE")<string>();

export type SelectedTourAction = ActionType<typeof setCode>;