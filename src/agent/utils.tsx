import DescriptionComponent from "../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

export interface StepType {
    blackout: Function[];
    description: Function[];
}

export default class TourHelper {
    static steps: StepType[] = [
        {
            blackout: [],
            description: []
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

    static rectElement = [];
    static popperElement = [];
    static targetElement: Element | null = null;

    public static blocklyStep = () => {
        TourHelper.stepCount += 1;
        console.log("blocklyStep");
        if (!TourHelper.steps[TourHelper.stepCount]) {
            TourHelper.steps[TourHelper.stepCount] = {
                blackout: [],
                description: []
            };
        }
    };

    public static step = () => {
        console.log("step");
        TourHelper.clearAllElement();
        TourHelper.currentStep += 1;
        TourHelper.startTour();
    };

    public static startTour = () => {
        window.addEventListener("click", TourHelper.step);
        console.log("startTour >> ", TourHelper.currentStep, TourHelper.steps[TourHelper.currentStep]);
        TourHelper.steps[TourHelper.currentStep].blackout.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].description.forEach(fn => fn());
    };

    public static blackout = (element: string) => {
        console.log("blackout", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].blackout.push(() => {
            console.log("blackout");

            TourHelper.setTargetElement(element);
            const el = TourHelper.targetElement;
            if (!el) {
                return;
            }
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            //console.log("blackout FN", el);
            TourHelper.drawFourRect();
            disablePageScroll();
            window.addEventListener("resize", TourHelper.drawFourRect);
        });
    };
    public static description = (element: string, desc: string) => {
        console.log("description", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].description.push(() => {
            console.log("description");

            TourHelper.setTargetElement(element);
            const el = TourHelper.targetElement;
            if (!el) {
                return;
            }
            //console.log("description FN >> ", el, " desc >> ", desc);
            const descrNode = window.document.createElement("div");
            descrNode.id = "container";
            window.document.body.appendChild(descrNode);
            ReactDOM.render(<DescriptionComponent selector={el} text={desc} />, document.getElementById("container"));
            TourHelper.popperElement.push(descrNode);
        });
    };


    public static clearAllElement = () => {
        window.removeEventListener("resize", TourHelper.drawFourRect);
        window.removeEventListener("click", TourHelper.step);
        TourHelper.clearRectElement();
        TourHelper.clearPopperElement();
        enablePageScroll();
    };

    private static setTargetElement = (element: string) => {
        //console.log("selector >> ", element);
        const el = document.querySelector(element);
        if (!el) console.log("ERROR: selector not found");
        TourHelper.targetElement = el;
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
            background: "rgba(0, 0, 0, 0.2)",
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
}

(window as any).TourHelper = TourHelper;
