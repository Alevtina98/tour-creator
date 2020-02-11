import { combineReducers } from "redux";
import MainState, { MainReducerState } from "./MainReducer";
import InspectState, { InspectReducerState } from "./InspectReducer";
import SelectedTourState, { SelectedTourReducerState } from "./SelectedTourReducer";
import ModalState, { ModalState as ModalReducerState} from "./ModalReducer";
import { reducer as notifications, NotificationsState } from "react-notification-system-redux";

export interface StoreType {
    MainState: MainReducerState;
    InspectState: InspectReducerState;
    SelectedTourState: SelectedTourReducerState;
    ModalState: ModalReducerState;
    notifications: NotificationsState;
}

const totalReducer = combineReducers<StoreType>({
    MainState,
    InspectState,
    SelectedTourState,
    ModalState,
    notifications
    //combineReducers({ notifications }),
} as any);

export default totalReducer;
