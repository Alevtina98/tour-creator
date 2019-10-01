import { ScriptValue } from "../util/indexedDB";
import { createReducer } from "typesafe-actions";
import { combineReducers } from "redux";
import { setTour, SelectedTourAction } from "../actions/selectedTourAction";

export interface SelectedTourReducerState {
    selectedTour: ScriptValue;
}
const initState = {
    name: "",
    date: Date(),
    desc: "newTour",
    code: "",
};
const TourReducer = createReducer<ScriptValue, SelectedTourAction>(initState).handleAction(
    setTour,
    (state, action) => action.payload,
);
const SelectedTourReducer = combineReducers<SelectedTourReducerState>({
    selectedTour: TourReducer,
});

export default SelectedTourReducer;
