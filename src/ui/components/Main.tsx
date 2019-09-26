import React, {CSSProperties, useEffect, useRef} from "react";

import {useDispatch, useSelector} from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/agentActions";
import ConnectionStatus from "./ConnectionStatus";
import {setInspectDisabled, setInspectEnabled} from "../actions/mainAction";
import {StoreType} from "../reducers";
import BlocklyComponent from "./BlocklyComponent";

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
        //console.log("inspectEnabled > ", isInspectEnabled)
    };

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
                    <textarea readOnly className="code-block" ref={codeBlock as any} />
                    {/*<CodeMirror className="code-block" ref={codeBlock as any}/>*/}
                </div>

                <div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary">Загрузить</button>
                        <button type="button" className="btn btn-secondary">Сохранить</button>
                        <button type="button" className="btn btn-secondary">Редактировать</button>
                        <button type="button" className="btn btn-secondary">Удалить</button>
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
                    <div className="list-group">
                        <a href="#"
                           className="list-group-item list-group-item-action flex-column align-items-start ">
                            <div className="d-flex w-200 justify-content-between">
                                <h5 className="mb-1">Сценарий 1</h5>
                                <small className="text-muted">1 days ago</small>
                            </div>
                           {/* <p className="mb-1">Это очень крутой сценарий для очень крутого обновления</p>
                            <small className="text-muted">В разработке</small>*/}
                        </a>
                        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Сценарий 2</h5>
                                <small className="text-muted">3 days ago</small>
                            </div>
                          {/*  <p className="mb-1">Это маленький сценарий для одной функции</p>
                            <small className="text-muted">Нужно закончить уже вчера</small>*/}
                        </a>
                        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Сценарий 3</h5>
                                <small>26 days ago</small>
                            </div>
                            {/*<p className="mb-1">Демонстрационный сценарий 1</p>
                            <small >Только для просмотра</small>*/}
                        </a>
                        <a href="#" className="list-group-item list-group-item-action flex-column align-items-start disabled">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">Сценарий 4</h5>
                                <small className="text-muted">30 days ago</small>
                            </div>
                           {/* <p className="mb-1">Демонстрационный сценарий 2</p>
                            <small className="text-muted">Только для просмотра</small>*/}
                        </a>
                    </div>
                </div>
            </div>


        </div>);
};

export default MainComponent;
