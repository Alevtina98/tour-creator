export const initialState = {
    connected: false,
    selector: "",
    isInspectEnabled: false
};

const MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CONNECTION_SUCCESS": {
            return {
                ...state,
                connected: true
            }
        }
        case "SET_CURRENT_SELECTOR":
            console.log(action);
            return {
                ...state,
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
