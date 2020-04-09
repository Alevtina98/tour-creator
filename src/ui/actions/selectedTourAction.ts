import { ActionType, createStandardAction } from "typesafe-actions";
import { Dispatch } from "redux";
import { StoreType } from "../reducers";
import { createTour, deleteTourById, getAllTours, getTourById, updateTour } from "../util/restClient/requestTour";
import { error, info, success, warning } from "react-notification-system-redux";
import { getCurrentJs, getInitData, getJsSettersNameAndDesc, TourType } from "../util/tour";
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
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        const store = getState();
        const tour: TourType = store.SelectedTourState.selectedTour;
        if (tour.dateChange) return;
        console.log("periodicallySave");
        saveTour(true)(dispatch, getState);
    }, 10000);
};
export const setPeriodicSaveState = (newState: boolean) => (dispatch: Dispatch, getState: () => StoreType) => {
    if (newState) {
        periodicallySave()(dispatch, getState);
        dispatch(setPeriodicSaveEnabled());
        dispatch(info({ title: `Включено периодическое сохранение` }));
    } else {
        clearInterval(periodicallySaveTimer);
        dispatch(setPeriodicSaveDisabled());
        dispatch(warning({ title: `Отключено периодическое сохранение` }));
    }
};
export const closeSelectedTour = () => (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const periodicSave = store.SelectedTourState.periodicSave;
    dispatch(setTourClose());
    const tour: TourType = getInitData();
    dispatch(setSelectedTour(tour));
    if (periodicSave) {
        clearInterval(periodicallySaveTimer);
    }
};
export const openSelectedTour = (tour: TourType) => (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    if (store.SelectedTourState.tourOpen) {
        if (store.SelectedTourState.selectedTour.id === tour.id) {
            return;
        }
        closeSelectedTour()(dispatch, getState);
    }
    dispatch(setSelectedTour(tour));
    dispatch(setTourOpen());
    setPeriodicSaveState(true)(dispatch, getState);
};

export const loadListTour = () => async (dispatch: Dispatch) => {
    const tourList: TourType[] | null = (await getAllTours()) as TourType[];
    if (tourList) {
        dispatch(setListTour(tourList));
    } else {
        dispatch(error({ message: "Не удалось загрузить список туров" }));
    }
};
export const loadTour = (id: number) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tour: TourType | null = (await getTourById(id)) as TourType;
    if (tour) {
        openSelectedTour(tour)(dispatch, getState);
    } else {
        dispatch(error({ message: "Не удалось загрузить тур" }));
    }
};
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        return console.log("ОШИБКА: нечего создавать");
    }
    //был изменен шаблон тура, влияющий на js-код => нужно обновить js
    tour.codeJS = getCurrentJs(tour.name, tour.desc, tour.code);
    const createdTour: TourType | null = (await createTour(tour)) as TourType;
    if (createdTour) {
        await loadListTour()(dispatch);
        openSelectedTour(createdTour)(dispatch, getState);
        dispatch(success({ title: `"` + createdTour.name + `" успешно создан` }));
    } else {
        dispatch(error({ message: `Не удалось создать тур "` + tour.name + `"` }));
    }
};
export const saveTour = (period?: boolean) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    let selectedTour: TourType = store.SelectedTourState.selectedTour;
    const tourForSaved: TourType = store.ModalState.tour || selectedTour;
    const status: StatusType | null = store.ModalState.status;
    if (status === "edit") {
        //был изменен шаблон тура, влияющий на js-код => нужно обновить js, который сохраняем
        tourForSaved.codeJS = getCurrentJs(tourForSaved.name, tourForSaved.desc, tourForSaved.code);
    }
    const savedTour: TourType | null = (await updateTour(tourForSaved)) as TourType;
    if (savedTour) {
        await loadListTour()(dispatch);
        if (period) {
            //просто периодическое сохранение - обновляем только дату последнего сохранения
            const selectedTourNow = store.SelectedTourState.selectedTour;
            dispatch(setSelectedTour({ ...selectedTourNow, dateChange: savedTour.dateChange }));
            return;
        }
        dispatch(success({ title: `"` + savedTour?.name + `" успешно сохранен` }));
        if (
            savedTour.id !== selectedTour.id ||
            status === "save_before_load" ||
            status === "save_before_close" ||
            status === "save_before_create"
        ) {
            //сейчас открыт другой тур
            return;
        }
        //изменен шаблон (edit) открытого тура
        //код открытого тура в Store мог измениться за время сохранения
        selectedTour = store.SelectedTourState.selectedTour;
        const modifiedTour: TourType = {
            id: selectedTour.id,
            name: savedTour.name,
            desc: savedTour.desc,
            code: selectedTour.code,
            codeJS: getCurrentJs(savedTour.name, savedTour.desc, selectedTour.code),
            dateCreate: selectedTour.dateCreate,
            dateChange: savedTour.dateChange
        };
        dispatch(setSelectedTour(modifiedTour));
    } else {
        dispatch(error({ message: `Не удалось сохранить тур "` + tourForSaved.name + `"` }));
    }
};
export const delToDb = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        console.log("ERROR MODAL CREATED");
        return;
    }
    const id: number = tour.id;
    const ok: boolean | null = (await deleteTourById(id)) as boolean;
    if (ok) {
        dispatch(success({ title: `"` + tour.name + `" успешно удален` }));
        await loadListTour()(dispatch);
        if (id == store.SelectedTourState.selectedTour.id) {
            closeSelectedTour()(dispatch, getState);
        }
    } else {
        dispatch(error({ message: `Не удалось удалить тур "` + tour.name + `"` }));
    }
};
export type SelectedTourAction = ActionType<typeof setSelectedTour>;
