import { FC, memo } from "react";
import * as React from "react";
import ultimatePagination, { ITEM_TYPES } from "ultimate-pagination";
import { Button, ButtonToolbar } from "react-bootstrap";

// import "bootstrap/dist/css/bootstrap.css";

export interface ViewerInterfaceState {
    setStep: (index: number) => void;
    currentStep: number;
    totalSteps: number;
    name: string;
    desc: string;
}

const ViewerInterface: FC<ViewerInterfaceState> = ({ setStep, currentStep, totalSteps, name, desc }) => {
    const paginationModel = ultimatePagination.getPaginationModel({
        // Required
        currentPage: currentStep + 1,
        totalPages: totalSteps,

        // Optional
        boundaryPagesRange: 1,
        siblingPagesRange: 1,
        hideEllipsis: false,
        hidePreviousAndNextPageLinks: false,
        hideFirstAndLastPageLinks: false
    });
    console.log(paginationModel);
    return (
        <div
            className="krista-bootstrap-wrapper "
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 11000001,
                padding: 3,
                background: "rgba(0, 0, 0, 0.5)"
            }}
        >
            <div style={{ color: "rgb(142,197,255)" }}>{name}</div>
            <div style={{ color: "rgb(255,255,255)" }}>{desc}</div>

            <ButtonToolbar>
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        currentStep > 0 ? setStep(0) : null;
                    }}
                >
                    Начало
                </Button>
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        currentStep > 0 ? setStep(currentStep - 1) : null;
                    }}
                >
                    Назад
                </Button>
                {paginationModel.map(page => {
                    if (page.type === ITEM_TYPES.PAGE) {
                        return (
                            <Button
                                onClick={event => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    setStep(page.value - 1);
                                }}
                            >
                                {page.value}
                            </Button>
                        );
                    }
                    return null;
                })}
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        currentStep < totalSteps - 1 ? setStep(currentStep + 1) : null;
                    }}
                >
                    Вперед
                </Button>
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        currentStep < totalSteps - 1 ? setStep(totalSteps - 1) : null;
                    }}
                >
                    Конец
                </Button>
            </ButtonToolbar>
        </div>
    );
};

export default memo(ViewerInterface);
