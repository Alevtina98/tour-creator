import React, { FC, useEffect, useState } from "react";
import IDB, { ScriptValue } from "../util/indexedDB";
import Script from "./Script";
import { useDispatch, useSelector } from "react-redux";
import { FormControl } from "react-bootstrap";
import { StoreType } from "../reducers";
import { loadListTour } from "../actions/selectedTourAction";

export interface ScriptListProps {
    listTour: ScriptValue[];
}
export interface MenuProps {
    onClickScript: any;
}
const ScriptList: FC<MenuProps> = ({ onClickScript }) => {
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
    });
    const searchUpdated = (event: React.ChangeEvent<any>) => {
        setFilterList(listTour.filter(myFilter(event.target.value)));
    };
    const myFilter = (searchTour: string) => ({ name, desc }: ScriptValue): boolean => {
        return clearValue(name).includes(clearValue(searchTour)) || clearValue(desc).includes(clearValue(searchTour));
    };

    return (
        <div className="tour-list">
            <FormControl placeholder="Поиск" className="tour-search" onChange={searchUpdated} />

            <div className="list-group list-tour-group">
                {filterList.map(el => (
                    <Script tour={el} onClick={onClickScript} />
                ))}
            </div>
        </div>
    );
};
export const clearValue = (str: string): string => str.toLocaleLowerCase().trim();
export default ScriptList;
