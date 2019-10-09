import React, { FC, useEffect, useState} from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import Script from "./Script";
import { useDispatch } from "react-redux";

const ScriptList = () => {
    const dispatch = useDispatch();
    const [list, setList] = useState<ScriptValue[]>([]);
    const loadItems = async () => {
        const result = await (await IDB()).getAll("script");
        setList(result);
    };
    /*const SelectedTour = (key: string) => {
        dispatch(setKey(key));
        // setColor("#808080 !important")
        // eslint-disable-next-line no-console
        console.log("key >> ", key);
    };*/
    useEffect(() => {
        loadItems();
    }, []);
    return (
        <div className="list-group">
            {list.map(el => (
                <Script tour={el} />
            ))}
        </div>
    );
};

export default ScriptList;
