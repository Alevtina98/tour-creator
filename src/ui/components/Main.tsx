import React, {CSSProperties, useEffect} from "react";

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

    //Инициализация агента общения со страницей
    //Так как содержимое пустого массива всегда остаётся неизменным, эффект выполнится лишь один раз
    //аналогично componentDidMount()
    useEffect(() => {
        new AgentHandler(dispatch);
    }, []);


    const onInspectClickHandler = () => {
        if (isInspectEnabled) {
            dispatch(setInspectDisabled()); //Отправка экшена
            agentActions.disableSelectMode();
        } else {
            dispatch(setInspectEnabled());
            agentActions.enableSelectMode();
        }

    };
    const styles: CSSProperties | undefined = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bottom: 0,
        background: "rgba(0,0,0, .2)",
        display: "flex"
    };
   // console.log("> inspectEnabled", isInspectEnabled)
    return (
        <div className="panel panel-default">
            <BlocklyComponent selector={selector} inspect={onInspectClickHandler}/>
            {isInspectEnabled &&
            <div>
                <div style={styles} >
                    <div className="alert alert-light" role="alert" style={{align: "center", background: "rgb(255,255,255)", width: "500px", margin: "auto"}} >
                        Выберите элемент на основной странице или нажмите
                            <button onClick={onInspectClickHandler} type="button" className="btn btn-light" >
                                Отмена
                            </button>
                    </div>
                </div>

            </div>||null}
        </div>);
};

export default MainComponent;
