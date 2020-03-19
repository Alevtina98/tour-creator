import { FC, memo } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { disposeEvent } from "../util/utils";
import * as React from "react";

export interface ControlButtonsState {
    onStart: () => void;
    onPostpone: () => void;
    buttonStyle?: React.CSSProperties;
}
const ControlButtons: FC<ControlButtonsState> = ({ onStart, onPostpone, buttonStyle }) => {
    const controlButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        marginRight: "5px"
    };
    return (
        <ButtonToolbar style={{ marginLeft: "0px" }}>
            <Button
                style={controlButtonStyle}
                className=" krista-bootstrap-wrapper "
                onClick={event => {
                    disposeEvent(event);
                    onStart();
                    console.log("start");
                }}
            >
                Начать
            </Button>
            <Button
                style={controlButtonStyle}
                className=" krista-bootstrap-wrapper "
                onClick={event => {
                    disposeEvent(event);
                    onPostpone();
                }}
            >
                Отложить
            </Button>
        </ButtonToolbar>
    );
};

export default memo(ControlButtons);
