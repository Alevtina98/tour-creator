import React, { memo } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../reducers";
import { TourType } from "../util/tour";

const CodeJSComponent = () => {
    const tour: TourType = useSelector<StoreType, TourType>(({ SelectedTourState }) => SelectedTourState.selectedTour);
    return (
        <div className="code-block">
            {tour.codeJS?.split(/(\/\/!.*)|(.*\/\*\*\n.*\*.*\n.*\*\/)|(\n\/\/\s.*)/g).map((el, index) => {
                console.log("codeJS el ", index, el);
                // if (name === "text") return <br />;
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
                    if (name === "text" && indexStr !== 0 && indexStr !== arrayStr.length - 1) return <br />;

                    //const arrStrforBr = str.split(/[\n]/g) || null;
                    return null;
                });
            })}
        </div>
    );
};

export default memo(CodeJSComponent);
