import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { format } from "date-fns";
import {getDateClientFormat, TourType} from "../../util/restClient/requestTour";

export interface ScriptButtons {
    tourDB: TourType;
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

    if (showDate && tourDB.dateChange) {
        return (
            <div className="date-save-on-panel" data-testid="panel-date">
                Последнее сохранение {getDateClientFormat(tourDB.dateChange)}
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
