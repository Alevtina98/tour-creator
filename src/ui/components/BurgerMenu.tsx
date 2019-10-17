import {slide as Menu, State} from "react-burger-menu";
import { useState } from "react";
import React from "react";
import ScriptList from "./ScriptList";
import {loadListTour} from "../actions/selectedTourAction";
import {useDispatch} from "react-redux";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png

Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png

*/
const BurgerMenu = () => {
    const [show, setShow] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const dispatch = useDispatch();
    /*const showSettings = (e: any) => {
        e.preventDefault();
    };*/
    const onStateChange = (state: State) => {
        if (state.isOpen) {
            dispatch(loadListTour());
        }
    };
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    const closeAllMenusOnSelectTour = () => {
        console.log("CLOSE");
        setMenuIsOpen(false);
    };
    const closeAllMenusOnEsc = (e) => {
        e = e || window.event;
        if (e.key === 'Escape' ) {
            setMenuIsOpen(false);
        }
    };
    return (
        <div>
            <Menu
                isOpen={menuIsOpen}
                customOnKeyDown={closeAllMenusOnEsc}
                onStateChange={onStateChange}
                customBurgerIcon={<img src="http://pribory-spb.ru/templates/skin1/images/icon-menu.png" />}
                customCrossIcon={
                    <img src="https://v1.iconsearch.ru/uploads/icons/webdesigncreative/128x128/cross-lines.png" />
                }
                //customOnKeyDown={closeAllMenusOnSelectTour}
                pageWrapId={"page-wrap"}
                outerContainerId={"outer-container"}
                styles={{
                    bmBurgerButton: {
                        position: "relative",

                    },
                    bmItemList: {
                        background: "#fefdfe"
                    },
                    bmOverlay: {
                        top: 0,
                        bottom: 0,
                    },
                    bmMenuWrap: {
                        top: 0,
                        bottom: 0,
                    }
                }}
            >
                <ScriptList onClickScript={closeAllMenusOnSelectTour} />
            </Menu>
        </div>
    );
};
export default BurgerMenu;
