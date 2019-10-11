import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import React from "react";
import ScriptList from "./ScriptList";

const TourBurgerMenu = () => {
    //const [show, setShow] = useState(false);
    /*const showSettings = (e: any) => {
        e.preventDefault();
    };*/
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
        <Menu>
           {/* <a id="home" className="menu-item" href="/">
                Home
            </a>
            <a id="about" className="menu-item" href="/about">
                About
            </a>
            <a id="contact" className="menu-item" href="/contact">
                Contact
            </a>*/}
            {/*<a onClick={showSettings} className="menu-item--small" href="">
                Settings
            </a>*/}
            <ScriptList />
        </Menu>
    );
};
export default TourBurgerMenu;
