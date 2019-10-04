import React from "react";
import MainContainer from "./MainContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import "../../../../style/main.less";

export default { title: "MainContainer", component: ProviderWithComponent(MainContainer) };
export const myTestMainComponent = () => ProviderWithComponent(MainContainer)();
