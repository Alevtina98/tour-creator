import React, { useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { MainComponent } from "./Main";
import SelectedTourState from "../reducers/SelectedTourReducer";
import { setTourDB } from "../actions/selectedTourAction";

export interface ScriptsButtons {
    tourDB: ScriptValue;
    tourXML: string;
}
const ScriptsButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, tourXML } = useSelector<StoreType, ScriptsButtons>(({ SelectedTourState }) => SelectedTourState);
    const putItem = async () => {
        (await IDB()).put("script", tourDB, "0");
    };
    const saveCode = () => {
        dispatch(
            setTourDB({
                name: "Новый тур",
                date: Date(),
                desc: "newTour сохранен по нажатию кнопки",
                code: tourXML,
            }),
        ); //Отправка экшена
        putItem();
    };
    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-secondary">
                Загрузить
            </button>
            <button type="button" className="btn btn-secondary" onClick={saveCode}>
                Сохранить
            </button>
            <button type="button" className="btn btn-secondary">
                Редактировать
            </button>
            <button type="button" className="btn btn-secondary">
                Удалить
            </button>
        </div>
    );
};

export default ScriptsButtons;
