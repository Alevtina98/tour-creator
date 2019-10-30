import React from "react";
import ConnectionStatus from "./ConnectionStatus";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

//export default { title: "MainContainer/PanelContainer/ConnectionStatus" };

const connectionComponent = storiesOf("MainContainer/PanelContainer/ConnectionStatus", module)
    .addDecorator(withKnobs)
    .add("status", () => (
        <ConnectionStatus connection={boolean("connection", false)} />
    ));

//export const isConnected = () => <ConnectionStatus connection={boolean("Disabled", false)} />;

//export const isNotConnected = () => <ConnectionStatus connection={false} />;
