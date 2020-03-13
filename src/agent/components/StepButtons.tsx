import * as React from "react";
import { FC, memo } from "react";
// import "bootstrap/dist/css/bootstrap.css";
import { Button, ButtonToolbar } from "react-bootstrap";
import { ITEM_TYPES } from "ultimate-pagination";
import { disposeEvent } from "../util/utils";
import { ButtonViewerStyleInterface } from "./ViewerInterface";

export interface PageButtonsState {
    currentStep: number;
    totalSteps: number;
    paginationModel: any;
    setStep: (index?: number) => void;
    minPreviousOpen?: number;
    maxNextOpen?: number;
    buttonStyle?: ButtonViewerStyleInterface;
}
export interface PageNumberViewerInterface {
    padding?: string;
    color?: string;
    background?: string;
    border?: string;
    borderWidth?: string;
    borderColor?: string;
    marginTop?: string;
    marginBottom?: string;
}
const StepButtons: FC<PageButtonsState> = ({
    currentStep,
    totalSteps,
    paginationModel,
    setStep,
    minPreviousOpen = 0,
    maxNextOpen = totalSteps - 1,
    buttonStyle
}) => {
    const pageNumberStyle: PageNumberViewerInterface = {
        position: "absolute",
        right: "2px",
        color: "black",
        background: "rgb(217, 217, 217)"
    };
    return (
        <ButtonToolbar style={{ marginLeft: "0px" }}>
            <Button
                style={{
                    ...buttonStyle,
                    borderRadius: "5px 0 0 5px"
                }}
                className=" krista-bootstrap-wrapper "
                disabled={currentStep === minPreviousOpen}
                onClick={event => {
                    disposeEvent(event);
                    setStep(currentStep - 1);
                }}
            >
                Назад
            </Button>
            {paginationModel.map(page => {
                if (
                    page.type === ITEM_TYPES.PAGE &&
                    page.value >= minPreviousOpen + 1 &&
                    page.value <= maxNextOpen + 1
                    // +1 т.к. в PaginationModel нумерация шагов с 1, а в AgentHandler с 0
                ) {
                    return (
                        <Button
                            style={{
                                ...buttonStyle,
                                borderRadius: "0"
                            }}
                            className=" krista-bootstrap-wrapper "
                            disabled={page.value === currentStep + 1}
                            onClick={event => {
                                disposeEvent(event);
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
                style={{
                    ...buttonStyle,
                    borderRadius: "0 5px 5px 0"
                }}
                disabled={currentStep === maxNextOpen}
                onClick={event => {
                    disposeEvent(event);
                    setStep(currentStep + 1);
                }}
            >
                Вперед
            </Button>
            <div
                style={{
                    ...pageNumberStyle,
                    display: "inline-block",
                    bottom: "0px"
                }}
                className="krista-bootstrap-wrapper "
            >
                {currentStep + 1} из {totalSteps + 1}
            </div>
        </ButtonToolbar>
    );
};

export default memo(StepButtons);
