import DescriptionComponent from "../../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import { enablePageScroll } from "scroll-lock";
import sendMessage from "../util/sendMessage";

export interface StepType {
    blackout: Function[];
    description: Function[];
    condition: Function[];
}
export interface DescrElementType {
    element: Element | null;
    description: string;
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
    static blackElement: HTMLElement[] = [];
    static descrElement: DescrElementType[] = [];
    static conditionElement: Element | null = null;
    static rectElement: Element[] = [];
    static rectElementParam: ParamType[] = [];
    static popperElement: Element[] = [];

    public static startTour = () => {
        console.log("startTour");
        // disablePageScroll();
        TourHelper.startStep();
    };
    public static endTour = () => {
        enablePageScroll();
        window.removeEventListener("click", TourHelper.clickHandler);
        window.removeEventListener("click", TourHelper.clickOnHandler);
        TourHelper.clearAllElement();
        TourHelper.blackElement = [];
        TourHelper.descrElement = [];
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
            TourHelper.setblackElement(element);
            const el = TourHelper.blackElement[TourHelper.blackElement.length - 1];
            if (!el) {
                return;
            }
            //console.log("blackout ", el);
            //TourHelper.drawFourRect();
        });

        // console.log(TourHelper.steps)
    };
    public static description = (element: string, desc: string) => {
        //console.log("description", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.steps[TourHelper.stepCount].description.push(() => {
            TourHelper.setDescrElement(element, desc);
            const el = TourHelper.descrElement[TourHelper.descrElement.length - 1].element;
            if (!el) {
                return;
            }
            //console.log("description ", el, desc);
        });
    };
    public static blocklyStep = (condition: Function) => {
        /*if (condition === Function) condition();
        else console.log(`ERROR condition type. It must be function "click" or "clickOn"`);*/
        condition();
        // console.log("STEP", TourHelper.stepCount, TourHelper.steps[TourHelper.stepCount]);
        TourHelper.stepCount += 1;
        console.log("blocklyStep");
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
        TourHelper.clearAllElement()
        TourHelper.steps[TourHelper.currentStep].blackout.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].description.forEach(fn => fn());
        TourHelper.showElements();
        TourHelper.steps[TourHelper.currentStep].condition.forEach(fn => fn());
    };
    private static showElements = () => {
        if (TourHelper.blackElement[0])
            TourHelper.blackElement[0].scrollIntoView({ block: "center", behavior: "smooth" });
        if (TourHelper.descrElement[0].element)
            TourHelper.descrElement[0].element.scrollIntoView({ block: "center", behavior: "smooth" });
        // window.addEventListener("resize", TourHelper.drawFourRect);
        TourHelper.blackoutWindow();
        TourHelper.rectElementParam.forEach(el => TourHelper.newRect(el.top, el.left, el.width, el.height));
        TourHelper.descrElement.forEach(el => TourHelper.describeElement(el));
        console.log("descrElement", TourHelper.descrElement);

    };
    private static blackoutWindow = () => {
        const windowWidth: number = Math.max(
            document.body.scrollWidth,
            document.body.clientWidth,
            document.defaultView!.innerWidth
        );
        const windowHeight: number = Math.max(
            document.body.scrollHeight,
            document.body.clientHeight,
            document.defaultView!.innerHeight
        );
        const w: boolean[][] = Array(windowHeight + 1).fill(null);
        for (let i = 0; i < w.length; i++) {
            w[i] = Array(windowWidth).fill(true);
        }
        TourHelper.blackElement.forEach(el => {
            const bounds = el.getBoundingClientRect() as DOMRect;
            const leftElement: number = parseInt(
                bounds.x + (window.pageXOffset || document.documentElement.scrollLeft),
                10
            );
            const topElement: number = parseInt(
                bounds.y + (window.pageYOffset || document.documentElement.scrollTop),
                10
            );
            const height: number = bounds.height;
            const width: number = bounds.width;
            for (let i = topElement; i < topElement + height; i++) {
                for (let j = leftElement; j < leftElement + width; j++) {
                    w[i][j] = false;
                }
            }
        });
        let goDown = true,
            goRight = true;
        let widthRect = 0,
            heightRect = 0;

        for (let x = 0; x < windowHeight; x++) {
            for (let y = 0; y < windowWidth; y++) {
                if (w[x][y]) {
                    heightRect = 0;
                    widthRect = windowWidth;
                    goDown = true;
                    for (let i = x; i < windowHeight && goDown; i++) {
                        goDown = true;
                        goRight = true;
                        for (let j = y; j < y + widthRect && goRight; j++) {
                            if (w[i][j]) {
                                w[i][j] = false;
                                if (!w[i + 1][j]) goDown = false;
                            } else {
                                goRight = false;
                                widthRect = j - y;
                            }
                        }
                        heightRect++;
                    }
                    TourHelper.rectElementParam.push({
                        top: x,
                        left: y,
                        width: widthRect,
                        height: heightRect
                    });
                }
            }
        }

        //console.log("rectElementParam >> ", TourHelper.rectElementParam);
        /*const blackNode: Element = window.document.createElement("div");
        blackNode.id = "tourBlackout";
        window.document.body.appendChild(blackNode);
        TourHelper.drawFourRect(blackNode);*/
    };
    /*private static drawFourRect = (element: HTMLElement) => {
        TourHelper.clearRectElement();
        const el: HTMLElement = element;
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
    };*/
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
    private static describeElement = (el: DescrElementType) => {
        const descrNode: Element = window.document.createElement("div");
        const containerName: string = "container-" + TourHelper.popperElement.length;
        descrNode.id = containerName;
        descrNode.setAttribute("data-testid", "popper-" + TourHelper.popperElement.length);
        window.document.body.appendChild(descrNode);
        ReactDOM.render(
            <DescriptionComponent selector={el.element} text={el.description} />,
            document.getElementById(containerName)
        );
        TourHelper.popperElement.push(descrNode);
    };
    /*private static upZIndex = (el: HTMLElement) => {
        el.style.zIndex += "1000";
    };
    private static baseZIndex = (el: HTMLElement) => {
        const baseZI: string = el.style.zIndex;
        el.style.zIndex = baseZI.substring(0, baseZI.length - 4);
    };*/
    private static step = () => {
        TourHelper.clearAllElement();
        TourHelper.blackElement = [];
        TourHelper.tElementIndex = -1;
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

    private static clearRectElement = () => {
        TourHelper.rectElement.map(el => el.remove());
        //TourHelper.rectElement.map(el => console.log("rectElement >> ", el));
        TourHelper.rectElement = [];
        TourHelper.rectElementParam = [];
        //TourHelper.blackElement.forEach(el => TourHelper.baseZIndex(el));
        TourHelper.blackElement = [];
    };
    private static clearPopperElement = () => {
        TourHelper.popperElement.map(el => el.parentNode!.removeChild(el));
        //TourHelper.popperElement.map(el => console.log(el));
        TourHelper.popperElement = [];
    };
    private static clearAllElement = () => {
        window.removeEventListener("resize", TourHelper.drawFourRect);
        TourHelper.clearRectElement();
        TourHelper.clearPopperElement();
        TourHelper.blackElement = [];
        TourHelper.descrElement = [];
    };

    private static setblackElement = (element: string) => {
        const el = document.querySelector(element);
        if (!el) {
            console.log("ERROR: selector not found", TourHelper.blackElement);
            const error: string =
                "blackouting selector " + element + " is not found on step " + TourHelper.currentStep + 1;
            sendMessage("newError", error);
            return;
        }
        TourHelper.blackElement.push(el);
        //console.log("show on the this element >> ", el);
    };
    private static setDescrElement = (element: string, description: string) => {
        const el = document.querySelector(element);
        if (!el) {
            console.log("ERROR: selector not found");
            const error: string =
                "descriptoning selector " + element + " is not found on step " + TourHelper.currentStep + 1;
            sendMessage("newError", error);
            return;
        }
        TourHelper.descrElement.push({ element: el, description: description });
        //console.log("show on the this element >> ", el);
    };
    private static setConditionElement = (element: string) => {
        const el = document.querySelector(element);
        if (!el) {
            console.log("ERROR: selector condition element not found");
            const error: string =
                "selector " + element + " condition element is not found on step " + TourHelper.currentStep + 1;
            sendMessage("newError", error);
            return;
        }
        TourHelper.conditionElement = el;
    };
}

(window as any).TourHelper = TourHelper;
