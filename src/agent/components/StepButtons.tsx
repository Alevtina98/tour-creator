import { FC, memo } from "react";
import * as React from "react";

// import "bootstrap/dist/css/bootstrap.css";
import { Button, ButtonToolbar } from "react-bootstrap";
import { ITEM_TYPES, PaginationModelOptions } from "ultimate-pagination";

export interface PageButtonsState {
    currentStep: number;
    totalSteps: number;
    paginationModel: any;
    setStep: (index: number) => void;
}

const StepButtons: FC<PageButtonsState> = ({ currentStep, totalSteps, paginationModel, setStep }) => {
    return (
        <ButtonToolbar>
            <Button
                disabled={currentStep === 0}
                onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    currentStep > totalSteps - 1 ? setStep(totalSteps - 1) : null;
                }}
            >
                Начало
            </Button>
            <Button
                disabled={currentStep === 0}
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
                    disabled={currentStep === totalSteps - 1}
                    onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        currentStep < totalSteps - 1 ? setStep(currentStep + 1) : null;
                    }}
                >
                    Вперед
                </Button>

            <Button
                disabled={currentStep === totalSteps - 1}
                onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    currentStep < totalSteps - 1 ? setStep(totalSteps - 1) : null;
                }}
            >
                Конец
            </Button>
        </ButtonToolbar>
    );
};

export default memo(StepButtons);
