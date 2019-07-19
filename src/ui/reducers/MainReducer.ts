export const initialMainState = {
    connected: false,
    selector: "",
    isInspectEnabled: false,
};

const MainReducer = (state = initialMainState, action: any) => {
    switch (action.type) {
        case "CONNECTION_SUCCESS": {
            return {
                ...state,
                connected: true
            }
        }
        case "SET_CURRENT_SELECTOR":
            return {
                ...state,
                isInspectEnabled: false,
                selector: action.payload.selector

            };
        case "SET_INSPECT_ENABLED":
            return {
                ...state,
                isInspectEnabled: true
            };
        case "SET_INSPECT_DISABLED":
            return {
                ...state,
                isInspectEnabled: false
            }
    }
    return state;
};

export default MainReducer;
