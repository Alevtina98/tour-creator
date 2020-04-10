import * as React from "react";
import { FC, memo } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import { ITEM_TYPES } from "ultimate-pagination";
import { disposeEvent } from "../util/utils";

export interface PageButtonsState {
    currentStep: number;
    totalSteps: number;
    paginationModel: any;
    setStep: (index?: number) => void;
    minPreviousOpen?: number;
    maxNextOpen?: number;
    buttonStyle?: React.CSSProperties;
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
    const pageNumberStyle: React.CSSProperties = {
        position: "absolute",
        textAlign: "center",
        color: "black",
        background: "rgb(217, 217, 217)",
        display: "inline-block",
        padding: "0px 5px",
        height: "28px",
        lineHeight: "28px",
        right: "3px",
        marginTop: "5px"
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
                onClick={(event: any) => {
                    disposeEvent(event);
                    setStep(currentStep - 1);
                }}
            >
                Назад
            </Button>
            {paginationModel.map((page: { type: string; value: {} | null | undefined }) => {
                if (
                    page.value &&
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
                            onClick={(event: any) => {
                                disposeEvent(event);
                                setStep(page.value as number);
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
                    borderRadius: "0 5px 5px 0",
                    marginRight: "100px"
                }}
                disabled={currentStep === maxNextOpen}
                onClick={(event: any) => {
                    disposeEvent(event);
                    setStep(currentStep + 1);
                }}
            >
                Вперед
            </Button>
            <div style={pageNumberStyle} className="krista-bootstrap-wrapper ">
                {currentStep + 1} из {totalSteps}
            </div>
        </ButtonToolbar>
    );
};

export default memo(StepButtons);
