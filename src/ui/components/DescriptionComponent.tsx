import { Manager, Reference, Popper } from "react-popper";
import React, { FC } from "react";
import styled from "styled-components";

export interface DescrComponentProps {
    selector: Element;
    text: string;
}

const StyledTooltipContainer = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    margin: 0.4rem;
    padding: 0.4rem;
    transition: opacity 0.3s;
    z-index: 2147483647;
`;

const StyledArrow = styled.div`
    height: 1rem;
    position: absolute;
    width: 1rem;

    &::before {
        border-style: solid;
        content: "";
        display: block;
        height: 0;
        margin: auto;
        width: 0;
    }

    &::after {
        border-style: solid;
        content: "";
        display: block;
        height: 0;
        margin: auto;
        position: absolute;
        width: 0;
    }

    &[data-placement*="bottom"] {
        height: 1rem;
        left: 0;
        margin-top: -0.4rem;
        top: 0;
        width: 1rem;
    }

    &[data-placement*="bottom"]::before {
        border-color: transparent transparent silver transparent;
        border-width: 0 0.5rem 0.4rem 0.5rem;
        position: absolute;
        top: -1px;
    }

    &[data-placement*="bottom"]::after {
        border-color: transparent transparent white transparent;
        border-width: 0 0.5rem 0.4rem 0.5rem;
    }

    &[data-placement*="top"] {
        bottom: 0;
        height: 1rem;
        left: 0;
        margin-bottom: -1rem;
        width: 1rem;
    }

    &[data-placement*="top"]::before {
        border-color: silver transparent transparent transparent;
        border-width: 0.4rem 0.5rem 0 0.5rem;
        position: absolute;
        top: 1px;
    }

    &[data-placement*="top"]::after {
        border-color: white transparent transparent transparent;
        border-width: 0.4rem 0.5rem 0 0.5rem;
    }

    &[data-placement*="right"] {
        height: 1rem;
        left: 0;
        margin-left: -0.7rem;
        width: 1rem;
    }

    &[data-placement*="right"]::before {
        border-color: transparent silver transparent transparent;
        border-width: 0.5rem 0.4rem 0.5rem 0;
    }

    &[data-placement*="right"]::after {
        border-color: transparent white transparent transparent;
        border-width: 0.5rem 0.4rem 0.5rem 0;
        left: 6px;
        top: 0;
    }

    &[data-placement*="left"] {
        height: 1rem;
        margin-right: -0.7rem;
        right: 0;
        width: 1rem;
    }

    &[data-placement*="left"]::before {
        border-color: transparent transparent transparent silver;
        border-width: 0.5rem 0 0.5rem 0.4em;
    }

    &[data-placement*="left"]::after {
        border-color: transparent transparent transparent white;
        border-width: 0.5rem 0 0.5rem 0.4em;
        left: 3px;
        top: 0;
    }
`;

const DescriptionComponent: FC<DescrComponentProps> = ({ selector, text }) => {
    //selector.style.zIndex = "1002";
    return (
        <Popper
            referenceElement={selector}
            modifiers={{
                offset: {
                    offset: 6
                }
            }}
        >
            {({ ref, style, placement, arrowProps }) => (
                <StyledTooltipContainer ref={ref} style={{ ...style, zIndex: 11000001,  maxWidth: "50%"}} data-placement={placement}>
                    <div className="description">{text}</div>
                    <StyledArrow data-placement={placement} ref={arrowProps.ref} style={arrowProps.style} />
                </StyledTooltipContainer>
            )}
        </Popper>
    );
};
export default DescriptionComponent;
