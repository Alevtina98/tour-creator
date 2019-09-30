import { combineReducers } from "redux";
import MainState, { MainReducerState } from "./MainReducer";
import InspectState, { InspectReducerState } from "./InspectReducer";

export interface StoreType {
    MainState: MainReducerState;
    InspectState: InspectReducerState;
}

export default combineReducers<StoreType>({
    MainState,
    InspectState,
});
