import React, { DOMElement, FC, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import { ScriptValue } from "../../util/indexedDB";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { format } from "date-fns";
import { MainComponentProps } from "../../containers/MainContainer/MainContainer";

export interface ScriptButtons {
    tourDB: ScriptValue;
    tourXML: string;
    blocklyReloadEnabled: boolean;
}

interface DateListSaveProps {
    showDate?: boolean;
}
const DateOnPanel: FC<DateListSaveProps> = ({ showDate }) => {
    const { blocklyReloadEnabled, tourDB, tourXML } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState, MainState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            tourDB: SelectedTourState.tourDB,
            tourXML: SelectedTourState.tourXML
        })
    );
    if (!blocklyReloadEnabled) {
        return null;
    }

    if (showDate && tourDB.date) {
        return (
            <div className="date-save-on-panel" data-testid="panel-date">
                Последнее сохранение {format(new Date(tourDB.date), "dd-MM-yyyy в HH:mm:ss")}
            </div>
        );
    }

    if (tourXML === tourDB.code) {
        return (
            <div className="date-save-on-panel" data-testid="panel-not-date">
                Все изменения сохранены
            </div>
        );
    }
    return (
        <div className="date-save-on-panel" data-testid="panel-not-save">
            ...
        </div>
    );
};

export default DateOnPanel;
