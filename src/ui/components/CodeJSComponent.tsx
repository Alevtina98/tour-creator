import React, { memo } from "react";
import { useSelector } from "react-redux";
import { TourType } from "../util/restClient/requestTour";
import { StoreType } from "../reducers";

const CodeJSComponent = () => {
    const tour: TourType = useSelector<StoreType, TourType>(({ SelectedTourState }) => SelectedTourState.tourDB);
    return (
        <div className="code-block">
            {tour.codeJS?.split(/(\/\/!.*)|(.*\/\*\*\n.*\*.*\n.*\*\/)|(\/\/ .*)/g).map((el, index) => {
                console.log("codeJS el ", index, el);
                if (!el) {
                    return;
                }
                let name = "comment";
                if (!(index % 4)) {
                    name = "text";
                } else if (!((index - 1) % 4)) {
                    name = "error";
                }
                return el.split(/[\n]/g).map((str, index, array) => {
                    if (str) return <div className={name + "Style"}>{str}</div>;
                    if (index !== 0 && index !== array.length - 1) return <br />;
                    return null;
                });
            }) || null}
        </div>
    );
};

export default memo(CodeJSComponent);
