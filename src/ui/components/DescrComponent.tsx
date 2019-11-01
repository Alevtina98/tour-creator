import { Manager, Reference, Popper } from "react-popper";
import React from "react";

const DescrComponent = () => (
    <Manager>
        <Reference>
            {({ ref }) => (
                <button type="button" ref={ref}>
                    Reference element
                </button>
            )}
        </Reference>
        <Popper placement="right">
            {({ ref, style, placement, arrowProps }) => (
                <div ref={ref} style={style} data-placement={placement}>
                    Popper element
                    <div ref={arrowProps.ref} style={arrowProps.style} />
                </div>
            )}
        </Popper>
    </Manager>
);
export default DescrComponent;