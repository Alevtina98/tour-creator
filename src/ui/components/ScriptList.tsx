import React, { FC, useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import Script from "./Script";
import { useDispatch, useSelector } from "react-redux";
import {Button, FormControl} from "react-bootstrap";
import { StoreType } from "../reducers";
import { loadListTour } from "../actions/selectedTourAction";

export interface ScriptListProps {
    listTour: ScriptValue[];
}
export interface MenuProps {
    onClickScript: any;
    onClickEsc: any;
}
const ScriptList: FC<MenuProps> = ({ onClickScript, onClickEsc }) => {
    const dispatch = useDispatch();
    const { listTour } = useSelector<StoreType, ScriptListProps>(({ SelectedTourState }) => SelectedTourState);
    //const [list, setList] = useState<ScriptValue[]>([]);
    const [filterList, setFilterList] = useState<ScriptValue[]>([]);
    const [searchTour, setSearchTour] = useState<string>("");
    /*const SelectedTour = (key: string) => {
        dispatch(setKey(key));
        // setColor("#808080 !important")
        // eslint-disable-next-line no-console
        console.log("key >> ", key);
    };*/
    useEffect(() => {
        setFilterList(listTour);
    }, [listTour])
    useEffect(() => {
        dispatch(loadListTour());
    }, []);
    const searchUpdated = (event: React.ChangeEvent<any>) => {
        setFilterList(listTour.filter(myFilter(event.target.value)));
    };
    const myFilter = (searchTour: string) => ({ name, desc }: ScriptValue): boolean => {
        return clearValue(name).includes(clearValue(searchTour)) || clearValue(desc).includes(clearValue(searchTour));
    };

    return (
        <div className="tour-list">
            <Button variant="light" onClick={onClickEsc} className="burger-menu-button-close" >
                <img src="https://v1.iconsearch.ru/uploads/icons/webdesigncreative/128x128/cross-lines.png" className="img-close" />
            </Button>
            <FormControl placeholder="Поиск" className="tour-search" onChange={searchUpdated} />
            <div className="list-tour-group">
                {filterList.map(el => (
                    <Script tour={el} onClick={onClickScript} key={el.key} />
                ))}
            </div>
        </div>
    );
};
export const clearValue = (str: string): string => str.toLocaleLowerCase().trim();
export default ScriptList;
