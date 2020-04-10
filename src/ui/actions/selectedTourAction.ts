import { ActionType, createStandardAction } from "typesafe-actions";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import { createTour, deleteTourById, getAllTours, getTourById, updateTour } from "../util/restClient/requestTour";
import { error, info, success, warning } from "react-notification-system-redux";
import { getCurrentJs, getInitData, TourType } from "../util/tour";
import { StatusType } from "../reducers/ModalReducer";

export const setPeriodicSaveEnabled = createStandardAction("SET_PERIODIC_SAVE_ENABLED")();
export const setPeriodicSaveDisabled = createStandardAction("SET_PERIODIC_SAVE_DISABLED")();
export const setTourOpen = createStandardAction("SET_TOUR_OPEN")();
export const setTourClose = createStandardAction("SET_TOUR_CLOSE")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setSelectedTour = createStandardAction("SET_TOUR")<TourType>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

let periodicallySaveTimer = 0;
export const setPeriodicSaveState = (enable: boolean) => (dispatch: Dispatch, getState: () => StoreType) => {
    if (enable) {
        dispatch(info({ title: `Включено периодическое сохранение` }));
        dispatch(setPeriodicSaveEnabled());
        periodicallySaveTimer = window.setInterval(async () => periodicallySave()(dispatch, getState), 10000);
    } else {
        dispatch(warning({ title: `Отключено периодическое сохранение` }));
        dispatch(setPeriodicSaveDisabled());
        clearInterval(periodicallySaveTimer);
    }
};
export const openSelectedTour = (tour: TourType) => (dispatch: Dispatch, getState: () => StoreType) => {
    const state = getState().SelectedTourState;
    if (state.selectedTour.id === tour.id) return;
    state.tourOpen && closeSelectedTour()(dispatch, getState);
    setPeriodicSaveState(true)(dispatch, getState);
    dispatch(setSelectedTour(tour));
    dispatch(setTourOpen());
};
export const closeSelectedTour = () => (dispatch: Dispatch, getState: () => StoreType) => {
    const state = getState().SelectedTourState;
    const periodicSave = state.periodicSave;
    if (!state.tourOpen) return;
    periodicSave && clearInterval(periodicallySaveTimer);
    dispatch(setSelectedTour(getInitData()));
    dispatch(setTourClose());
};
export const loadListTour = () => async (dispatch: Dispatch) => {
    const tourList: TourType[] | null = (await getAllTours()) as TourType[];
    if (!tourList) return dispatch(error({ message: "Не удалось загрузить список туров" }));
    dispatch(setListTour(tourList));
};
export const loadTour = (id: number) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tour: TourType | null = (await getTourById(id)) as TourType;
    if (!tour) return dispatch(error({ message: "Не удалось загрузить тур" }));
    openSelectedTour(tour)(dispatch, getState);
};
export const createNewTour = (tour: TourType) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tourToCreate: TourType = tour;
    const createdTour: TourType | null = (await createTour(tourToCreate)) as TourType;
    if (!createdTour) return dispatch(error({ message: `Не удалось создать тур "` + tourToCreate.name + `"` }));
    dispatch(success({ title: `"` + createdTour.name + `" успешно создан` }));
    await loadListTour()(dispatch);
    openSelectedTour(createdTour)(dispatch, getState);
};
export const deleteTour = (tour: TourType) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tourToDeleted: TourType = tour;
    const id: number = tour.id;
    const ok: boolean | null = (await deleteTourById(id)) as boolean;
    if (!ok) return dispatch(error({ message: `Не удалось удалить тур "` + tourToDeleted.name + `"` }));
    dispatch(success({ title: `"` + tourToDeleted.name + `" успешно удален` }));
    await loadListTour()(dispatch);
    const idOpenedTour = getState().SelectedTourState.selectedTour.id;
    if (id == idOpenedTour) {
        closeSelectedTour()(dispatch, getState);
    }
};
export const saveTour = (tour: TourType) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tourToSaved: TourType = tour;
    const store = getState();
    let selectedTour: TourType = store.SelectedTourState.selectedTour;
    const savedTour: TourType | null = (await updateTour(tourToSaved)) as TourType;
    if (!savedTour) return dispatch(error({ message: `Не удалось сохранить тур "` + tourToSaved.name + `"` }));
    dispatch(success({ title: `"` + savedTour?.name + `" успешно сохранен` }));
    await loadListTour()(dispatch);
    const status: StatusType | null = store.ModalState.status;
    if (
        savedTour.id !== selectedTour.id ||
        status === "save_before_close" ||
        status === "save_before_load" ||
        status === "save_before_create"
    )
        return;
    //обновление данных об открытом туре
    selectedTour = store.SelectedTourState.selectedTour;
    const currentTour: TourType = {
        id: selectedTour.id,
        name: savedTour.name,
        desc: savedTour.desc,
        code: selectedTour.code,
        codeJS: getCurrentJs(savedTour.name, savedTour.desc, selectedTour.code),
        dateCreate: selectedTour.dateCreate,
        dateChange: savedTour.dateChange
    };
    dispatch(setSelectedTour(currentTour));
};
export const periodicallySave = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const state = getState().SelectedTourState;
    let tour: TourType = state.selectedTour;
    if (tour.dateChange) return;
    const savedTour: TourType | null = (await updateTour(tour)) as TourType;
    if (!savedTour) return dispatch(error({ message: `Автосохранение: не удалось сохранить тур` }));
    console.log("автосохранение");
    await loadListTour()(dispatch);
    //возможно, дата уже не актуальна
    tour = state.selectedTour;
    if (savedTour.code === tour.code && !tour.dateChange) {
        dispatch(setSelectedTour({ ...tour, dateChange: savedTour.dateChange }));
    }
};

export type SelectedTourAction = ActionType<typeof setSelectedTour>;
