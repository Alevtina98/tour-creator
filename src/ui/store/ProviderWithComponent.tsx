import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { TourType } from "../util/restClient/requestTour";

const ProviderWithComponent = (Component: any, initialState?: { SelectedTourState: { tourDB: TourType; tourXML: { "new xml"; text(storeTour) }; blocklyReloadEnabled: boolean } }) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
