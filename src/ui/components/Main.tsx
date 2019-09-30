import React, { CSSProperties, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/agentActions";
import ConnectionStatus from "./ConnectionStatus";
import { setInspectDisabled, setInspectEnabled, setCode } from "../actions/mainAction";
import { StoreType } from "../reducers";
import BlocklyComponent from "./BlocklyComponent";
import { ScriptValue } from "C:/workspace/tour-creator/src/ui/util/indexedDB";
import ScriptsList from "./ScriptsList";

export interface MainComponentSelector {
    isInspectEnabled: boolean;
    selector: string;
    connected: boolean;
    //script: ScriptValue;
}

const MainComponent = () => {
    const dispatch = useDispatch();
    //маппинг значений из store
    const { isInspectEnabled, selector, connected } = useSelector<StoreType, MainComponentSelector>(
        ({ MainState }) => MainState,
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
    const saveCode = () => {
        /*dispatch(
            setCode({
                ...script,
                date: Date(),
                name: "Test",
            }),
        ); //Отправка экшена*/
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
                                    align: "center",
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
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary">
                            Загрузить
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={saveCode}>
                            Сохранить
                        </button>

                        <button type="button" className="btn btn-secondary">
                            Редактировать
                        </button>
                        <button type="button" className="btn btn-secondary">
                            Удалить
                        </button>
                    </div>
                    {/*
                    <div className="list-group">
                       <a href="#" className="list-group-item list-group-item-action active">
                            Сценарий 1
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">Сценарий 2</a>
                        <a href="#" className="list-group-item list-group-item-action">Сценарий 3</a>
                        <a href="#" className="list-group-item list-group-item-action">Сценарий 4</a>
                        <a href="#" className="list-group-item list-group-item-action">Сценарий 5</a>

                    </div>*/}
                    <ScriptsList />
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
