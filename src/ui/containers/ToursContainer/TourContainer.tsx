import React, {FC, memo, useEffect, useRef} from "react";
import ScriptsButtons from "../../components/ScriptButtons";
import ScriptList from "../../components/ScriptList";

export interface LoadStatusProps {
    load: any;
}

const TourContainer: FC<LoadStatusProps> = ({ load }) => {
    return (
        <div>
            <ScriptsButtons load={load} />
            <ScriptList />
        </div>
    );
};

export default memo(TourContainer);
