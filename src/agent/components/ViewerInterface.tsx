import { FC, memo } from "react";
import * as React from "react";
import ultimatePagination, { ITEM_TYPES } from "ultimate-pagination";
import { Button, ButtonToolbar } from "react-bootstrap";
import PageButtons from "./StepButtons";
import { disposeEvent } from "../util/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
    onCancel: () => void;
}
export interface ButtonViewerInterface {
    padding?: string;
    color?: string;
    backgroundColor?: string;
    border?: string;
    borderWidth?: string;
    borderColor?: string;
    marginLeft?: string;
    marginTop?: string;
    marginBottom?: string;
    borderRadius?: string;
}

const ViewerInterface: FC<ViewerInterfaceState> = ({
    setStep,
    currentStep,
    totalSteps,
    name,
    desc,
    onStart,
    onCancel,
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
    let textButtonColor = "#dbdcdc";
    let buttonColor = "rgba(248,248,248,0)";
    const buttonStyle: ButtonViewerInterface = {
        padding: "4px 8px",
        //color: textButtonColor,
        // backgroundColor: buttonColor,
        // border: "solid",
        borderRadius: "5px",
        // borderWidth: "2px",
        marginLeft: "0",
        borderColor: buttonColor,
        //marginTop: "5px",
        marginBottom: "0"
    };

    console.log(paginationModel);
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                zIndex: 11000001,
                padding: "3px",
                background: "rgba(0, 0, 0, 0.6)"
                //minWidth: "80px"
            }}
            className=" krista-bootstrap-wrapper "
        >
            <Button
                style={{
                    position: "absolute",
                    right: "0px",
                    height: "20px",
                    width: "20px",
                    background: "rgba(219,220,220,0)",
                    border: "none"
                }}
            >
                <FontAwesomeIcon
                    onClick={onCancel}
                    className="i-close"
                    size="2x"
                    color="#ff4747"
                    style={{
                        position: "absolute",
                        right: "10%",
                        top: "10%",
                        maxHeight: "80%",
                        maxWidth: "80%"
                    }}
                    icon={faTimes}
                />
            </Button>
            <div style={{ color: "rgb(142,197,255)", fontWeight: "bold" }}>{name}</div>
            <div style={{ color: "rgb(255,255,255)" }}>{desc}</div>
            {(start && (
                <PageButtons
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    paginationModel={paginationModel}
                    setStep={setStep}
                    minPreviousOpen={minPreviousOpen}
                    maxNextOpen={maxNextOpen}
                    buttonStyle={buttonStyle}
                />
            )) || (
                <Button
                    style={buttonStyle}
                    className=" krista-bootstrap-wrapper "
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
