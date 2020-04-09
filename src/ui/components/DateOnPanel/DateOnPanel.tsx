import React, { FC } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { Navbar } from "react-bootstrap";
import { getDateClientFormat, TourType } from "../../util/tour";

export interface ScriptButtons {
    selectedTour: TourType;
    tourOpen: boolean;
}

interface DateListSaveProps {
    showDate?: boolean;
}
const DateOnPanel: FC<DateListSaveProps> = ({ showDate }) => {
    const { tourOpen, selectedTour } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState, MainState }) => SelectedTourState
    );
    if (!tourOpen) {
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
