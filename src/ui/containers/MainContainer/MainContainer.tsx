import React, { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../../AgentHandler";
import agentActions from "../../actions/agentActions";
import { setInspectDisabled, setInspectEnabled } from "../../actions/inspectAction";
import { StoreType } from "../../reducers";
import BlocklyComponent from "../../components/BlocklyComponent";
import SaveTour from "../../components/ScriptButtons";
import HamburgerButton from "../../components/HamburgerButton";
import ScriptButtons from "../../components/ScriptButtons";
import { loadListTour, periodicallySave, putTour, saveTour } from "../../actions/selectedTourAction";
import { format } from "date-fns";
import uuid from "uuid";
import { ScriptValue } from "../../util/indexedDB";
import DateLastSave from "../../components/dateLlstSave";

export interface MainComponent {
    // connected: boolean;
    blocklyReloadEnabled: boolean;
}
export interface MainComponentSelector {
    isInspectEnabled: boolean;
    selector: string;
}
const MainComponent = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { blocklyReloadEnabled } = useSelector<StoreType, MainComponent>(
        ({ SelectedTourState }) => SelectedTourState
    );
    const { isInspectEnabled, selector } = useSelector<StoreType, MainComponentSelector>(
        ({ InspectState }) => InspectState
    );
    const codeBlock = useRef<HTMLTextAreaElement>();

    //Так как содержимое пустого массива всегда остаётся неизменным, эффект выполнится лишь один раз
    //аналогично componentDidMount()
    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
        // this.props.script = demo();
        // console.log("Script -> ",demo());
    }, [dispatch]);
    /* useEffect(() => {
        window.addEventListener("beforeunload", () => dispatch(putTour()));
    }, [dispatch]);*/
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
        <div>
            <div className="relative">
                <ScriptButtons />
                {(blocklyReloadEnabled && <DateLastSave />) || null}
            </div>
            {/*<div className="panel panel-default">*/}
            <div className="main-container">
                <div className="">
                    {/*<ConnectionStatus connection={connected} />*/}

                    {(blocklyReloadEnabled && (
                        <BlocklyComponent selector={selector} inspect={onInspectClickHandler} code={codeBlock} />
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
                {(blocklyReloadEnabled && (
                    <div>
                        <textarea readOnly className="code-block" ref={codeBlock as any} />
                        {/*<CodeMirror className="code-block" ref={codeBlock as any}/>*/}
                    </div>
                )) ||
                    null}

                <div>{/*<TourContainer />*/}</div>
            </div>
        </div>
    );
};

export default memo(MainComponent);
