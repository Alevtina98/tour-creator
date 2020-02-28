import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { burgerClose, burgerOpen, connectSuccess, setJSCode } from "../actions/mainAction";

export interface MainReducerState {
    connected: boolean;
    burgerIsOpen: boolean;
    jsCodeShow: boolean;
}

const connectedReducer = createReducer<boolean>(false).handleAction(connectSuccess, () => true);
const burgerIsOpenReducer = createReducer<boolean>(false)
    .handleAction(burgerOpen, () => true)
    .handleAction(burgerClose, () => false);
const jsCodeShowReducer = createReducer<boolean>(false).handleAction(setJSCode, (state, action) => action.payload);

const mainReducer = combineReducers<MainReducerState>({
    connected: connectedReducer,
    burgerIsOpen: burgerIsOpenReducer,
    jsCodeShow: jsCodeShowReducer
});

export default mainReducer;
