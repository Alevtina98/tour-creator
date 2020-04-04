import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { getDateClientFormat, TourType } from "../../util/restClient/requestTour";
import { Navbar } from "react-bootstrap";

export interface ScriptButtons {
    selectedTour: TourType;
    blocklyReloadEnabled: boolean;
}

interface DateListSaveProps {
    showDate?: boolean;
}
const DateOnPanel: FC<DateListSaveProps> = ({ showDate }) => {
    const { blocklyReloadEnabled, selectedTour } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState, MainState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            selectedTour: SelectedTourState.selectedTour
        })
    );
    if (!blocklyReloadEnabled) {
        return null;
    }

    if (showDate && selectedTour.dateChange) {
        return (
            <div className="date-save-on-panel" data-testid="panel-date">
                <Navbar.Text>Последнее сохранение {getDateClientFormat(selectedTour.dateChange)}</Navbar.Text>
            </div>
        );
    }

    if (selectedTour.dateChange) {
        return (
            <div className="date-save-on-panel" data-testid="panel-not-date">
                <Navbar.Text>Все изменения сохранены</Navbar.Text>
            </div>
        );
    }
    return (
        <div className="date-save-on-panel" data-testid="panel-not-save">
            <Navbar.Text> ... </Navbar.Text>
        </div>
    );
};

export default DateOnPanel;
