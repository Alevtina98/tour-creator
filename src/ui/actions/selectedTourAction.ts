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
import { error, success } from "react-notification-system-redux";
import { getCurrentJs, getJsSettersNameAndDesc } from "../util/jsCodeTour";

export const setLoadBocklyEnabled = createStandardAction("SET_RELOAD_BLOCKLY_ENABLED")();
export const setLoadBocklyDisabled = createStandardAction("SET_RELOAD_BLOCKLY_DISABLED")();
export const setListTour = createStandardAction("SET_LIST_TOUR")<TourType[]>();
export const setSelectedTour = createStandardAction("SET_TOUR")<TourType>();
export const setErrorsRunTour = createStandardAction("SET_ERRORS")<string[]>();
export const addErrorRunTour = createStandardAction("ADD_ERROR")<string>();

export const setCurrentSelectedTour = (
    newName: string | null,
    newDesc: string | null,
    newXml: string | null,
    newJs: string | null,
    dateSaveCurrentTour: string | null
) => (dispatch: Dispatch, getState: () => StoreType) => {
    const selectedTour: TourType = getState().SelectedTourState.selectedTour;
    const currentName: string | null = newName || selectedTour.name;
    const currentDesc: string | null = newDesc || selectedTour.desc;
    const currentXml: string | null = newXml || selectedTour.code;
    const currentJs: string | null = getCurrentJs(currentName, currentDesc, currentXml, newJs);
    const currentDateChange: string = dateSaveCurrentTour || (currentXml !== selectedTour.code ? "" : selectedTour.dateChange);
    const currentTour: TourType = {
        ...selectedTour,
        name: currentName,
        desc: currentDesc,
        code: currentXml,
        codeJS: currentJs,
        dateChange: currentDateChange
    };
    dispatch(setSelectedTour(currentTour));
};
export const closeSelectedTour = () => (dispatch: Dispatch) => {
    dispatch(setLoadBocklyDisabled());
    const tour: TourType = getInitData();
    dispatch(setSelectedTour(tour));
    clearInterval(periodicallySaveTimer);
};
export const openSelectedTour = (tour: TourType) => (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    if (store.SelectedTourState.blocklyReloadEnabled) {
        if (store.SelectedTourState.selectedTour.id === tour.id) {return;}
        closeSelectedTour()(dispatch);
    }
    dispatch(setSelectedTour(tour));
    dispatch(setLoadBocklyEnabled());
};

export const loadListTour =  () => async  (dispatch: Dispatch) => {
    const tourList: TourType[] | null = await getAllTours();
   if (tourList) {
      dispatch(setListTour(tourList));
    } else {
       dispatch(error({ message: "Не удалось загрузить список туров" }));
   }
};
export const loadTour = (id: number) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const tour: TourType | null = await getTourById(id);
    if (tour) {
        openSelectedTour(tour)(dispatch, getState)
    } else {
        dispatch(error({ message: "Не удалось загрузить тур" }));
    }
};
export const createNewTour = () => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const tour: TourType | null = store.ModalState.tour;
    if (!tour) {
        return console.log("ERROR MODAL CREATED");
    }
    tour.codeJS = getJsSettersNameAndDesc(tour.name || "", tour.desc || "") + tour.codeJS;
    const createdTour: TourType | null = await createTour(tour);
    if (createdTour) {
        if (store.ModalState.status === "copy") {
            dispatch(success({ title: `"` + createdTour.name `" сохранен как копия ` }));
        }
        loadListTour()(dispatch);
        openSelectedTour(createdTour)(dispatch, getState);
    } else {
        dispatch(error({ message: `Не удалось создать тур "` + tour.name + `"`}));
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
    const ok: boolean | null = await deleteTourById(id);
    if (ok){
        dispatch(success({ title: `"` + tour.name + `" удален` }));
        loadListTour()(dispatch);
        if (id == store.SelectedTourState.selectedTour.id) {
            closeSelectedTour()(dispatch);
        }
    } else {
        dispatch(error({ message: `Не удалось удалить тур "` + tour.name + `"`}));

    }
};
export const saveTour = (period?: boolean) => async (dispatch: Dispatch, getState: () => StoreType) => {
    const store = getState();
    const selectedTour = store.SelectedTourState.selectedTour;
    const tourForSaved: TourType = store.ModalState.tour || selectedTour;
    if (store.ModalState.status === "edit") {
        tourForSaved.codeJS = getCurrentJs(tourForSaved.name, tourForSaved.desc, tourForSaved.code, null);
    }
    const savedTour: TourType | null = await updateTour(tourForSaved);
    if (savedTour){
        if (period) return;
        dispatch(success({ title: `"` + savedTour?.name + `" сохранен` }));
        loadListTour()(dispatch);
        if (savedTour.id !== selectedTour.id) return;
        setCurrentSelectedTour(savedTour.name, savedTour.desc, null, null, savedTour.dateChange)(dispatch, getState);
    } else {
        dispatch(error({ message: `Не удалось сохранить тур "` + tourForSaved.name + `"`}));
    }
};

let periodicallySaveTimer = 0;
export const periodicallySave = () => (dispatch: Dispatch, getState: () => StoreType) => {
    clearInterval(periodicallySaveTimer);
    periodicallySaveTimer = window.setInterval(() => {
        const store = getState();
        const tour: TourType = store.SelectedTourState.selectedTour;
        if (tour.dateChange) return;
        saveTour(true)(dispatch, getState);
    }, 10000);
};


export type SelectedTourAction = ActionType<typeof setSelectedTour>;
