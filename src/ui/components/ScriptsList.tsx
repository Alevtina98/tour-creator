import React, {useEffect, useState} from 'react';
import IDB, {ScriptValue} from "../util/indexedDB";

const ScriptsList = () => {
    const [list, setList] = useState<ScriptValue[]>([]);

    const loadItems = async () => {
        const result = await (await IDB()).getAll("script");
        setList(result);
    };

    useEffect(() => {
        loadItems();
    }, []);
    console.log("LIST", list);

    return (
        <div className="list-group">
            {list.map(el => <a href="#"
                               className="list-group-item list-group-item-action flex-column align-items-start ">
                <div className="d-flex w-200 justify-content-between">
                    <h5 className="mb-1">{el.date}</h5>
                    <small className="text-muted">1 days ago</small>
                </div>
            </a>)}
        </div>
    );
};

export default ScriptsList;
