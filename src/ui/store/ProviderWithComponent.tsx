import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { TourType } from "../util/tour";

const ProviderWithComponent = (
    Component: any,
    initialState?: {
        SelectedTourState: {
            selectedTour: TourType;
            tourXML: { "new xml"; text(storeTour) };
            tourOpen: boolean;
        };
    }
) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
