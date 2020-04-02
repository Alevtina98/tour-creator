import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { burgerClose, burgerOpen, connectSuccess } from "../actions/mainAction";

export interface MainReducerState {
    connected: boolean;
    burgerIsOpen: boolean;
}

const connectedReducer = createReducer<boolean>(false).handleAction(connectSuccess, () => true);
const burgerIsOpenReducer = createReducer<boolean>(false)
    .handleAction(burgerOpen, () => true)
    .handleAction(burgerClose, () => false);

const mainReducer = combineReducers<MainReducerState>({
    connected: connectedReducer,
    burgerIsOpen: burgerIsOpenReducer,
});

export default mainReducer;
