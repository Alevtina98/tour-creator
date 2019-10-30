import React from "react";
import ProviderWithComponent from "../../store/ProviderWithComponent";
import TourEditorContainer from "./EditorContainer";
import { storiesOf } from "@storybook/react";
import { boolean, text, withKnobs } from "@storybook/addon-knobs";

const Component = ProviderWithComponent(TourEditorContainer);

const editor = storiesOf("MainContainer/EditorContainer", module)
    .addDecorator(withKnobs)
    .add("editor", () => (
        <div className="main-selector">
            <div />
            {ProviderWithComponent(TourEditorContainer, {
                SelectedTourState: {
                    blocklyReloadEnabled: boolean("blocklyReloadEnabled", true)
                },
                InspectState: {
                    isInspectEnabled: boolean("isInspectEnabled", false)
                }
            } as any)()}
        </div>
    ));
