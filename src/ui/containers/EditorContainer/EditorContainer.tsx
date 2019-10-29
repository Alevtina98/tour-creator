import React, { memo, useRef } from "react";
import BlocklyComponent from "../../components/BlocklyComponent";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setInspectDisabled, setInspectEnabled } from "../../actions/inspectAction";
import agentActions from "../../actions/agentActions";

export interface TourEditorComponentProps {
    blocklyReloadEnabled: boolean;
    isInspectEnabled: boolean;
    selector: string;
}
const EditorContainer = () => {
    const dispatch = useDispatch();
    const { blocklyReloadEnabled, isInspectEnabled, selector } = useSelector<StoreType, TourEditorComponentProps>(
        ({ SelectedTourState, InspectState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            isInspectEnabled: InspectState.isInspectEnabled,
            selector: InspectState.selector
        })
    );
    const codeBlock = useRef<HTMLTextAreaElement>();
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
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} code={codeBlock} />
                    <textarea readOnly className="code-block" ref={codeBlock as any} />
                </>
            )) ||
                null}
            {(isInspectEnabled && (
                <div className="back-drop">
                    <div
                        className="alert alert-light"
                        role="alert"
                        style={{
                            textAlign: "center",
                            background: "rgb(255,255,255)",
                            width: "500px",
                            margin: "auto"
                        }}
                    >
                        Выберите элемент на основной странице или нажмите
                        <button onClick={onInspectClickHandler} type="button" className="btn btn-light">
                            Отмена
                        </button>
                    </div>
                </div>
            )) ||
                null}
        </div>
    );
};

export default memo(EditorContainer);
