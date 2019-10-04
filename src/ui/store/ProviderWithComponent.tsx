import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";

const ProviderWithComponent = (Component: any) => (): any => (
    <Provider store={configureStore()}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
