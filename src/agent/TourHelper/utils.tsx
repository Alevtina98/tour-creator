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
export interface BlackElementType {
    element: Element | null;
    coordinates: ElementParamType;
}
export interface ElementParamType {
    top: number;
    left: number;
    width: number;
    height: number;
}
export interface HighlightAreaType {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
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
    static blackElement: BlackElementType[] = [];
    static descrElement: DescrElementType[] = [];
    static conditionElement: Element | null = null;
    static rectElement: Element[] = [];
    static rectElementParam: ElementParamType[] = [];
    static popperElement: Element[] = [];
    static windowWidth: number = 0;
    static windowHeight: number = 0;

    public static startTour = () => {
        console.log("startTour");
        TourHelper.startStep();
    };
    public static endTour = () => {
        enablePageScroll();
        window.removeEventListener("click", TourHelper.clickHandler);
        window.removeEventListener("click", TourHelper.clickOnHandler);
        TourHelper.initState();
        console.log("end tour");
    };
    public static blackout = (element: string) => {
        TourHelper.steps[TourHelper.stepCount].blackout.push(() => {
            TourHelper.setBlackElement(element);
            const el = TourHelper.blackElement[TourHelper.blackElement.length - 1].element;
            if (!el) {
                return;
            }
        });
    };
    public static description = (element: string, desc: string) => {
        TourHelper.steps[TourHelper.stepCount].description.push(() => {
            TourHelper.setDescrElement(element, desc);
            const el = TourHelper.descrElement[TourHelper.descrElement.length - 1].element;
            if (!el) {
                return;
            }
        });
    };
    public static blocklyStep = (condition: Function) => {
        condition();
        TourHelper.stepCount += 1;
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
        TourHelper.steps[TourHelper.currentStep].blackout.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].description.forEach(fn => fn());
        TourHelper.showElements();
        TourHelper.steps[TourHelper.currentStep].condition.forEach(fn => fn());
    };
    private static showElements = () => {
        TourHelper.blackElement[0]?.element?.scrollIntoView({ block: "center", behavior: "smooth" });
        TourHelper.descrElement[0]?.element?.scrollIntoView({ block: "center", behavior: "smooth" });
        TourHelper.blackoutWindow();
        TourHelper.descrElement.forEach(el => TourHelper.describeElement(el));
        window.addEventListener("resize", TourHelper.blackoutWindow);
        console.log("descrElement", TourHelper.descrElement);
    };
    private static blackoutWindow = () => {
        TourHelper.clearRectElement();
        TourHelper.setParamWindow();
        TourHelper.blackElement.forEach(el => el.coordinates = TourHelper.getCoordinateElement(el.element));
        const area: HighlightAreaType = TourHelper.getArea();
        TourHelper.addRectsIn(area);
        TourHelper.addRectAround(area);
        TourHelper.rectElementParam.forEach(el => TourHelper.newRect(el.top, el.left, el.width, el.height));
    };
    private static getArea = () => {
        const area: HighlightAreaType = {
            minX: TourHelper.windowHeight,
            minY: TourHelper.windowWidth,
            maxX: 0,
            maxY: 0
        };
        TourHelper.blackElement.forEach(el => {
            const minXElement: number = el.coordinates?.top,
                minYElement: number = el.coordinates?.left,
                maxXElement: number = minXElement + el.coordinates?.height,
                maxYElement: number = minYElement + el.coordinates?.width;
            if (minXElement < area.minX) {
                area.minX = minXElement;
            }
            if (maxXElement > area.maxX) {
                area.maxX = maxXElement;
            }
            if (minYElement < area.minY) {
                area.minY = minYElement;
            }
            if (maxYElement > area.maxY) {
                area.maxY = maxYElement;
            }
        });
        return area;
    }
    private static addRectsIn = (area: HighlightAreaType) => {
        const minX: number = area.minX;
        const maxX: number = area.maxX;
        const minY: number = area.minY;
        const maxY: number = area.maxY;
        const w: boolean[][] = Array(maxX + 1).fill(null);
        for (let i = minX; i < w.length; i++) {
            w[i] = Array(maxY).fill(true);
        }
        TourHelper.blackElement.forEach(el => {
            const minXElement: number = el.coordinates?.top,
                minYElement: number = el.coordinates?.left,
                maxXElement: number = minXElement + el.coordinates?.height,
                maxYElement: number = minYElement + el.coordinates?.width;
            for (let i = minXElement; i < maxXElement; i++) {
                for (let j = minYElement; j < maxYElement; j++) {
                    w[i][j] = false;
                }
            }
        });
        let goDown = true,
            goRight = true;
        let widthRect = 0,
            heightRect = 0;
        for (let x = minX; x < maxX; x++) {
            for (let y = minY; y < maxY; y++) {
                if (w[x][y]) {
                    heightRect = 0;
                    widthRect = maxY;
                    goDown = true;
                    for (let i = x; i < maxX && goDown; i++) {
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
    }
    private static addRectAround = (area: HighlightAreaType) => {
        const left: number = area.minY;
        const top: number = area.minX;
        const height: number = area.maxX - area.minX;
        const width: number = area.maxY - area.minY;
        TourHelper.rectElementParam.push({
            top: 0,
            left: 0,
            width: left,
            height: TourHelper.windowHeight
        });
        TourHelper.rectElementParam.push({
            top: 0,
            left: left + width,
            width: TourHelper.windowWidth - width - left,
            height: TourHelper.windowHeight
        });
        TourHelper.rectElementParam.push({
            top: 0,
            left: left,
            width: width,
            height: top
        });
        TourHelper.rectElementParam.push({
            top: top + height,
            left: left,
            width: width,
            height: TourHelper.windowHeight - height - top
        });
        /*TourHelper.newRect(0, 0, left, TourHelper.windowHeight);
        TourHelper.newRect(0, left + width, TourHelper.windowWidth - width - left, TourHelper.windowHeight);
        TourHelper.newRect(0, left, width, top);
        TourHelper.newRect(top + height, left, width, TourHelper.windowHeight - height - top);*/
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
    private static step = () => {
        TourHelper.blackElement = [];
        TourHelper.descrElement = [];
        TourHelper.conditionElement = null;
        if (TourHelper.currentStep == TourHelper.steps.length) return;
        TourHelper.currentStep += 1;
        TourHelper.clearCreatedElement();
        TourHelper.startStep();
    };
    private static clickHandler = () => {
        window.removeEventListener("click", TourHelper.clickHandler);
        TourHelper.step();
    };
    private static clickOnHandler = (e: { target: any }) => {
        const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
        const element = TourHelper.conditionElement;
        if (element === target) {
            window.removeEventListener("click", TourHelper.clickOnHandler);
            TourHelper.step();
            TourHelper.conditionElement = null;
        }
    };
    private static clearRectElement = () => {
        TourHelper.rectElement.map(el => el.remove());
        TourHelper.rectElement = [];
        TourHelper.rectElementParam = [];
    };
    private static clearPopperElement = () => {
        TourHelper.popperElement.map(el => el.parentNode!.removeChild(el));
        TourHelper.popperElement = [];
    };
    private static clearCreatedElement = () => {
        window.removeEventListener("resize", TourHelper.blackoutWindow);
        TourHelper.clearRectElement();
        TourHelper.clearPopperElement();
    };
    private static setBlackElement = (element: string) => {
        const el = document.querySelector(element);
        if (!el) {
            console.log("ERROR: selector not found", TourHelper.blackElement);
            const error: string =
                "blackouting selector " + element + " is not found on step " + TourHelper.currentStep + 1;
            sendMessage("newError", error);
            return;
        }
        const blackEl: BlackElementType = {
            element: el,
            coordinates: TourHelper.getCoordinateElement(el)
        };
        TourHelper.blackElement.push(blackEl);
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
    private static setParamWindow = () => {
        TourHelper.windowWidth = Math.max(
            document.body.scrollWidth,
            document.body.clientWidth,
            document.defaultView!.innerWidth
        );
        TourHelper.windowHeight = Math.max(
            document.body.scrollHeight,
            document.body.clientHeight,
            document.defaultView!.innerHeight
        );
    };
    private static getCoordinateElement = (element: Element) => {
        const el = element;
        const bounds = el.getBoundingClientRect();
        const coordinates: ElementParamType = {
            left: parseInt(String(bounds.x + (window.pageXOffset || document.documentElement.scrollLeft)), 10),
            top: parseInt(String(bounds.y + (window.pageYOffset || document.documentElement.scrollTop)), 10),
            height: parseInt(String(bounds.height), 10),
            width: parseInt(String(bounds.width), 10)
        };
        return coordinates;
    };
    private static initState = () => {
        TourHelper.clearCreatedElement();
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
        TourHelper.windowWidth = 0;
        TourHelper.windowHeight = 0;
    }
}

(window as any).TourHelper = TourHelper;
