import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { ScriptValue } from "../util/restClient/requestTour";

const ProviderWithComponent = (Component: any, initialState?: { SelectedTourState: { tourDB: ScriptValue; tourXML: { "new xml"; text(storeTour) }; blocklyReloadEnabled: boolean } }) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
