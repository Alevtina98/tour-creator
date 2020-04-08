import { FC, memo } from "react";
import { Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton } from "react-bootstrap";
import { disposeEvent } from "../util/utils";
import * as React from "react";

export interface ControlButtonsState {
    onStart: () => void;
    onPostpone: (date: string) => void;
    buttonStyle?: React.CSSProperties;
}
const ControlButtons: FC<ControlButtonsState> = ({ onStart, onPostpone, buttonStyle }) => {
    const controlButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        marginRight: "3%"
    };
    const yesterday = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        onPostpone(date.toDateString());
    };
    const weekLater = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        onPostpone(date.toDateString());
    };
    const monthLater = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        onPostpone(date.toDateString());
    };
    return (
        <ButtonToolbar style={{ marginLeft: "0", display: "flex" }}>
            <Button
                style={controlButtonStyle}
                onClick={event => {
                    disposeEvent(event);
                    onStart();
                    console.log("start");
                }}
            >
                Начать
            </Button>
            <Dropdown>
                <Dropdown.Toggle style={controlButtonStyle} id="dropdown-custom-components">
                    Отложить
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ marginLeft: "0" }}>
                    <Dropdown.Item onClick={yesterday}>на день</Dropdown.Item>
                    <Dropdown.Item onClick={weekLater}>на неделю</Dropdown.Item>
                    <Dropdown.Item onClick={monthLater}>на месяц</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* <Postpone buttonStyle={controlButtonStyle} onPostpone={onPostpone} />*/}
        </ButtonToolbar>
    );
};

export default memo(ControlButtons);
