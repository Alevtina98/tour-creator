import {cleanup} from "@testing-library/react";
import selectedTourState from "../SelectedTourReducer";
import * as selectedTourAction from "../../actions/selectedTourAction";
import {getInitData, TourType} from "../../util/restClient/requestTour";

const testListTour: TourType[] = [
    getInitData({
        id: 0,
        name: "custom name"
    }),
    getInitData({
        id: 1,
        name: "custom name2"
    }),
    getInitData({
        id: 2,
        name: "custom name3"
    }),
    getInitData({
        id: 3,
        name: "custom name4"
    })
];
const newTestListTour: TourType[] = [
    ...testListTour,
    getInitData({
        id: 4,
        name: "custom name5"
    })
];
const errorList: string[] = ["error1", "error2", "error3"];
const newError: string = "error4";

describe("selectedTourAction", function() {
    beforeEach(cleanup);
    const initialState = {
        tourDB: testListTour[0],
        blocklyReloadEnabled: false,
        listTour: testListTour,
        errorsRunTour: []
    };

    it("standard action should change state", () => {
        expect(selectedTourState(initialState, selectedTourAction.setLoadBocklyEnabled())).toEqual({
            ...initialState,
            blocklyReloadEnabled: true
        });
        expect(selectedTourState(initialState, selectedTourAction.setLoadBocklyDisabled())).toEqual({
            ...initialState,
            blocklyReloadEnabled: false
        });
        expect(selectedTourState(initialState, selectedTourAction.setListTour(newTestListTour))).toEqual({
            ...initialState,
            listTour: newTestListTour
        });
        expect(selectedTourState(initialState, selectedTourAction.setTourDB(testListTour[2]))).toEqual({
            ...initialState,
            tourDB: testListTour[2]
        });
        expect(selectedTourState(initialState, selectedTourAction.setErrorsRunTour(errorList))).toEqual({
            ...initialState,
            errorsRunTour: errorList
        });
        expect(selectedTourState(initialState, selectedTourAction.addErrorRunTour(newError))).toEqual({
            ...initialState,
            errorsRunTour: [newError]
        });
        expect(selectedTourState({...initialState, errorsRunTour: errorList}, selectedTourAction.addErrorRunTour(newError))).toEqual({
            ...initialState,
            errorsRunTour: [...errorList, newError]
        });
    });
});