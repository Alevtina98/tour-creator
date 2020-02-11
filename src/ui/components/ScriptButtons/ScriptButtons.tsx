import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { closeSelectedTour, saveTour, setErrorsRunTour } from "../../actions/selectedTourAction";
import { Button, ButtonToolbar } from "react-bootstrap";
import BurgerMenuContainer from "../../containers/BurgerMenuContainer/BurgerMenuContainer";
import agentActions from "../../actions/agentActions";
import { getInitData, TourType } from "../../util/restClient/requestTour";
import { setModal } from "../../actions/modalAction";

export interface ScriptButtons {
    tourDB: TourType;
    blocklyReloadEnabled: boolean;
}

const ScriptButtons = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { tourDB, blocklyReloadEnabled } = useSelector<StoreType, ScriptButtons>(
        ({ SelectedTourState }) => SelectedTourState
    );

    /*
     c запуском модальных окон
   */
    // из ModalsScript.tsx
    const onShowCreated = () => {
        const newTour: TourType = getInitData();
        dispatch(setModal({ tour: newTour, status: "create" }));
    };
    const onShowCopy = () => {
        const newName = tourDB.name + " - копия";
        dispatch(setModal({ tour: { ...tourDB, name: newName }, status: "copy" }));
    };
    const onShowRun = () => {
        agentActions.runScript(tourDB.codeJS);
        dispatch(setErrorsRunTour([]));
        dispatch(setModal({ tour: tourDB, status: "show" }));
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
        <div className="relative">
            <div id="outer-container">
                <BurgerMenuContainer />
            </div>
            <ButtonToolbar>
                <Button variant="light" onClick={onShowCreated} data-testid="createTourButton">
                    Создать
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={onShowCopy}
                    disabled={!blocklyReloadEnabled}
                    data-testid="copyTourButton"
                >
                    Сохранить как
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={saveCode}
                    disabled={!blocklyReloadEnabled}
                    data-testid="saveTourButton"
                >
                    Сохранить
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={onShowRun}
                    disabled={!blocklyReloadEnabled}
                    data-testid="runTourButton"
                >
                    Запустить
                </Button>
                <Button
                    size="sm"
                    variant="light"
                    onClick={closeTour}
                    disabled={!blocklyReloadEnabled}
                    data-testid="closeTourButton"
                >
                    Закрыть
                </Button>
            </ButtonToolbar>
        </div>
    );
};

export default ScriptButtons;
