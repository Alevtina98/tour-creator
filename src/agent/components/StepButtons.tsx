import * as React from "react";
import { FC, memo } from "react";
// import "bootstrap/dist/css/bootstrap.css";
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
}

const StepButtons: FC<PageButtonsState> = ({
    currentStep,
    totalSteps,
    paginationModel,
    setStep,
    minPreviousOpen = 0,
    maxNextOpen = totalSteps - 1
}) => {
    return (
        <ButtonToolbar>
            <Button
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
                disabled={currentStep === maxNextOpen}
                onClick={event => {
                    disposeEvent(event);
                    setStep(currentStep + 1);
                }}
            >
                Вперед
            </Button>
            <div className="krista-bootstrap-wrapper " style={{ position: "absolute", right: "5px", bottom: "3px" }}>
                {currentStep + 1} из {totalSteps + 1}
            </div>
        </ButtonToolbar>
    );
};

export default memo(StepButtons);
