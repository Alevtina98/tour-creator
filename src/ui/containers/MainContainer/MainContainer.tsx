import React, { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../../AgentHandler";
import agentActions from "../../actions/agentActions";
import ConnectionStatus from "../../components/ConnectionStatus/ConnectionStatus";
import { setInspectDisabled, setInspectEnabled } from "../../actions/inspectAction";
import { StoreType } from "../../reducers";
import BlocklyComponent from "../../components/BlocklyComponent";
import ScriptList from "../../components/ScriptList";
import ScriptsButtons from "../../components/ScriptButtons";
import TourContainer from "../ToursContainer/TourContainer";
import { setLoadBocklyDisabled, setLoadBocklyEnabled } from "../../actions/mainAction";

export interface MainComponent {
    connected: boolean;
    blocklyReloadEnabled: boolean;
}
export interface MainComponentSelector {
    isInspectEnabled: boolean;
    selector: string;
}
const MainComponent = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { connected, blocklyReloadEnabled } = useSelector<StoreType, MainComponent>(({ MainState }) => MainState);
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
    const onLoadTourClickHandler = () => {
        dispatch(setLoadBocklyDisabled());
        window.setTimeout(() => {
            dispatch(setLoadBocklyEnabled());
        }, 5);
    };
    return (
        <div className="panel panel-default">
            <div className="main-container">
                <div className="relative">
                    <ConnectionStatus connection={connected} />
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
                <div>
                    <textarea readOnly className="code-block" ref={codeBlock as any} />
                    {/*<CodeMirror className="code-block" ref={codeBlock as any}/>*/}
                </div>

                <div>
                    <TourContainer load={onLoadTourClickHandler} />
                </div>
            </div>
        </div>
    );
};

export default memo(MainComponent);
