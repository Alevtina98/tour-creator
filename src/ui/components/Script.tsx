import React, { FC } from "react";
import { ScriptValue } from "../util/indexedDB";

export interface ScriptProps {
    onClick: any;
    tour: ScriptValue;
}

const Script: FC<ScriptProps> = ({ onClick, tour }) => {
    return <div className="list-group-item list-group-item-action flex-column align-items-start" onClick={onClick}>
        <small className="mb-1">{tour.name}</small>
        <small className="text-muted">{tour.date}</small>
    </div>
};

export default Script;
