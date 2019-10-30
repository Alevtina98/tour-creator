import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { StoreType } from "../reducers";
import {ScriptValue} from "../util/indexedDB";

const ProviderWithComponent = (Component: any, initialState?: { SelectedTourState: { tourDB: ScriptValue; tourXML: { "new xml"; text(storeTour) }; blocklyReloadEnabled: boolean } }) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
