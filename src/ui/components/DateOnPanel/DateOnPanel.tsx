import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { getDateClientFormat, TourType } from "../../util/restClient/requestTour";
import { Navbar } from "react-bootstrap";

export interface ScriptButtons {
    tourDB: TourType;
    blocklyReloadEnabled: boolean;
}

interface DateListSaveProps {
    showDate?: boolean;
}
const DateOnPanel: FC<DateListSaveProps> = ({ showDate }) => {
    const { blocklyReloadEnabled, tourDB } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState, MainState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            tourDB: SelectedTourState.tourDB
        })
    );
    if (!blocklyReloadEnabled) {
        return null;
    }

    if (showDate && tourDB.dateChange) {
        return (
            <div className="date-save-on-panel" data-testid="panel-date">
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>Последнее сохранение {getDateClientFormat(tourDB.dateChange)}</Navbar.Text>
                </Navbar.Collapse>
            </div>
        );
    }

    if (tourDB.dateChange) {
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
