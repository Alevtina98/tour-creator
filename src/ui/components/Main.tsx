import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/agentActions";
import ConnectionStatus from "./ConnectionStatus";
import {setInspectDisabled, setInspectEnabled} from "../actions/mainAction";
import {StoreType} from "../reducers";

export interface MainComponentSelector {
    connected: boolean;
    isInspectEnabled: boolean;
    selector: string;
}

const MainComponent = () => {
    const dispatch = useDispatch();

    const { isInspectEnabled, selector, connected } = useSelector<StoreType, MainComponentSelector>(({ MainState }) => (MainState));
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


    return <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">
                <ConnectionStatus connection={connected} />
                <button onClick={onInspectClickHandler} title="Select an element to get its selector">
                    <span className="glyphicon glyphicon-zoom-in" />
                </button>
               {/*<button onClick={onTestHandler}>Start inspect2</button>*/}
            </h3>
        </div>
        <div className="panel-body">
            <ul>
                Selector: {selector}
            </ul>
        </div>

    </div>;
};

export default MainComponent;
