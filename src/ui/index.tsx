import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "../../style/main.less";
import Main from "./containers/MainContainer/MainContainer";
import injectDebugger from "./injectDebugger";
import configureStore from "./store/configureStore";
import DescrComponent from "./components/DescrComponent";

injectDebugger();

const MainContainer = () => {
    return (
        <Provider store={configureStore()}>
            <Main />
        </Provider>
    );
};

window.addEventListener("load", function() {
    ReactDOM.render(<MainContainer />, document.getElementById("container"));
});
