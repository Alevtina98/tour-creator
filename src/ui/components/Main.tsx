import React, {memo, useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/agentActions";
import ConnectionStatus from "./ConnectionStatus";
import { setInspectDisabled, setInspectEnabled } from "../actions/InspectAction";
import { StoreType } from "../reducers";
import BlocklyComponent from "./BlocklyComponent";
import ScriptsList from "./ScriptsList";
import ScriptsButtons from "./ScriptsButtons";

export interface MainComponent {
    connected: boolean;
}
export interface MainComponentSelector {
    isInspectEnabled: boolean;
    selector: string;
}
const MainComponent = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { connected } = useSelector<StoreType, MainComponent>(({ MainState }) => MainState);
    const { isInspectEnabled, selector } = useSelector<StoreType, MainComponentSelector>(
        ({ InspectState }) => InspectState,
    );
    const codeBlock = useRef<HTMLTextAreaElement>();

    //Так как содержимое пустого массива всегда остаётся неизменным, эффект выполнится лишь один раз
    //аналогично componentDidMount()
    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
        // this.props.script = demo();
        // console.log("Script -> ",demo());
    }, []);

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
        <div className="panel panel-default">
            <div className="main-container">
                <div className="relative">
                    <ConnectionStatus connection={connected} />
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} code={codeBlock} />
                    {(isInspectEnabled && (
                        <div className="back-drop">
                            <div
                                className="alert alert-light"
                                role="alert"
                                style={{
                                    textAlign: "center",
                                    background: "rgb(255,255,255)",
                                    width: "500px",
                                    margin: "auto",
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
                    <ScriptsButtons />
                    <ScriptsList />
                </div>

            </div>
        </div>
    );
};

export default memo(MainComponent);
