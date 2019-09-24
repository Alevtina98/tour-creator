import React, {CSSProperties, useEffect, useRef} from "react";

import {useDispatch, useSelector} from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/agentActions";
import ConnectionStatus from "./ConnectionStatus";
import {setInspectDisabled, setInspectEnabled} from "../actions/mainAction";
import {StoreType} from "../reducers";
import BlocklyComponent from "./BlocklyComponent";
//import Overlay from "react-overlay";
// import ReactBlocklyComponent from "react-blockly-component";

export interface MainComponentSelector {

    isInspectEnabled: boolean;
    selector: string;
    connected: boolean;
}

const MainComponent = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const {isInspectEnabled, selector, connected} = useSelector<StoreType, MainComponentSelector>(({MainState}) => (MainState));
    const codeBlock = useRef<HTMLTextAreaElement>();

    //Так как содержимое пустого массива всегда остаётся неизменным, эффект выполнится лишь один раз
    //аналогично componentDidMount()
    useEffect(() => {
        new AgentHandler(dispatch); //Инициализация агента общения со страницей
    }, []);


    const onInspectClickHandler = () => {
        if (isInspectEnabled) {
            dispatch(setInspectDisabled()); //Отправка экшена
            agentActions.disableSelectMode();//отправляем сообщение 'disableSelectMode'
            // chrome.devtools.inspectedWindow;
        } else {
            dispatch(setInspectEnabled());
            agentActions.enableSelectMode();
        }

    };
    // console.log("> inspectEnabled", isInspectEnabled)
    return (
        <div className="panel panel-default">
            <div className="main-container">
                <div className="relative">
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} code={codeBlock}/>
                    {isInspectEnabled &&

                        <div className="back-drop">
                            <div className="alert alert-light" role="alert" style={{
                                align: "center",
                                background: "rgb(255,255,255)",
                                width: "500px",
                                margin: "auto"
                            }}>
                                Выберите элемент на основной странице или нажмите
                                <button onClick={onInspectClickHandler} type="button" className="btn btn-light">
                                    Отмена
                                </button>
                            </div>
                        </div>  || null}
                </div>
                <div>
                    <textarea className="code-block" ref={codeBlock as any} />
                </div>
                <div>
                    <ul className="menu">
                        <li>Сценарии</li>
                        <li><span>"Сценарий 1"</span><em>инфо</em></li>
                        <li><span>"Сценарий 2"</span><em>инфо</em></li>
                        <li><span>"Сценарий 3"</span><em>инфо</em></li>
                    </ul>
                </div>
            </div>


        </div>);
};

export default MainComponent;
