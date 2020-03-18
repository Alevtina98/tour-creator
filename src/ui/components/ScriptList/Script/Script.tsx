import React, { FC, memo } from "react";
import { loadToDb } from "../../../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import cn from "classnames";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDateClientFormat, TourType } from "../../../util/restClient/requestTour";
import { setModal } from "../../../actions/modalAction";
import { burgerClose } from "../../../actions/mainAction";
import { disposeEvent } from "../../../../agent/util/utils";

export interface ScriptProps {
    tour: TourType;
    style: React.CSSProperties;
}

const Script: FC<ScriptProps> = ({ tour, style }) => {
    const dispatch = useDispatch();
    const selectedTourKey = useSelector<StoreType, number>(({ SelectedTourState }) => SelectedTourState.tourDB.id);
    //загрузка
    const loadTour = () => {
        if (selectedTourKey != tour.id) {
            dispatch(loadToDb(tour.id));
            dispatch(burgerClose());
        }
    };
    const putSavedTour = (e: any) => {
        disposeEvent(e);
        dispatch(setModal({ tour: tour, status: "edit" }));
    };
    const putDeletedTourId = (e: any) => {
        disposeEvent(e);
        dispatch(setModal({ tour: tour, status: "delete" }));
    };
    return (
        <div style={style}>
            <OverlayTrigger
                key="bottom"
                placement="bottom"
                overlay={(tour.desc && <Popover className="tooltip">{tour.desc}</Popover>) || <div />}
            >
                <div
                    className={cn("tour", {
                        "tour--active": selectedTourKey === tour.id
                    })}
                    onClick={loadTour}
                >
                    <div className="tour-name" data-testid="tour-name">
                        <small>{tour.name}</small>
                    </div>
                    <div className="tour-time" data-testid="tour-time">
                        <small>{getDateClientFormat(tour.dateChange)}</small>
                    </div>
                    <div />
                    <ButtonToolbar className="tour-buttons">
                        <ButtonGroup>
                            <Button variant="light" size="sm" onClick={putSavedTour} data-testid="edit-button">
                                <FontAwesomeIcon icon={faEdit} className="i-close" color="#A1A2A2" />
                            </Button>
                            <Button variant="light" size="sm" onClick={putDeletedTourId} data-testid="del-button">
                                <FontAwesomeIcon icon={faTrashAlt} className="i-close" color="#A1A2A2" />
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </OverlayTrigger>
        </div>
    );
};

export default memo(Script, () => true);
