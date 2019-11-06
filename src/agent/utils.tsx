import DescriptionComponent from "../ui/components/DescriptionComponent";
import * as React from "react";
import ReactDOM from "react-dom";

export const select = (element: string): HTMLElement | null => {
    console.log("selector >> ", element);
    return document.querySelector(element);
};
export const blackout = (element: string) => {
    const el = select(element);
    if (!el) return console.log("ERROR: selector not found");
    console.log("blackout FN", el);
    const bounds = el.getBoundingClientRect() as DOMRect;
    const x: number = bounds.x + (window.pageXOffset || document.documentElement.scrollLeft);
    const y: number = bounds.y + (window.pageYOffset || document.documentElement.scrollTop);
    const height: number = bounds.height;
    const width: number = bounds.width;
    el.scrollIntoView({block: "center", behavior: "smooth" });
    const windowWidth: number = document.body.clientWidth;
    const windowHeight: number = document.body.clientHeight;
    const newRect = (rTop: number, rLeft: number, rWidth: number, rHeight: number) => {
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
    };
    newRect(0, 0, x, windowHeight);
    newRect(0, x + width, windowWidth - width - x, windowHeight);
    newRect(0, x, width, y);
    newRect(y + height, x, width, windowHeight - height - y);
};
export const description = (element: string, desc: string) => {
    const el = select(element);
    console.log("description FN >> ", el, " desc >> ", desc);
    const descr = window.document.createElement("div");
    descr.id = "container";
    window.document.body.appendChild(descr);
    ReactDOM.render(<DescriptionComponent selector={el} text={desc} />, document.getElementById("container"));
};

const helperFunction = {
    select,
    blackout,
    description
};

Object.keys(helperFunction).forEach(value => {
    (window as any)[value] = (helperFunction as any)[value];
});
