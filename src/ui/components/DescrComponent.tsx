import { Manager, Reference, Popper } from "react-popper";
import React, { FC } from "react";

export interface DescrComponentProps {
    selector: HTMLElement;
    text: string;
}
const DescrComponent: FC<DescrComponentProps> = ({ selector, text }) => (
    <Popper referenceElement={selector}>
        {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={style} data-placement={placement} className="popper">
                {text}
                <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
        )}
    </Popper>
);
export default DescrComponent;
