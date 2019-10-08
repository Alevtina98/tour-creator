import React, { FC } from "react";
import { ScriptValue } from "../util/indexedDB";

export interface ScriptProps {
    onClick: any;
    tour: ScriptValue;
}

const Script: FC<ScriptProps> = ({ onClick, tour }) => {
    return <div className="tour" onClick={onClick}>
        <small className="tour-name">{tour.name}</small>
        <small className="tour-time">{tour.date}</small>
    </div>
};

export default Script;
