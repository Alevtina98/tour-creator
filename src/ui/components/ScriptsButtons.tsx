import React, { useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import ModalSave from "./ModalSave";
import SelectedTourState from "../reducers/SelectedTourReducer";
import { saveToDb } from "../actions/selectedTourAction";

export interface ScriptsButtons {
    tourDB: ScriptValue;
    tourXML: string;
}
/*export interface DateFormat {
    dayNumber: number;
}*/
const ScriptsButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, tourXML } = useSelector<StoreType, ScriptsButtons>(({ SelectedTourState }) => SelectedTourState);
    const saveCode = () => {
        dispatch(
            saveToDb({
                name: "Новый тур",
                date: Date().toLocaleLowerCase(),
                desc: "newTour сохранен по нажатию кнопки",
                code: tourXML,
            }),
        ); //Отправка экшена
        //Как перерисовать BlocklyComponent???
    };
    const loadCode = () => {
        //Как перерисовать ScriptList???
    };
    const deleteCode = () => {
        //Как перерисовать ScriptList???
    };
    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary" onClick={loadCode}>
                    Загрузить
                </button>

                <button type="button" className="btn btn-secondary" data-target="#myModal" data-toggle="modal">
                    Сохранить
                </button>
                <button type="button" className="btn btn-secondary">
                    Редактировать
                </button>
                <button type="button" className="btn btn-secondary" onClick={deleteCode}>
                    Удалить
                </button>
            </div>
            <div className="modal fade" id="myModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title" id="myModalLabel"> Modal title </h4>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={saveCode}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptsButtons;