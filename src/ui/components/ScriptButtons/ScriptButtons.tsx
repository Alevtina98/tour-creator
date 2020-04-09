import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setPeriodicSaveState, closeSelectedTour, saveTour, setErrorsRunTour } from "../../actions/selectedTourAction";
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
    //маппинг значений из store
    const { selectedTour, periodicSave, tourOpen } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );

    /*
     c запуском модальных окон из ModalsScript.tsx
   */
    const onShowCreated = () => {
        if (tourOpen && !selectedTour.dateChange) {
            dispatch(setModal({ tour: selectedTour, status: "save_before_create" }));
        } else {
            const newTour: TourType = getInitData();
            dispatch(setModal({ tour: newTour, status: "create" }));
        }
    };
    const onShowCopy = () => {
        const newName = selectedTour.name + "-копия";
        dispatch(setModal({ tour: { ...selectedTour, id: -1, name: newName }, status: "copy" }));
    };
    const onShowRun = () => {
        agentActions.runScript(selectedTour.codeJS);
        dispatch(setErrorsRunTour([]));
        dispatch(setModal({ tour: selectedTour, status: "show" }));
    };
    const closeTour = () => {
        if (!selectedTour.dateChange) {
            dispatch(setModal({ tour: selectedTour, status: "save_before_close" }));
        } else {
            dispatch(closeSelectedTour());
        }
    };
    /*
      без запуска модальных окон
    */
    const saveCode = () => {
        dispatch(saveTour());
    };
    const onCheck = () => {
        const newState: boolean = !periodicSave;
        dispatch(setPeriodicSaveState(newState));
    };
    return (
        <div className="relative flex-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={onShowCreated} data-testid="createTourButton">
                        Создать
                    </Nav.Link>
                    <NavDropdown title="Сохранить" id="basic-nav-dropdown" disabled={!tourOpen} bg="dark">
                        <NavDropdown.Item onClick={saveCode} data-testid="saveTourButton">
                            Сохранить
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={onShowCopy} data-testid="copyTourButton">
                            Сохранить как
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>
                            Периодическое сохранение
                            <input
                                type="checkbox"
                                onClick={onCheck}
                                style={{ marginLeft: "15px", transform: "scale(1.5)" }}
                                checked={periodicSave}
                            />
                        </NavDropdown.Header>
                    </NavDropdown>
                    <Nav.Link onClick={onShowRun} data-testid="runTourButton" disabled={!tourOpen}>
                        Запустить
                    </Nav.Link>
                    <Nav.Link onClick={closeTour} data-testid="closeTourButton" disabled={!tourOpen}>
                        Закрыть
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </div>
    );
};

export default ScriptButtons;
