import { FC, memo } from "react";
import * as React from "react";
import ultimatePagination, { ITEM_TYPES } from "ultimate-pagination";
import { Button } from "react-bootstrap";

export interface ViewerInterfaceState {
    setStep: (index: number) => void;
    currentStep: number;
    totalSteps: number;
}

const ViewerInterface: FC<ViewerInterfaceState> = ({ setStep, currentStep, totalSteps }) => {
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
        <div style={{ display: "flex", position: "fixed", bottom: 20, left: 0, zIndex: 11000001, color: "white" }}>
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
        </div>
    );
};

export default memo(ViewerInterface);
