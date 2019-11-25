import DescriptionComponent from "../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Selector from "./Selector";

export interface StepType {
    blackout: Function[];
    description: Function[];
    condition: Function[];
}

export default class TourHelper {
    static rectElement = [];
    static popperElement = [];
    static steps: StepType[] = [
        {
            blackout: [],
            description: [],
            condition: []
        }
    ];
    /**
     * инкремент шага из блокли
     */
    static stepCount: number = 0;
    /**
     * инкремент сделанного шага
     */
    static currentStep: number = 0;
    /**
     * элемент, демонстрирующийся на данном шаге
     */
    static targetElement: Element | null = null;
    /**
     * элемент, поосле клика на который будет совершен следующий шаг
     */
    static conditionElement = "";

    public static startTour = () => {
        disablePageScroll();
        TourHelper.startStep();
    };
    public static endTour = () => {
        TourHelper.currentStep = 0;
        TourHelper.stepCount = 0;
        TourHelper.clearAllElement();
        TourHelper.targetElement = null;
        TourHelper.conditionElement = "";
        TourHelper.steps = [
            {
                blackout: [],
                description: [],
                condition: []
            }
        ];
        enablePageScroll();
        TourHelper.clearAllElement();
        window.removeEventListener("click", TourHelper.clickHandler);
        window.removeEventListener("click", TourHelper.clickOnHandler);
        console.log("end tour");
    };
    //вызывается блоком из blockly
    public static blocklyStep = (condition: Function) => {
        /*if (condition === Function) condition();
        else console.log(`ERROR condition type. It must be function "click" or "clickOn"`);*/
        condition();
        console.log("STEP", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
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
    public static blackout = (element: string) => {
        //console.log("blackout", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].blackout.push(() => {
            TourHelper.setTargetElement(element);
            const el = TourHelper.targetElement;
            if (!el) {
                return;
            }
            console.log("blackout ", el);
            TourHelper.drawFourRect();
            window.addEventListener("resize", TourHelper.drawFourRect);
        });
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
            window.document.body.appendChild(descrNode);
            ReactDOM.render(<DescriptionComponent selector={el} text={desc} />, document.getElementById("container"));
            TourHelper.popperElement.push(descrNode);
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
        TourHelper.conditionElement = "";
        if (TourHelper.currentStep == TourHelper.steps.length) return;
        //console.log("step");
        TourHelper.currentStep += 1;
        TourHelper.startStep();
    };
    private static clickHandler = e => {
        window.removeEventListener("click", TourHelper.clickHandler);
        TourHelper.step();
    };
    private static clickOnHandler = e => {
        const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
        const element = TourHelper.conditionElement;
        //console.log("Ожидался клик по ", element);
       // console.log("Произошел клик по ", target);
       // if (str.startsWith(element)) {
        if (element === target) {
            //console.log("все правильно");
            window.removeEventListener("click", TourHelper.clickOnHandler);
            TourHelper.step();
            TourHelper.conditionElement = "";
        }
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
    private static drawFourRect = () => {
        TourHelper.clearRectElement();
        const el = TourHelper.targetElement;
        if (!el) {
            return;
        }
        const bounds = el.getBoundingClientRect() as DOMRect;
        const x: number = bounds.x + (window.pageXOffset || document.documentElement.scrollLeft);
        const y: number = bounds.y + (window.pageYOffset || document.documentElement.scrollTop);
        const height: number = bounds.height;
        const width: number = bounds.width;
        const windowWidth: number = document.body.scrollWidth;
        const windowHeight: number = document.body.scrollHeight;
        TourHelper.newRect(0, 0, x, windowHeight);
        TourHelper.newRect(0, x + width, windowWidth - width - x, windowHeight);
        TourHelper.newRect(0, x, width, y);
        TourHelper.newRect(y + height, x, width, windowHeight - height - y);
    };
    private static newRect = (rTop: number, rLeft: number, rWidth: number, rHeight: number) => {
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
        window.document.body.appendChild(rect);
        TourHelper.rectElement.push(rect);
    };
    private static clearRectElement = () => {
        TourHelper.rectElement.map(el => el.remove());
        TourHelper.rectElement = [];
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
}

(window as any).TourHelper = TourHelper;
