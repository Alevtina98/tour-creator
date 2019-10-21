import { slide as Menu, State } from "react-burger-menu";
import { useEffect, useState } from "react";
import React from "react";
import ScriptList from "./ScriptList";
import { loadListTour } from "../actions/selectedTourAction";
import { useDispatch } from "react-redux";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png

Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png

*/
const TourBurgerMenu = () => {
    const [show, setShow] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const dispatch = useDispatch();
    /*const showSettings = (e: any) => {
        e.preventDefault();
    };*/
    const onStateChange = (state: State) => {
        setMenuIsOpen(state.isOpen);
        if (state.isOpen) {
            dispatch(loadListTour());
        }
    };
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    /*  const closeAllMenusOnSelectTour = () => {
        console.log("CLOSE");
        setMenuIsOpen(false);
    };*/
    const closeAllMenus = e => {
        // if (e.key === "Escape" || e == "CLICK_ON_Tour") {
        setMenuIsOpen(false);
        console.log("CLOSE");
        // }
    };
    // useEffect(() => {
    //     setInterval(() => {
    //         setMenuIsOpen(v => !v);
    //     }, 2000);
    // }, []);
    console.log("menu is open", menuIsOpen);
    return (
        <div>
            {/*<ScriptList onClickScript={closeAllMenus} />*/}
        </div>
    );
};
export default TourBurgerMenu;
