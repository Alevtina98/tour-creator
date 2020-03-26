import { FC, memo } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import * as React from "react";

import DateTimeFormat = Intl.DateTimeFormat;

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

//import DateTimePicker from "react-bootstrap-date-time-picker";

//import DatePicker from "react-bootstrap-date-picker";

export interface PostponeState {
    onPostpone: (date: string) => void;
    buttonStyle?: React.CSSProperties;
}
const Postpone: FC<PostponeState> = ({ onPostpone, buttonStyle }) => {
    const controlButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        marginRight: "5px"
    };
    const formPostponeStyle: React.CSSProperties = {
        padding: "10px",
        /*background: "white",*/
        marginTop: "0px"
    };
    const yesterday = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        onPostpone(date.toDateString());
        console.log(date);
    };
    const weekLater = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        onPostpone(date.toDateString());
        console.log(date);
    };
    const monthLater = () => {
        const date = new Date();
        date.setDate(date.getMonth() + 1);
        onPostpone(date.toDateString());
        console.log(date);
    };
    return (
        <DropdownButton title="Отложить" style={controlButtonStyle} className=" krista-bootstrap-wrapper ">
            <Dropdown.Item onClick={yesterday}>на день</Dropdown.Item>
            <Dropdown.Item onClick={weekLater}>на неделю</Dropdown.Item>
            <Dropdown.Item onClick={monthLater}>на месяц</Dropdown.Item>
        </DropdownButton>

        /* <Dropdown>
             <Dropdown.Toggle
                style={controlButtonStyle}
                className=" krista-bootstrap-wrapper "
                id="dropdown-custom-components"
            >
                Отложить
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <div style={formPostponeStyle}>
                    <div style={{ marginBottom: "5px" }}>Дата просмотра</div>
                    <div style={{ marginBottom: "30px" }}>

                        <DatePicker selected={date} onSelect={changeDate} onChange={changeDate} />

                    </div>

                    <Button
                        style={{ ...controlButtonStyle, position: "absolute", right: "5px", bottom: "5px" }}
                        onClick={onSave}
                    >
                        Сохранить
                    </Button>
                </div>
            </Dropdown.Menu>
             </Dropdown>*/

        /* <DateTimeField />*/
        /* <ButtonToolbar style={{ marginLeft: "0px" }}>
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
            </ButtonToolbar>*/
    );
};

export default memo(Postpone);
