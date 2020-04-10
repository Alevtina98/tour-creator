import { FC, memo } from "react";
import * as React from "react";
import ultimatePagination from "ultimate-pagination";
import { Button } from "react-bootstrap";
import PageButtons from "./StepButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ControlButtons from "./ControlButtons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface ViewerInterfaceState {
    setStep: (index?: number) => void;
    currentStep: number;
    totalSteps: number;
    name: string;
    desc: string;
    onStart: () => void;
    minPreviousOpen?: number; //disable next step-buttons
    maxNextOpen?: number; //disable pred step-buttons
    onCancel: () => void;
    start: boolean;
}
const ViewerInterface: FC<ViewerInterfaceState> = ({
    setStep,
    currentStep,
    totalSteps,
    name,
    desc,
    onStart,
    onCancel,
    minPreviousOpen = 0,
    maxNextOpen = totalSteps - 1,
    start
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
    const style: React.CSSProperties = {
        position: "fixed",
        top: "0",
        right: "0",
        zIndex: 11000001,
        background: "rgba(0, 0, 0, 0.6)",
        padding: "3px 23px 3px 3px"
    };
    const buttonStyle: React.CSSProperties = {
        padding: "3px 10px",
        borderRadius: "5px",
        marginTop: "5px",
        marginLeft: "0",
        borderColor: "rgba(248,248,248,0)"
    };
    const cancelButtonStyle: React.CSSProperties = {
        position: "absolute",
        top: "0px",
        right: "0px",
        height: "20px",
        width: "20px",
        background: "rgba(219,220,220,0)",
        border: "none"
    };
    const iconCancelButtonStyle: React.CSSProperties = {
        position: "absolute",
        right: "10%",
        top: "10%",
        maxHeight: "80%",
        maxWidth: "80%"
    };
    const onPostpone = (date: string) => {
        alert("Просмотр тура перенесен на " + date);
        onCancel();
    };
    return (
        <div style={style} className=" krista-bootstrap-wrapper ">
            <div style={{ color: "rgb(142,197,255)", fontWeight: "bold", padding: "0 20px 0 0" }}>{name}</div>
            <Button style={cancelButtonStyle}>
                <FontAwesomeIcon
                    onClick={onCancel}
                    className="i-close"
                    size="2x"
                    color="#ff4747"
                    style={iconCancelButtonStyle}
                    icon={faTimes as IconProp}
                />
            </Button>
            <div style={{ color: "rgb(255,255,255)", fontSize: "10pt" }}>{desc}</div>
            {!start && <ControlButtons onStart={onStart} onPostpone={onPostpone} buttonStyle={buttonStyle} />}
            {start && (
                <PageButtons
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    paginationModel={paginationModel}
                    setStep={setStep}
                    minPreviousOpen={minPreviousOpen}
                    maxNextOpen={maxNextOpen}
                    buttonStyle={buttonStyle}
                />
            )}
        </div>
    );
};

export default memo(ViewerInterface);
