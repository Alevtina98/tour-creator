import { slide as Menu, State } from "react-burger-menu";
import { useEffect, useState } from "react";
import React from "react";
import ScriptList from "../../components/ScriptList/ScriptList/ScriptList";
import { loadListTour } from "../../actions/selectedTourAction";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
/*
Крестики
https://instaga.ru/images/close.png
http://teatrnur.ru/wp-content/themes/twentyfifteen/img/cross.png

Для открытия списка
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png

*/
const BurgerMenuContainer = () => {
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
        //console.log("CLOSE");
        // }
    };
    // useEffect(() => {
    //     setInterval(() => {
    //         setMenuIsOpen(v => !v);
    //     }, 2000);
    // }, []);
    const openBurgerMenu = () => {
        setMenuIsOpen(true);
    };
    //console.log("menu is open", menuIsOpen);
    return (
        <div>
            {/* <Menu
                right
                isOpen={menuIsOpen}
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
                        position: "relative"
                    },
                    bmItemList: {
                        background: "#fefdfe"
                    },
                    bmOverlay: {
                        top: 0,
                        bottom: 0
                    },
                    bmMenuWrap: {
                        top: 0,
                        bottom: 0
                    }
                }}
            >
                <ScriptList onClickScript={closeAllMenus} />
            </Menu>*/}
            <Button variant="light" onClick={openBurgerMenu} className="burger-menu-button-open">
                <img src="http://pribory-spb.ru/templates/skin1/images/icon-menu.png" style={{ width: 22 }} />
            </Button>
            <div>
                {(menuIsOpen && <div className="back-drop" />) || null}
                <ScriptList onClickScript={closeAllMenus} onClickEsc={closeAllMenus} isOpen={menuIsOpen}/>
            </div>

            {/*<TourBurgerMenu />*/}
        </div>
    );
};
export default BurgerMenuContainer;
