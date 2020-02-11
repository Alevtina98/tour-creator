import React, { ComponentType, FC, useEffect,useState } from "react";
import Script from "../Script/Script";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import { loadListTour } from "../../../actions/selectedTourAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import { TourType } from "../../../util/restClient/requestTour";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useMeasure } from "react-use";

export interface MenuProps {
    onClickEsc: any;
    isOpen: boolean;
}
const ScriptList: FC<MenuProps> = ({ onClickEsc, isOpen }) => {
    const dispatch = useDispatch();
    const listTour = useSelector<StoreType, TourType[]>(({ SelectedTourState }) => SelectedTourState.listTour);
    const [filterList, setFilterList] = useState<TourType[]>([]);
    const [filterTour, setFilterTour] = useState<string>("");
    useEffect(() => {
        setFilterList(listTour);
    }, [listTour]);
    useEffect(() => {
        dispatch(loadListTour());
    }, [dispatch]);
    const searchUpdated = (event: React.ChangeEvent<any>) => {
        setFilterTour(event.target.value);
        setFilterList(listTour.filter(myFilter(event.target.value)));
    };
    const myFilter = (searchTour: string) => ({ name, desc }: TourType): boolean => {
        return (
            clearValue(name || "").includes(clearValue(searchTour)) ||
            clearValue(desc || "").includes(clearValue(searchTour))
        );
    };
    const Row: ComponentType<ListChildComponentProps> = ({ index, style }) => (
        <Script tour={filterList[index]} key={index} style={style} />
    );
    const [ref, { width, height }] = useMeasure();

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
                value={filterTour}
                onChange={searchUpdated}
                data-testid="list-search"
            />
            <div className="list-tour-group" ref={ref}>
                <List
                    height={height}
                    itemKey={index => filterList[index].id}
                    itemCount={filterList.length}
                    itemSize={80}
                    width={width}
                >
                    {Row}
                </List>
            </div>
        </div>
    );
};
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const clearValue = (str: string | null): string => str.toLocaleLowerCase().trim();
export default ScriptList;
