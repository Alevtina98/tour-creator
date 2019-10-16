import React, { DOMElement, useEffect, useState } from "react";
//import Modal from "react-bootstrap";
import IDB, { ScriptValue } from "../util/indexedDB";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { createNewTour, delToDb, loadToDb, periodicallySave, saveTour } from "../actions/selectedTourAction";
import { Button, ButtonGroup, ButtonToolbar, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useInputValue } from "../hooks/useInputValue";
import { FC, memo } from "react";
import { format } from "date-fns";
import Script from "./Script";
import uuid from "uuid";
import HamburgerButton from "./HamburgerButton";
import BurgerMenu from "./BurgerMenu";

export interface ScriptButtons {
    tourDB: ScriptValue;
}

const DateLastSave = () => {
    const { tourDB } = useSelector<StoreType, ScriptButtons>(({ SelectedTourState }) => SelectedTourState);
    return <div className="date-save-on-panel">Последнее сохранение {tourDB.date}</div>;
};

export default DateLastSave;
