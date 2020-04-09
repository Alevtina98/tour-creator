import React, { memo, useCallback, useEffect, useState } from "react";
import BlocklyComponent from "../../components/BlocklyComponent";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../reducers";
import { setInspectEnabled } from "../../actions/inspectAction";
import agentActions from "../../actions/agentActions";
import { setModal } from "../../actions/modalAction";
import { Button } from "react-bootstrap";
import CodeJSComponent from "../../components/CodeJSComponent";
import { TourType } from "../../util/tour";
import { setPeriodicSaveDisabled, setPeriodicSaveState } from "../../actions/selectedTourAction";

export interface TourEditorComponentProps {
    blocklyReloadEnabled: boolean;
    selector: string;
    tour: TourType;
}
const EditorContainer = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [counter, setCounter] = useState(0);
    const { blocklyReloadEnabled, selector, tour } = useSelector<StoreType, TourEditorComponentProps>(
        ({ SelectedTourState, InspectState, MainState }) => ({
            blocklyReloadEnabled: SelectedTourState.blocklyReloadEnabled,
            tour: SelectedTourState.selectedTour,
            selector: InspectState.selector
        })
    );
    useEffect(() => {
        setCounter(c => c + 1);
    }, [open]);
    useEffect(() => {
        if (blocklyReloadEnabled) {
            dispatch(setPeriodicSaveState(true));
        } else {
            setCounter(0);
        }
    }, [blocklyReloadEnabled]);
    const onInspectClickHandler = () => {
        dispatch(setInspectEnabled());
        dispatch(setModal({ tour: tour, status: "inspect" }));
        agentActions.enableSelectMode();
    };
    return (
        <div
            className="editor-container"
            style={{
                gridTemplateColumns: open ? "1fr 1fr" : "1fr"
            }}
        >
            {blocklyReloadEnabled && (
                <>
                    <BlocklyComponent key={counter} selector={selector} inspect={onInspectClickHandler} />
                    <Button
                        variant="light"
                        onClick={() => setOpen(!open)}
                        className="button-show-code"
                        data-testid="button-show-code"
                    >
                        КОД
                    </Button>
                    {(open && <CodeJSComponent />) || null}
                </>
            )}
        </div>
    );
};

export default memo(EditorContainer);
