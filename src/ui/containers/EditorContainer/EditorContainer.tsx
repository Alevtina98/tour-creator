import React, { memo, useRef, useState } from "react";
import BlocklyComponent from "../../components/BlocklyComponent";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setInspectDisabled, setInspectEnabled } from "../../actions/inspectAction";
import agentActions from "../../actions/agentActions";
import ModalLockDevtoolsComponent from "../../components/ModalTemplates/ModalLockDevtoolsComponent";
import ModalInputsComponent from "../../components/ModalTemplates/ModalInputsComponent";
import ModalTextComponent from "../../components/ModalTemplates/ModalTextComponent";
import { useControlledInputValue } from "../../hooks/useControleInputValue";
import { TourType } from "../../util/restClient/requestTour";
import {delToDb, saveTour} from "../../actions/selectedTourAction";
import ModelsScript from "../../components/ScriptList/ModalsScript";

export interface TourEditorComponentProps {
    blocklyReloadEnabled: boolean;
    isInspectEnabled: boolean;
    selector: string;
    tour: TourType;
}
const EditorContainer = () => {
    const dispatch = useDispatch();
    const { blocklyReloadEnabled, isInspectEnabled, selector, tour } = useSelector<StoreType, TourEditorComponentProps>(
        ({ SelectedTourState, InspectState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            tour: SelectedTourState.tourDB,
            isInspectEnabled: InspectState.isInspectEnabled,
            selector: InspectState.selector
        })
    );
    const onInspectClickHandler = () => {
        if (isInspectEnabled) {
            dispatch(setInspectDisabled()); //Отправка экшена
            agentActions.disableSelectMode(); //отправляем сообщение 'disableSelectMode'
            // chrome.devtools.inspectedWindow;
        } else {
            dispatch(setInspectEnabled());
            agentActions.enableSelectMode();
        }
        //console.log("inspectEnabled > ", isInspectEnabled)
    };
    return (
        <div className="editor-container">
            {blocklyReloadEnabled && (
                <>
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} />
                    <div className="code-block">
                        {tour.codeJS.split(/(\/\/!.*)|(\/\*\*\n \*.*\n \*\/)|(\/\/.*)/g).map((el, index) => {
                            if (!el) return null;
                            let name = "comment";
                            if (!(index % 4)) name = "text";
                            else if (!((index - 1) % 4)) name = "error";
                            return el.split(/[\n]/g).map(str => <div className={name + "Style"}>{str}</div>);
                        })}
                    </div>
                </>
            )}
            <ModalLockDevtoolsComponent
                show={isInspectEnabled}
                text="Выберите элемент на основной странице или нажмите"
                handelCancel={onInspectClickHandler}
            />
        </div>
    );
};

export default memo(EditorContainer);
