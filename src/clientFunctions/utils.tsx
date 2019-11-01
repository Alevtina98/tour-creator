import DescrComponent from "../ui/components/DescrComponent";
import * as React from "react";

export const select = (element: HTMLElement) => {
    return document.querySelector(element);
};
export const blackout = (element: HTMLElement) => {
    const el: HTMLElement = select(element);
    console.log("blackout FN", el);
    const bounds = el.getBoundingClientRect() as DOMRect;
    const x: number = bounds.x;
    const y: number = bounds.y;
    const height: number = bounds.height;
    const width: number = bounds.width;
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
export const description = (element: HTMLElement, desc: string) => {
    const el: HTMLElement = select(element);
    console.log("description FN", el, desc);
    return <DescrComponent />;
};


