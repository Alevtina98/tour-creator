import { combineReducers } from "redux";
import MainState, { MainReducerState } from "./MainReducer";
import InspectState, { InspectReducerState } from "./InspectReducer";
import SelectedTourState, { SelectedTourReducerState } from "./SelectedTourReducer";

export interface StoreType {
    MainState: MainReducerState;
    InspectState: InspectReducerState;
    SelectedTourState: SelectedTourReducerState;
}

export default combineReducers<StoreType>({
    MainState,
    InspectState,
    SelectedTourState
});
