import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import React from "react";
import ScriptList from "./ScriptList";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png

Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png

*/
const BurgerMenu = () => {
    //const [show, setShow] = useState(false);
    /*const showSettings = (e: any) => {
        e.preventDefault();
    };*/
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
        <div>
            <Menu
                customBurgerIcon={<img src="http://pribory-spb.ru/templates/skin1/images/icon-menu.png" />}
                customCrossIcon={
                    <img src="https://v1.iconsearch.ru/uploads/icons/webdesigncreative/128x128/cross-lines.png" />
                }
                pageWrapId={"page-wrap"}
                outerContainerId={"outer-container"}
                styles={{
                    bmBurgerButton: {
                        position: "relative"
                    }
                }}
            >
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
        </div>
    );
};
export default BurgerMenu;
