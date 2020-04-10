import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import {
    setPeriodicSaveState,
    closeSelectedTour,
    saveTour,
    setErrorsRunTour,
    createNewTour
} from "../../actions/selectedTourAction";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import agentActions from "../../actions/agentActions";
import { setModal } from "../../actions/modalAction";
import { getInitData, TourType } from "../../util/tour";

export interface ScriptButtons {
    selectedTour: TourType;
    periodicSave: boolean;
    tourOpen: boolean;
}

const ScriptButtons = () => {
    const dispatch = useDispatch();
    const { selectedTour, periodicSave, tourOpen } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );
    const onClickCreate = () => {
        const tour: TourType = getInitData();
        if (tourOpen && !selectedTour.dateChange) {
            dispatch(setModal({ tour: tour, status: "save_before_create" }));
        } else {
            dispatch(createNewTour(tour));
        }
    };
    const onClickSaveAs = () => {
        const tour: TourType = { ...selectedTour, id: -1, name: selectedTour.name + "-копия" };
        dispatch(setModal({ tour: tour, status: "copy" }));
    };
    const onClickRun = () => {
        agentActions.runScript(selectedTour.codeJS);
        dispatch(setErrorsRunTour([]));
        dispatch(setModal({ tour: selectedTour, status: "show" }));
    };
    const onClickClose = () => {
        if (!selectedTour.dateChange) {
            dispatch(setModal({ tour: selectedTour, status: "save_before_close" }));
        } else {
            dispatch(closeSelectedTour());
        }
    };
    const onClickSave = () => {
        dispatch(saveTour(selectedTour));
    };
    const onClickPeriodic = () => {
        const newState: boolean = !periodicSave;
        dispatch(setPeriodicSaveState(newState));
    };
    return (
        <div className="relative flex-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={onClickCreate} data-testid="createTourButton">
                        Создать
                    </Nav.Link>
                    <NavDropdown title="Сохранить" id="basic-nav-dropdown" disabled={!tourOpen} bg="dark">
                        <NavDropdown.Item onClick={onClickSave} data-testid="saveTourButton">
                            Сохранить
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={onClickSaveAs} data-testid="copyTourButton">
                            Сохранить как
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>
                            Периодическое сохранение
                            <input
                                type="checkbox"
                                onClick={onClickPeriodic}
                                style={{ marginLeft: "15px", transform: "scale(1.5)" }}
                                checked={periodicSave}
                            />
                        </NavDropdown.Header>
                    </NavDropdown>
                    <Nav.Link onClick={onClickRun} data-testid="runTourButton" disabled={!tourOpen}>
                        Запустить
                    </Nav.Link>
                    <Nav.Link onClick={onClickClose} data-testid="onClickCloseButton" disabled={!tourOpen}>
                        Закрыть
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </div>
    );
};

export default ScriptButtons;
