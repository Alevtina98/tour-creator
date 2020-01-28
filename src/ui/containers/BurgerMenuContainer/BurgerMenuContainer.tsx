import { useState } from "react";
import React from "react";
import ScriptList from "../../components/ScriptList/ScriptList/ScriptList";
import { Button } from "react-bootstrap";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png
Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png
*/
const BurgerMenuContainer = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    // const dispatch = useDispatch();
    const closeAllMenus = () => {
        setMenuIsOpen(false);
    };
    const openBurgerMenu = () => {
        setMenuIsOpen(true);
    };
    return (
        <div>
            <Button variant="light" onClick={openBurgerMenu} className="burger-menu-button-open">
                <img src="http://pribory-spb.ru/templates/skin1/images/icon-menu.png" style={{ width: 22 }} />
            </Button>
            <div>
                {(menuIsOpen && <div className="back-drop" />) || null}
                <ScriptList onClickScript={closeAllMenus} onClickEsc={closeAllMenus} isOpen={menuIsOpen} />
            </div>
        </div>
    );
};
export default BurgerMenuContainer;
