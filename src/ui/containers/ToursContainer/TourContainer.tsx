import React, {FC, memo, useEffect, useRef} from "react";
import ScriptsButtons from "../../components/ScriptButtons";
import ScriptList from "../../components/ScriptList/ScriptList/ScriptList";


const TourContainer = () => {
    return (
        <div>
            <ScriptsButtons />
            <ScriptList />
        </div>
    );
};

export default memo(TourContainer);
