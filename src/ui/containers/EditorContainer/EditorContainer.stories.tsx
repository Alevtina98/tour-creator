import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import TourEditorContainer from "./EditorContainer";

const Component = ProviderWithComponent(TourEditorContainer);

export default { title: "MainContainer/EditorContainer", component: <Component /> };
export const blocklyDisabled = () => (
    <div className="main-selector">
        <div />
        {ProviderWithComponent(TourEditorContainer)()}
    </div>
);
export const blocklyEnabled = () => (
    <div className="main-selector">
        <div />
        {ProviderWithComponent(TourEditorContainer, {
            SelectedTourState: {
                blocklyReloadEnabled: true
            }
        } as any)()}
    </div>
);
export const inspectEnabled = () => (
    <div className="main-selector">
        <div />
        {ProviderWithComponent(TourEditorContainer, {
            SelectedTourState: {
                blocklyReloadEnabled: true
            },
            InspectState: {
                isInspectEnabled: true
            }
        } as any)()}
    </div>
);


