import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import AgentHandler from "../AgentHandler";
import agentActions from "../actions/GameActions";
import ConnectionStatus from "./ConnectionStatus";

const MainComponent = () => {
    const dispatch = useDispatch();

    /**
     *
     * @type {typeof initialState}
     */
    const data = useSelector(({MainState}) => MainState);
    useEffect(() => {
        new AgentHandler(dispatch);
    }, []);

    const onInspectClickHandler = () => {
        if (data.isInspectEnabled) {
            agentActions.disableSelectMode();
        } else {
            agentActions.enableSelectMode();
        }
    };

    /*

                Functions:
                <li>dark({this.selector});</li>
                <li>Descriptor({this.selector}, "This is your Selector"); </li>
     */

    console.log(data);
    return <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">
                <ConnectionStatus connection={data.connected} />
                Create Tour
            </h3>
        </div>
        <div className="panel-body">
            <button onClick={onInspectClickHandler}>Start inspect</button>
            <ul>
                Selector: {data.selector}
                <h4>{JSON.stringify(data)}</h4>
            </ul>
        </div>

    </div>;
};

export default MainComponent;
