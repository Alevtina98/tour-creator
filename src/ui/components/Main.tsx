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

    const {isInspectEnabled, selector, connected} = useSelector<StoreType, MainComponentSelector>(({MainState}) => (MainState));
    // Инициализация агента общения со страницей
    useEffect(() => {

        new AgentHandler(dispatch);
    }, []);


    const onInspectClickHandler = () => {
        if (isInspectEnabled) {
            dispatch(setInspectDisabled());
            agentActions.disableSelectMode();
        } else {
            dispatch(setInspectEnabled());
            agentActions.enableSelectMode();
        }

    };
    /*const onClick = () => {
        onInspectClickHandler();

    };*/
    // console.log("selector");
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
    console.log("> inspectEnabled", isInspectEnabled)
    return (
        <div className="panel panel-default">
           {/* <div className="panel-heading">
                <h3 className="panel-title">
                    <ConnectionStatus connection={connected}/>
                    <button onClick={onInspectClickHandler} title="Select an element to get its selector">
                        <span className="glyphicon glyphicon-zoom-in"/>
                    </button>
                    <button onClick={onInspectClickHandler}>Затемнение</button>

                </h3>
            </div>*/}
            {/*<div className="panel-body">
                <ul>
                    Selector: {selector}
                </ul>
            </div>*/}
            <BlocklyComponent selector={selector} inspect={onInspectClickHandler}/>
            {isInspectEnabled &&
            <div>

                {/*<div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Well done!</h4>
                    <p>Aww yeah, you successfully read this important alert message. This example text is going to run a
                        bit longer so that you can see how spacing within an alert works with this kind of content.</p>
                    <hr>
                        <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice
                            and tidy.</p>
                </div>*/}
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
