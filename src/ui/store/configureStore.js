import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducer from "../reducers/index";

export default (initialState) => {
    const middleWare = [thunk];

    if (process.env.NODE_ENV === "development") {
        const logger = createLogger({
            collapsed: true
        });

        middleWare.push(logger);
    }

    return createStore(reducer, initialState, compose(applyMiddleware(...middleWare)));
};