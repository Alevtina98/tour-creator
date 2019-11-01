import * as utils from "./utils";

Object.keys(utils).forEach(value => {
    (window as any)[value] = (utils as any)[value];
});
