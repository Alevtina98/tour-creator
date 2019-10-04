import React, {Dispatch, useEffect, useState} from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import Script from "./Script";
import {useDispatch} from "react-redux";
import {setKey} from "../actions/selectedTourAction";


const ScriptList = () => {
    const dispatch = useDispatch();
    const [list, setList] = useState<ScriptValue[]>([]);
    const [color, setColor] = useState<string>("");
    const loadItems = async () => {
        const result = await (await IDB()).getAll("script");
        setList(result);
    };
    const SelectedTour = (key: string) => {
        dispatch(setKey(key));
       // setColor("#808080 !important")
        console.log("key >> ", key);
    };
    useEffect(() => {
        loadItems();
    }, []);
    return (
        <div className="list-group">
            {list.map(el => (
                <Script onClick={() => {SelectedTour(el.name+el.date)}} tour={el}/>
            ))}
        </div>
    );
};

export default ScriptList;
