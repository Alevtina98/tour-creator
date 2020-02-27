import {useCallback, useState} from "react";
import React from "react";
import ScriptList from "../../components/ScriptList/ScriptList/ScriptList";
import {Button, Nav} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {StoreType} from "../../reducers";
import {burgerClose, burgerOpen} from "../../actions/mainAction";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png
Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png
*/
const BurgerMenuContainer = () => {
    const burgerIsOpen = useSelector<StoreType, boolean>(({ MainState }) => MainState.burgerIsOpen);
    const dispatch = useDispatch();
    const closeAllMenus = useCallback(() => {
        dispatch(burgerClose());
    }, []);
    const openBurgerMenu = () => {
        dispatch(burgerOpen());
    };
    return (
        <div>
            <Nav.Link onClick={openBurgerMenu} className="burger-menu-button-open" >
                <img src="http://pribory-spb.ru/templates/skin1/images/icon-menu.png" style={{ width: 22 }} />
            </Nav.Link>
            <div>
                {(burgerIsOpen && <div className="back-drop" />) || null}
                <ScriptList onClickEsc={closeAllMenus} isOpen={burgerIsOpen} />
            </div>
        </div>
    );
};
export default BurgerMenuContainer;
