import React from "react";
import BurgerMenuContainer from "./BurgerMenuContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";

export default { title: "MainContainer/PanelContainer/BurgerMenuContainer/BurgerMenu", component: ProviderWithComponent(BurgerMenuContainer) };

export const burgerMenu = () => ProviderWithComponent(BurgerMenuContainer)();

