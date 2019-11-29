import DescriptionComponent from "../../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

export interface StepType {
    blackout: Function[];
    description: Function[];
    condition: Function[];
}
export interface ParamType {
    top: number;
    left: number;
    width: number;
    height: number;
}
export default class TourHelper {
    /**
     * для записи тура
     */
    static stepCount: number = 0;
    static steps: StepType[] = [
        {
            blackout: [],
            description: [],
            condition: []
        }
    ];
    /**
     * для воспроизведения тура
     */
    static currentStep: number = 0;
    static targetElement: Element | null = null;
    static conditionElement: Element | null = null;
    static rectElement = [];
    static rectElementParam: ParamType[] = [];
    static popperElement = [];
    public static startTour = () => {
        disablePageScroll();
        TourHelper.startStep();
    };
    public static endTour = () => {
        enablePageScroll();
        window.removeEventListener("click", TourHelper.clickHandler);
        window.removeEventListener("click", TourHelper.clickOnHandler);
        TourHelper.clearAllElement();
        TourHelper.targetElement = null;
        TourHelper.conditionElement = null;
        TourHelper.currentStep = 0;
        TourHelper.stepCount = 0;
        TourHelper.steps = [
            {
                blackout: [],
                description: [],
                condition: []
            }
        ];
        console.log("end tour");
    };
    public static blackout = (element: string) => {
        //console.log("blackout", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].blackout.push(() => {
            TourHelper.setTargetElement(element);
            const el = TourHelper.targetElement;
            if (!el) {
                return;
            }
            //console.log("blackout ", el);
            TourHelper.drawFourRect();
            window.addEventListener("resize", TourHelper.drawFourRect);
        });
        // console.log(TourHelper.steps)
    };
    public static description = (element: string, desc: string) => {
        //console.log("description", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].description.push(() => {
            TourHelper.setTargetElement(element);
            const el = TourHelper.targetElement;
            if (!el) {
                return;
            }
            //console.log("description ", el, desc);
            const descrNode = window.document.createElement("div");
            descrNode.id = "container";
            descrNode.setAttribute("data-testid", "popper" + TourHelper.popperElement.length);
            window.document.body.appendChild(descrNode);
            ReactDOM.render(<DescriptionComponent selector={el} text={desc} />, document.getElementById("container"));
            TourHelper.popperElement.push(descrNode);
        });
    };
    public static blocklyStep = (condition: Function) => {
        /*if (condition === Function) condition();
        else console.log(`ERROR condition type. It must be function "click" or "clickOn"`);*/
        condition();
       // console.log("STEP", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.stepCount += 1;
        // console.log("blocklyStep");
        if (!TourHelper.steps[TourHelper.stepCount]) {
            TourHelper.steps[TourHelper.stepCount] = {
                blackout: [],
                description: [],
                condition: []
            };
        }
    };
    public static click = () => {
        TourHelper.steps[TourHelper.stepCount].condition.push(() => {
            window.addEventListener("click", TourHelper.clickHandler);
        });
    };
    public static clickOn = (element: string) => {
        TourHelper.steps[TourHelper.stepCount].condition.push(() => {
            TourHelper.setConditionElement(element);
            window.addEventListener("click", TourHelper.clickOnHandler);
        });
    };

    private static startStep = () => {
        //console.log("startStep >> ", TourHelper.currentStep, TourHelper.steps[TourHelper.currentStep]);
        TourHelper.steps[TourHelper.currentStep].blackout.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].description.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].condition.forEach(fn => fn());
    };
    private static step = () => {
        TourHelper.clearAllElement();
        TourHelper.targetElement = null;
        TourHelper.conditionElement = null;
        if (TourHelper.currentStep == TourHelper.steps.length) return;
        //console.log("step");
        TourHelper.currentStep += 1;
        TourHelper.startStep();
    };
    private static clickHandler = () => {
        window.removeEventListener("click", TourHelper.clickHandler);
        TourHelper.step();
    };
    private static clickOnHandler = (e: { target: any }) => {
        const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
        const element = TourHelper.conditionElement;
        //console.log("Ожидался клик по ", element);
        // console.log("Произошел клик по ", target);
        // if (str.startsWith(element)) {
        if (element === target) {
            //console.log("все правильно");
            window.removeEventListener("click", TourHelper.clickOnHandler);
            TourHelper.step();
            TourHelper.conditionElement = null;
        }
    };
    private static drawFourRect = () => {
        TourHelper.clearRectElement();
        const el = TourHelper.targetElement;
        if (!el) {
            return;
        }
        const bounds = el.getBoundingClientRect() as DOMRect;
        //console.log("el.getBoundingClientRect() >> ", bounds);
        const x: number = bounds.x + (window.pageXOffset || document.documentElement.scrollLeft);
        const y: number = bounds.y + (window.pageYOffset || document.documentElement.scrollTop);
        const height: number = bounds.height;
        const width: number = bounds.width;
        const windowWidth: number = Math.max(
            document.body.scrollWidth,
            document.body.clientWidth,
            document.defaultView.innerWidth
        );
        const windowHeight: number = Math.max(
            document.body.scrollHeight,
            document.body.clientHeight,
            document.defaultView.innerHeight
        );
        TourHelper.newRect(0, 0, x, windowHeight);
        TourHelper.newRect(0, x + width, windowWidth - width - x, windowHeight);
        TourHelper.newRect(0, x, width, y);
        TourHelper.newRect(y + height, x, width, windowHeight - height - y);
    };
    private static newRect = (rTop: number, rLeft: number, rWidth: number, rHeight: number) => {
        TourHelper.rectElementParam[TourHelper.rectElement.length] = {
            top: rTop,
            left: rLeft,
            width: rWidth,
            height: rHeight
        };
        const rectStyle: CSSStyleDeclaration = {
            position: "absolute",
            zIndex: "11000000",
            top: `${rTop}px`,
            left: `${rLeft}px`,
            width: `${rWidth}px`,
            height: `${rHeight}px`,
            bottom: "0",
            background: "rgba(0, 0, 0, 0.3)",
            border: "none"
        };
        const rect = window.document.createElement("div");
        Object.keys(rectStyle).forEach(key => {
            rect.style[key] = rectStyle[key];
        });
        rect.setAttribute("data-testid", "blackoutRect" + TourHelper.rectElement.length);
        window.document.body.appendChild(rect);
        TourHelper.rectElement.push(rect);
        //console.log(parametrsNewRect, " => ", rect.getBoundingClientRect());
    };
    private static clearRectElement = () => {
        TourHelper.rectElement.map(el => el.remove());
        TourHelper.rectElement = [];
        TourHelper.rectElementParam = [];
    };
    private static clearPopperElement = () => {
        TourHelper.popperElement.map(el => el.remove());
        TourHelper.popperElement = [];
    };
    private static clearAllElement = () => {
        window.removeEventListener("resize", TourHelper.drawFourRect);
        TourHelper.clearRectElement();
        TourHelper.clearPopperElement();
    };
    private static setTargetElement = (element: string) => {
        const el = document.querySelector(element);
        if (!el) console.log("ERROR: selector not found");
        TourHelper.targetElement = el;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        //console.log("show on the this element >> ", el);
    };
    private static setConditionElement = (element: string) => {
        const el = document.querySelector(element);
        if (!el) console.log("ERROR: selector condition element not found");
        TourHelper.conditionElement = el;
    };
}

(window as any).TourHelper = TourHelper;
