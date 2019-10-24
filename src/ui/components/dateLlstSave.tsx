import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import { ScriptValue } from "../util/indexedDB";
import { useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { format } from "date-fns";

export interface ScriptButtons {
    tourDB: ScriptValue;
}

const DateLastSave = () => {
    const { tourDB } = useSelector<StoreType, ScriptButtons>(({ SelectedTourState }) => SelectedTourState);
    return (
        (tourDB.date != "" && (
            <div className="date-save-on-panel">
                Последнее сохранение {format(new Date(tourDB.date), "dd-MM-yyyy в HH:mm:ss")}
            </div>
        )) ||
        null
    );
};

export default DateLastSave;
