import React, { FC, useEffect, useState } from "react";
import Script from "../Script/Script";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import { loadListTour } from "../../../actions/selectedTourAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import { getDate, TourType } from "../../../util/restClient/requestTour";

export interface ScriptListProps {
    listTour: TourType[];
}
export interface MenuProps {
    onClickScript: any;
    onClickEsc: any;
    isOpen: boolean;
}
const ScriptList: FC<MenuProps> = ({ onClickScript, onClickEsc, isOpen }) => {
    const dispatch = useDispatch();
    const { listTour } = useSelector<StoreType, ScriptListProps>(({ SelectedTourState }) => SelectedTourState);
    //const [list, setList] = useState<TourType[]>([]);
    const [filterList, setFilterList] = useState<TourType[]>([]);
    const [searchTour, setSearchTour] = useState<string>("");
    const [filterTour, setFilterTour] = useState<string>("");
    /*const SelectedTour = (key: string) => {
        dispatch(setKey(key));
        // setColor("#808080 !important")
        // eslint-disable-next-line no-console
        console.log("key >> ", key);
    };*/
    useEffect(() => {
        setFilterList(listTour);
        listTour.sort(function(a, b) {
            const dateA: Date = getDate(a.dateChange),
                dateB: Date = getDate(b.dateChange);
            return +dateB - +dateA; //сортировка по убыванию дате
        });
        setFilterList(listTour.filter(myFilter(filterTour)));
    }, [filterTour, listTour]);
    useEffect(() => {
        dispatch(loadListTour());
        // eslint-disable-next-line no-console
        console.log("ScriptList useEffect");
    }, [dispatch]);
    const searchUpdated = (event: React.ChangeEvent<any>) => {
        setFilterList(listTour.filter(myFilter(event.target.value)));
        setFilterTour(event.target.value);
    };
    const myFilter = (searchTour: string) => ({ name, desc }: TourType): boolean => {
        return (
            clearValue(name || "").includes(clearValue(searchTour)) ||
            clearValue(desc || "").includes(clearValue(searchTour))
        );
    };
    return (
        <div
            className={cn("tour-list", {
                "tour-list--open": isOpen
            })}
        >
            <Button
                variant="light"
                onClick={onClickEsc}
                className="burger-menu-button-close"
                data-testid="list-button-close"
            >
                <FontAwesomeIcon icon={faTimes} className="i-close" size="3x" color="#A1A2A2" />
            </Button>
            <FormControl
                placeholder="Поиск"
                className="tour-search"
                onChange={searchUpdated}
                data-testid="list-search"
            />
            <div className="list-tour-group">
                {filterList.map(el => (
                    <Script tour={el} onClick={onClickScript} key={el.id} />
                ))}
            </div>
        </div>
    );
};
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const clearValue = (str: string | null): string => str.toLocaleLowerCase().trim();
export default ScriptList;
