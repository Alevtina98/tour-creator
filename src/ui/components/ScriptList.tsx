import React, { FC, useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import Script from "./Script";
import { useDispatch } from "react-redux";
import ScriptsButtons from "./ScriptButtons";
import Navbar from "react-bootstrap/es/Navbar";
import { Button, Form, FormControl, Nav } from "react-bootstrap";
import SearchInput, { createFilter } from "react-search-input";

const KEYS_TO_FILTERS = ["name", "date", "desc"];
const ScriptList = () => {
    const dispatch = useDispatch();
    const [list, setList] = useState<ScriptValue[]>([]);
    const [filterList, setFilterList] = useState<ScriptValue[]>([]);
    const [searchTour, setSearchTour] = useState<string>("");
    const loadItems = async () => {
        const result = await (await IDB()).getAll("script");
        setList(result);
        setFilterList(result);
        // console.log("map >> ", list);
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
    const searchUpdated = (tourName: string) => {
        if (tourName != "") {
            setSearchTour(tourName);
            setFilterList(list.filter(createFilter(searchTour, KEYS_TO_FILTERS)));
        } else setFilterList(list);
    };
    return (
        <div className="tour-list">
            <SearchInput placeholder="Поиск" className="tour-search" onChange={searchUpdated} />

            <div className="list-group">
                {filterList.map(el => (
                    <Script tour={el} />
                ))}
            </div>
        </div>
    );
};

export default ScriptList;
