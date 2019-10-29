import React from "react";
import MainContainer from "./MainContainer";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import "../../../../style/main.less";

export default { title: "MainContainer/Main", component: ProviderWithComponent(MainContainer) };
export const main = () => ProviderWithComponent(MainContainer)();
