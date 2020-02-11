import { ActionType, createStandardAction } from "typesafe-actions";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import {
    createTour,
    deleteTourById,
    getAllTours,
    getInitData,
    getTourById,
    TourType,
    updateTour
} from "../util/restClient/requestTour";
import {error, success} from "react-notification-system-redux";
import {burgerClose} from "./mainAction";


export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setTourDB = createStandardAction("SET_TOUR")<TourType>();
export const editTourDB = createStandardAction("EDIT_TOUR")<Partial<TourType>>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

export const loadListTour = () => async (dispatch: Dispatch) => {
    const result = await getAllTours();
    //await (await IDB()).getAll("script");
    dispatch(setListTour(result));
};

export const delToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED");
        return;
    }
    const key: number = tour.id;
    //(await IDB()).delete("script", key);
    await deleteTourById(key);
    try {
        if (key == store.SelectedTourState.tourDB.id) {
            dispatch(setLoadBocklyDisabled());
            dispatch(setTourDB(getInitData()));
            dispatch(burgerClose());
        }
        clearInterval(periodicallySaveTimer);
        loadListTour()(dispatch);
        dispatch(success({ title: tour.name + " удален" }));
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};

export const saveTour = (period?: boolean) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    const selectedTour = store.SelectedTourState.tourDB;
    try {
        const savedTour: TourType = await updateTour(tour || store.SelectedTourState.tourDB);
        if (savedTour.id === selectedTour.id) {
            dispatch(setTourDB(savedTour));
        }
        loadListTour()(dispatch);
        if (!period) {
            dispatch(success({ title: tour?.name + " сохранен" }));
        }
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};

let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        const store = getState();
        const tour: TourType = store.SelectedTourState.tourDB;
        if (tour.dateChange) return;
        saveTour(true)(dispatch, getState);
    }, 10000);
};
export const loadToDb = (key: number) => async (dispatch: Dispatch) => {
    //загрузка нового тура с пререзагрузкой блокли
    dispatch(setLoadBocklyDisabled());
    const tour: TourType | undefined = await getTourById(key);
    //(await IDB()).get("script", key);
    try {
        dispatch(setTourDB(tour));
        dispatch(setLoadBocklyEnabled());
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED");
    }
    const createdTour: TourType = await createTour(tour);
    try {
        closeSelectedTour()(dispatch);
        //console.log("createdTour >> ", createdTour);
        dispatch(setTourDB(createdTour));
        loadListTour()(dispatch);
        return window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    } catch (e) {
        console.error("ERROR", e.getMessage());
        dispatch(error({ message: e.getMessage() }));
    }
};
export const createCopyTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    closeSelectedTour()(dispatch);
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED COPY");
    }
    //key: uuid.v4()
    const createdTour: TourType = await createTour(tour);
    if (createdTour) {
        dispatch(success({ title: createdTour?.name + " сохранен как копия " }));
        dispatch(setTourDB(createdTour));
        loadListTour()(dispatch);
        return window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    } else console.log("Ошибка при создании копии тура");
};
export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: TourType = getInitData();
    dispatch(setTourDB(tour));
    clearInterval(periodicallySaveTimer);
};

export type SelectedTourAction = ActionType<typeof setTourDB | typeof editTourDB>;
