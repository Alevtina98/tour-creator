
export const connectSuccess = () => ({
    type: "CONNECTION_SUCCESS"
});

export const setCurrentSelector = (selector: string) => ({
    type: "SET_CURRENT_SELECTOR",
    payload: {
        selector
    }
});

export const setInspectEnabled = () => ({
    type: "SET_INSPECT_ENABLED",
});

export const setInspectDisabled = () => ({
    type: "SET_INSPECT_DISABLED",
});