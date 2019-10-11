import { useContext } from "react";
import BurgerMenu from "./Burger-menu";
import * as React from "react";
import { Button } from "react-bootstrap";

const HamburgerButton = () => {
    //const { isMenuOpen, toggleMenuMode } = useContext(MenuContext);

    const clickHandler = () => {
        //toggleMenuMode();
    };

    return (
        <div id="outer-container" className="burgerStyle">

            <BurgerMenu />
            {/*<main id="page-wrap">
                Проекты
                </main>*/}

        </div>
    );
};

export default HamburgerButton;
