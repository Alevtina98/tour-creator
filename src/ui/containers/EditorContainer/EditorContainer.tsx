import React, { memo } from "react";
import BlocklyComponent from "../../components/BlocklyComponent";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setInspectEnabled } from "../../actions/inspectAction";
import agentActions from "../../actions/agentActions";
import { TourType } from "../../util/restClient/requestTour";
import { setModal } from "../../actions/modalAction";
import CodeJSComponent from "../../components/CodeJSComponent";

export interface TourEditorComponentProps {
    blocklyReloadEnabled: boolean;
    selector: string;
    tour: TourType;
}
const EditorContainer = () => {
    const dispatch = useDispatch();
    const { blocklyReloadEnabled, selector, tour } = useSelector<StoreType, TourEditorComponentProps>(
        ({ SelectedTourState, InspectState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            tour: SelectedTourState.tourDB,
            selector: InspectState.selector
        })
    );
    const onInspectClickHandler = () => {
        dispatch(setInspectEnabled());
        dispatch(setModal(tour, "inspect"));
        agentActions.enableSelectMode();
    };
    return (
        <div className="editor-container">
            {blocklyReloadEnabled && (
                <>
                    <BlocklyComponent selector={selector} inspect={onInspectClickHandler} />
                    <CodeJSComponent />
                </>
            )}
        </div>
    );
};

export default memo(EditorContainer);
