import DescriptionComponent from "../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";
import Script from "../ui/components/ScriptList/Script/Script";

export default class TourHelper {
    static tourElement = [];
    public static select = (element: string): HTMLElement | null => {
        console.log("selector >> ", element);
        if (!document.querySelector(element)) console.log("ERROR: selector not found");
        return document.querySelector(element);
    };
    public static clear = () => {
        TourHelper.tourElement.map(el => el.remove());
        TourHelper.tourElement = [];
    };
    public static blackout = (element: string) => {
        const el = TourHelper.select(element);
        //console.log("blackout FN", el);
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
    public static description = (element: string, desc: string) => {
        const el = TourHelper.select(element);
        if (!el) {
            return;
        }
        //console.log("description FN >> ", el, " desc >> ", desc);
        const descr = window.document.createElement("div");
        descr.id = "container";
        window.document.body.appendChild(descr);
        ReactDOM.render(<DescriptionComponent selector={el} text={desc} />, document.getElementById("container"));
        TourHelper.tourElement.push(descr);
    };
    private static newRect = (rTop: number, rLeft: number, rWidth: number, rHeight: number) => {
        const rectStyle: CSSStyleDeclaration = {
            position: "absolute",
            zIndex: "1000",
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
        TourHelper.tourElement.push(rect);
    };
}

(window as any).TourHelper = TourHelper;
