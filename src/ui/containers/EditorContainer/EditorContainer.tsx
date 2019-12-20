import React, { memo, useRef } from "react";
import BlocklyComponent from "../../components/BlocklyComponent";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setInspectDisabled, setInspectEnabled } from "../../actions/inspectAction";
import agentActions from "../../actions/agentActions";
import ModalLockDevtoolsComponent from "../../components/ModalLockDevtoolsComponent";
import Script from "../../components/ScriptList/Script/Script";

export interface TourEditorComponentProps {
    blocklyReloadEnabled: boolean;
    isInspectEnabled: boolean;
    selector: string;
    tourJS: string;
}
const EditorContainer = () => {
    const dispatch = useDispatch();
    const { blocklyReloadEnabled, isInspectEnabled, selector, tourJS } = useSelector<
        StoreType,
        TourEditorComponentProps
    >(({ SelectedTourState, InspectState }) => ({
        blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
        tourJS: SelectedTourState.tourJS,
        isInspectEnabled: InspectState.isInspectEnabled,
        selector: InspectState.selector
    }));
    /*const getCodeBlock = () => {
        tourJS.split(/(\/\/.*)|(\/\*\*\n \*.*\n \*\/)/g).map
    };*/
    // code.split(/(\/\/.*)|(\/\*\*\n \*.*\n \*\/)/g)

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
        <div className="main-container">
            {(blocklyReloadEnabled && (
                <>
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} />
                    <div className="code-block">
                        {tourJS.split(/(\/\/!.*)|(\/\*\*\n \*.*\n \*\/)|(\/\/.*)/g).map((el, index) => {
                            if (!el) return null;
                            let name = "comment";
                            if (!(index % 4)) name = "text";
                            else if (!((index - 1) % 4)) name = "error";
                            return el.split(/[\n]/g).map(str => <div className={name + "Style"}>{str}</div>);
                        })}
                    </div>
                </>
            )) ||
                null}
            <ModalLockDevtoolsComponent
                show={isInspectEnabled}
                text="Выберите элемент на основной странице или нажмите"
                handelCancel={onInspectClickHandler}
            />
        </div>
    );
};

export default memo(EditorContainer);
