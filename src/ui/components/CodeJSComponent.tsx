import React, { memo } from "react";
import { useSelector } from "react-redux";
import { TourType } from "../util/restClient/requestTour";
import { StoreType } from "../reducers";

const CodeJSComponent = () => {
    const tour: TourType = useSelector<StoreType, TourType>(({ SelectedTourState }) => SelectedTourState.tourDB);
    return (
        <div className="code-block">
            {tour.codeJS?.split(/(\/\/!.*)|(.*\/\*\*\n.*\*.*\n.*\*\/)|(\n\/\/.*)/g).map((el, index) => {
                console.log("codeJS el ", index, el);
                if (!el) {
                    return;
                }
                let name = "comment";
                const firstBlock = index === 0;
                if (!(index % 4)) {
                    name = "text";
                } else if (!((index - 1) % 4)) {
                    name = "error";
                }
                return el.split(/[\n]/g).map((str, indexStr, arrayStr) => {
                    if (str)
                        return (
                            <div className={name + (firstBlock && indexStr < 2 ? "-setter" : "") + "-style"}>{str}</div>
                        );
                    if (indexStr !== 0 && indexStr !== arrayStr.length - 1) return <br />;
                    return null;
                });
            })}
        </div>
    );
};

export default memo(CodeJSComponent);
