import React, { FC, useEffect, useState } from "react";
import IDB, { ScriptValue } from "../../../util/indexedDB";
import Script from "../Script/Script";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import { loadListTour } from "../../../actions/selectedTourAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";

export interface ScriptListProps {
    listTour: ScriptValue[];
}
export interface MenuProps {
    onClickScript: any;
    onClickEsc: any;
    isOpen: boolean;
}
    const ScriptList: FC<MenuProps> = ({ onClickScript, onClickEsc, isOpen }) => {
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
    }, [listTour]);
    useEffect(() => {
        dispatch(loadListTour());
    }, [dispatch]);
    const searchUpdated = (event: React.ChangeEvent<any>) => {
        setFilterList(listTour.filter(myFilter(event.target.value)));
    };
    const myFilter = (searchTour: string) => ({ name, desc }: ScriptValue): boolean => {
        return clearValue(name).includes(clearValue(searchTour)) || clearValue(desc).includes(clearValue(searchTour));
    };
    return (
        <div
            className={cn("tour-list", {
                "tour-list--open": isOpen
            })}
        >
            <Button variant="light" onClick={onClickEsc} className="burger-menu-button-close">
                <FontAwesomeIcon icon={faTimes} className="i-close" size="3x" color="#A1A2A2" />
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
