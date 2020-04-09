import React from "react";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { TourType } from "../util/tour";

const ProviderWithComponent = (
    Component: any,
    initialState?: {
        SelectedTourState: {
            selectedTour: TourType;
            periodicSave: false;
            tourOpen: false;
            listTour: TourType[];
            errorsRunTour: [];
        };
    }
) => (): any => (
    <Provider store={configureStore(initialState)}>
        <Component />
    </Provider>
);

export default ProviderWithComponent;
