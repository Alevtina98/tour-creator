import React, { useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";

const ScriptsButtons = () => {
    const saveCode = () => {
        /*dispatch(
            setTour({
                ...script,
                date: Date(),
                name: "Test",
            }),
        ); //Отправка экшена*/
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
