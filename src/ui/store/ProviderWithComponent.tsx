import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { StoreType } from "../reducers";

const ProviderWithComponent = (Component: any, initialState?: Partial<StoreType>) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
