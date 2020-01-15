import { fireEvent, cleanup, render } from "@testing-library/react";
import TourHelper, { StepType } from "../utils";
import { testTour } from "./testTour";
import fs from "fs";
import path from "path";
import React from "react";

const testHtml = fs.readFileSync(path.resolve(__dirname, "testPage1.html"), "utf8");
const testElement = window.document.createElement("div");
const testCode = () => {};
const testTourHelperState = () => {
    TourHelper.rectElement = [testElement, testElement, testElement, testElement];
    TourHelper.popperElement = [testElement];
    TourHelper.targetElement = testElement;
    TourHelper.conditionElement = testElement;
    TourHelper.currentStep = 3;
    TourHelper.stepCount = 3;
    TourHelper.steps = [
        {
            blackout: [testCode],
            description: [testCode],
            condition: [testCode]
        }
    ];
};
const initialTourHelperState = () => {
    TourHelper.steps = [
        {
            blackout: [],
            description: [],
            condition: []
        }
    ]; //набор функций для каждого шага
    TourHelper.stepCount = 0; //индекс, по которому записывается в массив набор блоков-функций (записанный шаг)
    TourHelper.currentStep = 0; //индекс, по которому извлекаются из массива функции при просмотре тура (сделанный шаг)
    TourHelper.targetElement = null; //выделяемый на данном шаге элемент
    TourHelper.conditionElement = null; //элемент, клик по которому приведет к инкременту шага
    TourHelper.rectElement = []; //затемняющие прямоугольники
    TourHelper.popperElement = []; //показываемый около элемента тект
};
const getRectParametrs = (el: Element) => {
    const bounds = el.getBoundingClientRect() as DOMRect;
    const parametrsRect = {
        x: bounds.x + (window.pageXOffset || document.documentElement.scrollLeft),
        y: bounds.y + (window.pageYOffset || document.documentElement.scrollTop),
        height: bounds.height,
        width: bounds.width
    };
    return parametrsRect;
};
describe("TourHelper", () => {
    beforeEach(() => {
        cleanup();
        document.documentElement.innerHTML = testHtml.toString();
        if (window.document) {
            window.document.createRange = () => ({
                setStart: () => {},
                setEnd: () => {},
                commonAncestorContainer: {
                    nodeName: "BODY",
                    ownerDocument: document
                }
            });
        }
        initialTourHelperState();
    });
    const initSteps: StepType[] = [
        {
            blackout: [],
            description: [],
            condition: []
        }
    ];
    window.HTMLElement.prototype.scrollIntoView = () => {};
    it("tour should be record", () => {
        expect(TourHelper.steps).toStrictEqual(initSteps);
        testTour();
        expect(TourHelper.stepCount).toStrictEqual(3);
        expect(TourHelper.steps).not.toStrictEqual(initSteps);
        //expect(TourHelper.steps).toStrictEqual(correctTestSteps);
    });
    it("tour should be play in steps", () => {
        const el_0 = document.querySelector("body");
        const el_1 = document.querySelector("body>p:nth-child(3)");
        const el_2 = document.querySelector("body>p:nth-child(10)");
        const el_3 = document.querySelector("body>p:nth-child(15)");
        testTour();
        TourHelper.startTour();
        expect(TourHelper.currentStep).toStrictEqual(0);
        expect(TourHelper.targetElement).toStrictEqual(el_1);
        expect(TourHelper.conditionElement).toBeNull();
        fireEvent.click(document.body);
        expect(TourHelper.currentStep).toStrictEqual(1);
        expect(TourHelper.targetElement).toStrictEqual(el_1);
        expect(TourHelper.conditionElement).toBeNull();
        fireEvent.click(document.body);
        expect(TourHelper.currentStep).toStrictEqual(2);
        expect(TourHelper.targetElement).toStrictEqual(el_2);
        expect(TourHelper.conditionElement).toStrictEqual(el_2);
        fireEvent.click(document.body);
        expect(TourHelper.currentStep).toStrictEqual(2);
        expect(TourHelper.targetElement).toStrictEqual(el_2);
        expect(TourHelper.conditionElement).toStrictEqual(el_2);
        fireEvent.click(el_2);
        expect(TourHelper.currentStep).toStrictEqual(3);
        expect(TourHelper.targetElement).toStrictEqual(el_3);
        expect(TourHelper.conditionElement).toBeNull();
    });
    it("should be show blackout", () => {
        const boundsEl = {
            bottom: 510,
            height: 494,
            left: 8,
            right: 1272,
            top: 16,
            width: 1264,
            x: 8,
            y: 16
        };
        document.querySelector("body").getBoundingClientRect = () => {
            return boundsEl;
        };
        document.defaultView.innerWidth = 1280;
        document.defaultView.innerHeight = 913;
        testTour();
        TourHelper.startTour();
        expect(TourHelper.rectElement[0].getAttribute("data-testid")).toBe("blackoutRect0");
        expect(TourHelper.rectElement[1].getAttribute("data-testid")).toBe("blackoutRect1");
        expect(TourHelper.rectElement[2].getAttribute("data-testid")).toBe("blackoutRect2");
        expect(TourHelper.rectElement[3].getAttribute("data-testid")).toBe("blackoutRect3");
        //targetElement (top, left, width, height): 16 8 1264 494
        expect(TourHelper.targetElement.getBoundingClientRect()).toStrictEqual(boundsEl);
        expect(TourHelper.rectElementParam[0]).toStrictEqual({ top: 0, left: 0, width: 8, height: 913 });
        expect(TourHelper.rectElementParam[1]).toStrictEqual({ top: 0, left: 1272, width: 8, height: 913 });
        expect(TourHelper.rectElementParam[2]).toStrictEqual({ top: 0, left: 8, width: 1264, height: 16 });
        expect(TourHelper.rectElementParam[3]).toStrictEqual({ top: 510, left: 8, width: 1264, height: 403 });
    });
    it("should be show description", () => {
        testTour();
        TourHelper.startTour();
        expect(TourHelper.popperElement[0].getAttribute("data-testid")).toBe("popper0");
        expect(TourHelper.popperElement[0].textContent).toBe("Посмотрите сюда");
    });
    it("endTour should do initial state", () => {
        testTourHelperState();
        expect(TourHelper.rectElement).not.toStrictEqual([]);
        expect(TourHelper.popperElement).not.toStrictEqual([]);
        expect(TourHelper.targetElement).not.toBeNull();
        expect(TourHelper.conditionElement).not.toBeNull();
        expect(TourHelper.currentStep).not.toStrictEqual(0);
        expect(TourHelper.stepCount).not.toStrictEqual(0);
        expect(TourHelper.steps).not.toStrictEqual([]);
        TourHelper.endTour();
        expect(TourHelper.rectElement).toStrictEqual([]);
        expect(TourHelper.popperElement).toStrictEqual([]);
        expect(TourHelper.targetElement).toBeNull();
        expect(TourHelper.conditionElement).toBeNull();
        expect(TourHelper.currentStep).toStrictEqual(0);
        expect(TourHelper.stepCount).toStrictEqual(0);
        expect(TourHelper.steps).toStrictEqual(initSteps);
    });
});
