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
        <div style={{ display: "flex", position: "fixed", top: 100, left: 0, zIndex: 11000001, color: "white" }}>
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
        </div>
    );
};

export default memo(ViewerInterface);
