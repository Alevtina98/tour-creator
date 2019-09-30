import { combineReducers } from "redux";
import MainState, { initialMainState, MainReducerState } from "./MainReducer";

export interface StoreType {
    MainState: MainReducerState;
}

export default combineReducers<StoreType>({
    MainState,
});
