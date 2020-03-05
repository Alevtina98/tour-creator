import DescriptionComponent from "../../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import sendMessage from "../util/sendMessage";
import ViewerInterface from "../components/ViewerInterface";
import { disposeEvent } from "../util/utils";
import { once } from "events";
import { TourType } from "../../ui/util/restClient/requestTour";
import { saveTour } from "../../ui/actions/selectedTourAction";

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
    static nameTour: string = "";
    static descTour: string = "";
    static start: boolean = false;
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
    static conditionStepNumbers: number[] = [];
    /**
     * для воспроизведения тура
     */
    static currentStep: number = -1;
    static blackElement: BlackElementType[] = [];
    static descrElement: DescrElementType[] = [];
    static conditionElement: Element | null = null;
    static rectElement: Element[] = [];
    static rectElementParam: ElementParamType[] = [];
    static popperElement: Element[] = [];
    static windowWidth: number = 0;
    static windowHeight: number = 0;
    static viewerInterfaceElement: Element | null = null;

    public static startTour = () => {
        TourHelper.start = true;
        console.log("startTour");
        window.addEventListener("resize", TourHelper.startStep);
        TourHelper.step();
    };
    public static endTour = () => {
        console.log("end tour");
        window.removeEventListener("resize", TourHelper.startStep);
        TourHelper.initState();
    };
    public static setNameTour = (name: string) => {
        TourHelper.nameTour = name;
    };
    public static setDescTour = (desc: string) => {
        TourHelper.descTour = desc;
    };
    public static blackout = (element: string) => {
        TourHelper.steps[TourHelper.stepCount].blackout.push(() => {
            TourHelper.setBlackElement(element);
        });
    };
    public static description = (element: string, desc: string) => {
        TourHelper.steps[TourHelper.stepCount].description.push(() => {
            TourHelper.setDescrElement(element, desc);
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
            window.addEventListener("click", TourHelper.clickHandler, true);
        });
    };
    public static clickOn = (element: string) => {
        TourHelper.conditionStepNumbers.push(TourHelper.stepCount);
        TourHelper.steps[TourHelper.stepCount].condition.push(() => {
            TourHelper.setConditionElement(element);
        });
    };
    public static step = (index?: number) => {
        TourHelper.blackElement = [];
        TourHelper.descrElement = [];
        TourHelper.conditionElement = null;
        if (typeof index !== "number") {
            TourHelper.currentStep += 1;
        } else {
            TourHelper.currentStep = index;
        }
        if (TourHelper.currentStep === TourHelper.steps.length) return;
        TourHelper.startStep();
    };

    private static startStep = () => {
        TourHelper.clearCreatedElement();
        TourHelper.setElements();
    };

    private static showElements = () => {
        TourHelper.blackElement[0]?.element?.scrollIntoView({ block: "start", behavior: "smooth" });
        TourHelper.descrElement[0]?.element?.scrollIntoView({ block: "start", behavior: "smooth" });
        TourHelper.blackoutWindow();
        TourHelper.descrElement.forEach(el => TourHelper.describeElement(el));
    };
    private static blackoutWindow = () => {
        TourHelper.setParamWindow();
        TourHelper.blackElement.forEach(el => (el.coordinates = TourHelper.getCoordinateElement(el.element)));
        const coordinates = TourHelper.blackElement[0].coordinates;
        let area = {
            minX: coordinates.top,
            minY: coordinates.left,
            maxX: coordinates.top + coordinates.height,
            maxY: coordinates.left + coordinates.width
        };
        if (TourHelper.blackElement.length > 1) {
            area = TourHelper.getArea();
            TourHelper.addRectsIn(area);
        }
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
    };
    private static addRectsIn = ({ minX, maxX, maxY, minY }: HighlightAreaType) => {
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
    };
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
        console.log(TourHelper.rectElementParam);

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

    private static showViewerInterface = () => {
        const node: Element = window.document.createElement("div");
        const nodeId = "viewer-interface";
        node.id = nodeId;
        node.setAttribute("data-testid", "viewer-interface");
        window.document.body.appendChild(node);
        const getMaxNextOpen = () => {
            const maxIndex: number = TourHelper.conditionStepNumbers.findIndex(step => {
                return step >= TourHelper.currentStep;
            });
            if (maxIndex === -1) {
                return TourHelper.steps.length - 1;
            }
            return TourHelper.conditionStepNumbers[maxIndex];
        };
        const getMinPreviousOpen = () => {
            let minStep = -1;
            TourHelper.conditionStepNumbers.forEach(step => {
                if (step < TourHelper.currentStep) {
                    minStep = step;
                }
            });
            return minStep + 1;
        };
        let minPreviousOpen: number | undefined = undefined;
        let maxNextOpen: number | undefined = undefined;
        if (TourHelper.currentStep > -1 && TourHelper.conditionStepNumbers.length !== 0) {
            if (TourHelper.currentStep !== 0) {
                minPreviousOpen = getMinPreviousOpen();
            }
            if (TourHelper.currentStep < TourHelper.steps.length - 1) {
                maxNextOpen = getMaxNextOpen();
            }
        }
        ReactDOM.render(
            <ViewerInterface
                setStep={TourHelper.step}
                currentStep={TourHelper.currentStep}
                totalSteps={TourHelper.steps.length}
                name={TourHelper.nameTour}
                desc={TourHelper.descTour}
                onStart={TourHelper.startTour}
                start={TourHelper.start}
                minPreviousOpen={minPreviousOpen}
                maxNextOpen={maxNextOpen}
            />,
            document.getElementById(nodeId)
        );
        TourHelper.viewerInterfaceElement = node;
    };

    private static setActionWaiting = () => {
        TourHelper.steps[TourHelper.currentStep].condition.forEach(fn => fn());
    };
    private static clickHandler = (e: MouseEvent) => {
        if (TourHelper.viewerInterfaceElement?.contains(e.target)) {
            return;
        }
        disposeEvent(e);
        console.log(TourHelper.currentStep);
        window.removeEventListener("click", TourHelper.clickHandler, true);
        TourHelper.step();
    };
    private static clickOnHandler = (e: { target: any }) => {
        const target = e.target; //ссылка на конкретный элемент внутри формы, самый вложенный, на котором произошёл клик
        const element: Element | null = TourHelper.conditionElement;
        console.log("clickOnHandler >> ", element);
        if (element?.contains(target) && element) {
            element.removeEventListener("click", TourHelper.clickOnHandler);
            TourHelper.conditionElement = null;
            TourHelper.clearCreatedElement();
            TourHelper.step();
            // window.addEventListener("DOMContentLoaded", TourHelper.step, { once: true });
            //window.setTimeout(TourHelper.step, 200);
        }
    };

    private static allElementsIsFound = () => {
        const resultOfChecking: boolean =
            TourHelper.steps[TourHelper.currentStep].blackout.length === TourHelper.blackElement.length &&
            TourHelper.steps[TourHelper.currentStep].description.length === TourHelper.descrElement.length;
        return resultOfChecking;
    };
    private static onElementIsNotFound = (selector: string, nameSelector?: string) => {
        sendMessage("newError", "Время ожидания элемента истекло");
        console.log("Селектор не найден");
        const error: string =
            (nameSelector || "элемент") +
            " с селектором " +
            selector +
            " не найден на " +
            (TourHelper.currentStep + 1) +
            "-м шаге";
        sendMessage("newError", error);
        //TourHelper.endTour();
    };

    private static tryGetElement = (callback: (el: Element) => void, selector: string, nameSelector?: string) => {
        let el: Element | null = document.querySelector(selector);
        let idRequest = 0;
        const stopRequest = () => {
            clearInterval(idRequest);
            if (!el) {
                TourHelper.onElementIsNotFound(selector, nameSelector);
            } else {
                callback(el);
                if (TourHelper.allElementsIsFound() && !TourHelper.conditionElement) {
                    TourHelper.afterSettingElements();
                }
            }
        };

        if (el) {
            return stopRequest();
        }
        const maxTimeRequest = 5000;
        const timeout = 10;
        let timeRequest = 0;
        idRequest = window.setInterval(() => {
            el = document.querySelector(selector);
            console.log("idRequest", idRequest, el);
            timeRequest += timeout;
            if (timeRequest > maxTimeRequest || (el && !TourHelper.findParentWithDisplayNone(el))) {
                stopRequest();
            }
        }, timeout);
    };
    private static findParentWithDisplayNone = (element: Element | null) => {
        //there is a parent with display: none
        let el: Node | null = element;
        if (!el) return true;
        while (el) {
            if (el.style.display === "none") {
                console.log("родитель с  display=none", el);
                return true;
            }
            el = el.parentNode;
            for (let i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].className === "dark_overlay") {
                    console.log("элемент перекрывающий найденный (с классом dark_overlay)", el);
                    return true;
                }
            }
        }
        return false;
    };

    private static setBlackElement = (selector: string) => {
        const onOk = (el: Element) => {
            const blackEl: BlackElementType = {
                element: el,
                coordinates: TourHelper.getCoordinateElement(el)
            };
            TourHelper.blackElement.push(blackEl);
        };
        TourHelper.tryGetElement(onOk, selector, "выделяемый элемент");

        //console.log("show on the this element >> ", el);
    };
    private static setDescrElement = (selector: string, description: string) => {
        const onOk = (el: Element) => {
            TourHelper.descrElement.push({ element: el, description: description });
        };
        TourHelper.tryGetElement(onOk, selector, "элемент, к которому добавляется описание, ");
    };
    private static setConditionElement = (selector: string) => {
        const onOk = (el: Element) => {
            TourHelper.conditionElement = el;
            TourHelper.conditionElement?.addEventListener("click", TourHelper.clickOnHandler, { once: true });
        };
        TourHelper.tryGetElement(onOk, selector, "элемент, по которому ожидается клик, ");
    };
    private static setElements = () => {
        TourHelper.steps[TourHelper.currentStep].blackout.forEach(fn => fn());
        TourHelper.steps[TourHelper.currentStep].description.forEach(fn => fn());
    };
    private static afterSettingElements = () => {
        //console.log(TourHelper.blackElement);
        if (!TourHelper.allElementsIsFound()) {
            TourHelper.endTour();
        } else {
            TourHelper.showElements();
            TourHelper.showViewerInterface();
            TourHelper.setActionWaiting();
        }
    };

    private static setParamWindow = () => {
        TourHelper.windowWidth = Math.max(document.body.scrollWidth, document.body.clientWidth);
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
    private static clearRectElement = () => {
        TourHelper.rectElement.map(el => el.remove());
        TourHelper.rectElement = [];
        TourHelper.rectElementParam = [];
    };
    private static clearPopperElement = () => {
        TourHelper.popperElement.map(el => el.parentNode!.removeChild(el));
        TourHelper.popperElement = [];
    };
    private static clearViewerInterfaceElement = () => {
        const el: Element | null = TourHelper.viewerInterfaceElement;
        el?.parentNode?.removeChild(el);
        TourHelper.viewerInterfaceElement = null;
    };
    private static clearCreatedElement = () => {
        TourHelper.clearRectElement();
        TourHelper.clearPopperElement();
        TourHelper.clearViewerInterfaceElement();
    };
    private static initState = () => {
        TourHelper.nameTour = "";
        TourHelper.descTour = "";
        TourHelper.descTour = "";
        window.removeEventListener("click", TourHelper.clickHandler, true);
        TourHelper.conditionElement?.removeEventListener("click", TourHelper.clickOnHandler, true);
        TourHelper.conditionElement = null;
        TourHelper.clearCreatedElement();
        TourHelper.blackElement = [];
        TourHelper.descrElement = [];
        TourHelper.currentStep = -1;
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
        TourHelper.start = false;
        TourHelper.conditionStepNumbers = [];
    };
}

(window as any).TourHelper = TourHelper;
