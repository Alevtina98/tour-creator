import {cleanup, fireEvent} from "@testing-library/react";
import TourHelper from "../utils";
import { testTour } from "../testTour";
import fs from "fs";
import path from "path";
/*const tourHelperInitialState = {
    steps: [
        //набор функций для каждого шага
        {
            blackout: [],
            description: [],
            condition: []
        }
    ],
    stepCount: 0, //индекс, по которому записывается в массив набор блоков-функций (записанный шаг)
    currentStep: 0, //индекс, по которому извлекаются из массива функции при просмотре тура (сделанный шаг)
    /!**
     * для каждого шага
     *!/
    targetElement: null, //выделяемый на данном шаге элемент
    rectElement: [], //затемняющие прямоугольники
    popperElement: [], //показываемый около элемента тект
    conditionElement: null //элемент, клик по которому приведет к инкременту шага
};*/
const testHtml = fs.readFileSync(path.resolve(__dirname, "../testPage1.html"), "utf8");
const testElement = window.document.createElement("div");
const testCode = () => {};
const correctTestSteps = [
    {
        blackout: [() => TourHelper.blackout(selector_1)],
        description: [() => TourHelper.description(selector_1, "Посмотрите сюда")],
        condition: [
            () =>
                TourHelper.blocklyStep(function() {
                    return TourHelper.click();
                })
        ]
    },
    {
        blackout: [() => TourHelper.blackout(selector_2)],
        description: [() => TourHelper.description(selector_2, "А теперь сюда")],
        condition: [
            () =>
                TourHelper.blocklyStep(function() {
                    return TourHelper.click();
                })
        ]
    },
    {
        blackout: [() => TourHelper.blackout(selector_3)],
        description: [() => TourHelper.description(selector_3, "А еще есть это - кликните сюда")],
        condition: [
            () =>
                TourHelper.blocklyStep(function() {
                    return TourHelper.clickOn(selector_2);
                })
        ]
    },
    {
        blackout: [() => TourHelper.blackout(selector_4)],
        description: [() => TourHelper.description(selector_4, "И даже вот это!")],
        condition: []
    }
];
const enablePageScroll = () => {};
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
const initSteps = [
    {
        blackout: [],
        description: [],
        condition: []
    }
];
const initialTourHelperState = () => {
    TourHelper.stepCount = 0;
    TourHelper.steps = initSteps;
    TourHelper.currentStep = 0;
    TourHelper.targetElement = null;
    TourHelper.conditionElement = null;
    TourHelper.rectElement = [];
    TourHelper.popperElement = [];
};
describe("TourHelper", () => {
    beforeEach(() => {
        // cleanup;
        document.documentElement.innerHTML = testHtml.toString();
    });
    initialTourHelperState();
    window.HTMLElement.prototype.scrollIntoView = () => {};
    it("tour should be record", () => {
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
        testTour();
        TourHelper.startTour();
        expect(TourHelper.currentStep).toStrictEqual(0);
        expect(TourHelper.targetElement).toStrictEqual(el_0);
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
        testTour();

        TourHelper.startTour();
        //expect(TourHelper.steps).toStrictEqual(correctTestSteps);
    });
    it("should be show description", () => {
        testTour();

        TourHelper.startTour();
        //expect(TourHelper.steps).toStrictEqual(correctTestSteps);
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
