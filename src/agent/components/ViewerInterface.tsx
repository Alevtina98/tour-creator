import { FC, memo } from "react";
import * as React from "react";
import ultimatePagination, { ITEM_TYPES } from "ultimate-pagination";
import { Button, ButtonToolbar } from "react-bootstrap";
import PageButtons from "./StepButtons";
import {disposeEvent} from "../util/utils";

// import "bootstrap/dist/css/bootstrap.css";

export interface ViewerInterfaceState {
    setStep: (index: number) => void;
    currentStep: number;
    totalSteps: number;
    name: string;
    desc: string;
    onStart: () => void;
    start: boolean;
    minPreviousOpen?: number; //disable next step-buttons
    maxNextOpen?: number; //disable pred step-buttons
}

const ViewerInterface: FC<ViewerInterfaceState> = ({
    setStep,
    currentStep,
    totalSteps,
    name,
    desc,
    onStart,
    start,
    minPreviousOpen = 0,
    maxNextOpen = totalSteps - 1
}) => {
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
                right: 0,
                zIndex: 11000001,
                padding: 3,
                background: "rgba(0, 0, 0, 0.6)"
            }}
        >
            <div style={{ color: "rgb(142,197,255)" }}>{name}</div>
            <div style={{ color: "rgb(255,255,255)" }}>{desc}</div>
            {(start && (
                <PageButtons
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    paginationModel={paginationModel}
                    setStep={setStep}
                    minPreviousOpen={minPreviousOpen}
                    maxNextOpen={maxNextOpen}
                />
            )) || (
                <Button
                    onClick={event => {
                        disposeEvent(event);
                        onStart();
                        console.log("start >>", start);
                        /*currentStep > 0 ? setStep(0) : null;*/
                    }}
                >
                    Старт
                </Button>
            )}
        </div>
    );
};

export default memo(ViewerInterface);
