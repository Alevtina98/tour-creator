import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { closeSelectedTour, saveTour, setErrorsRunTour } from "../../actions/selectedTourAction";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import agentActions from "../../actions/agentActions";
import { getInitData, TourType } from "../../util/restClient/requestTour";
import { setModal } from "../../actions/modalAction";
import * as Datetime from "react-datetime";

export interface ScriptButtons {
    selectedTour: TourType;
    blocklyReloadEnabled: boolean;
}

const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { selectedTour, blocklyReloadEnabled } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );

    /*
     c запуском модальных окон из ModalsScript.tsx
   */
    const onShowCreated = () => {
        const newTour: TourType = getInitData();
        dispatch(setModal({ tour: newTour, status: "create" }));
    };
    const onShowCopy = () => {
        const newName = selectedTour.name + "-копия";
        dispatch(setModal({ tour: { ...selectedTour, name: newName }, status: "copy" }));
    };
    const onShowRun = () => {
        agentActions.runScript(selectedTour.codeJS);
        dispatch(setErrorsRunTour([]));
        dispatch(setModal({ tour: selectedTour, status: "show" }));
    };
    /*
      без запуска модальных окон
    */
    const saveCode = () => {
        dispatch(saveTour());
    };
    const closeTour = () => {
        dispatch(closeSelectedTour());
    };
    return (
        <div className="relative flex-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={onShowCreated} data-testid="createTourButton">
                        Создать
                    </Nav.Link>
                    <NavDropdown title="Сохранить" id="basic-nav-dropdown" disabled={!blocklyReloadEnabled} bg="dark">
                        <NavDropdown.Item onClick={saveCode} data-testid="saveTourButton">
                            Сохранить
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={onShowCopy} data-testid="copyTourButton">
                            Сохранить как
                        </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={onShowRun} data-testid="runTourButton" disabled={!blocklyReloadEnabled}>
                        Запустить
                    </Nav.Link>
                    <Nav.Link onClick={closeTour} data-testid="closeTourButton" disabled={!blocklyReloadEnabled}>
                        Закрыть
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </div>
    );
};

export default ScriptButtons;
