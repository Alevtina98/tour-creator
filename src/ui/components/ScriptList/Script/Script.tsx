import React, { FC, memo } from "react";
import { loadTour } from "../../../actions/selectedTourAction";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Popover } from "react-bootstrap";
import { StoreType } from "../../../reducers";
import cn from "classnames";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setModal } from "../../../actions/modalAction";
import { burgerClose } from "../../../actions/mainAction";
import { disposeEvent } from "../../../../agent/util/utils";
import { getDateClientFormat, getInitData, TourType } from "../../../util/tour";

export interface ScriptProps {
    tour: TourType;
    style: React.CSSProperties;
}

const Script: FC<ScriptProps> = ({ tour, style }) => {
    const dispatch = useDispatch();
    const selectedTour = useSelector<StoreType, TourType>(({ SelectedTourState }) => SelectedTourState.selectedTour);
    const tourOpen = useSelector<StoreType, boolean>(({ SelectedTourState }) => SelectedTourState.tourOpen);
    const load = () => {
        if (selectedTour.id !== tour.id) {
            dispatch(burgerClose());
            if (tourOpen && !selectedTour.dateChange) {
                //открыт тур с несохраненными изменениями
                dispatch(setModal({ tour: tour, status: "save_before_load" }));
            } else {
                dispatch(loadTour(tour.id));
            }
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
                        "tour--active": selectedTour.id === tour.id
                    })}
                    onClick={load}
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
