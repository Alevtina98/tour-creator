import { createStandardAction } from "typesafe-actions";

export const connectSuccess = createStandardAction("CONNECTION_SUCCESS")();
export const burgerOpen = createStandardAction("BURGER_OPEN")();
export const burgerClose = createStandardAction("BURGER_CLOSE")();
export const setJSCode = createStandardAction("JS_CODE_CLICK")<boolean>();
