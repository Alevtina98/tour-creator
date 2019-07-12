import {combineReducers} from "redux";
import MainState, {initialMainState} from "./MainReducer";

export interface StoreType {
    MainState: typeof initialMainState;
}


export default combineReducers<StoreType>({
    MainState
});