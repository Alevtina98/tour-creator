import * as selectedTourAction from "../selectedTourAction";
import selectedTourReducer from "../../reducers/selectedTourReducer";
import { ScriptValue } from "../../util/indexedDB";

const testTourDB: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
const testListTour: ScriptValue[] = [
    {
        key: "custom-key",
        name: "custom name",
        code: "<xml/>",
        desc: "custom description",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    },
    {
        key: "custom-key2",
        name: "custom name2",
        code: "<xml/>",
        desc: "custom description2",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    },
    {
        key: "custom-key3",
        name: "custom name3",
        code: "<xml/>",
        desc: "custom description3",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    },
    {
        key: "custom-key4",
        name: "custom name4",
        code: "<xml/>",
        desc: "custom description4",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    }
];
describe("inspectAction", function() {
    const initialState = {
        tourDB: testTourDB,
        tourXML: "<xml/>",
        isLoadingDB: false,
        blocklyReloadEnabled: false,
        listTour: testListTour,
        tourJS: ""
    };
    it("should return correct type", function() {
        expect(selectedTourAction.setLoadBocklyEnabled()).toEqual({
            type: "SET_RELOAD_BLOCKLY_ENABLED"
        });
    });
    it("should change state", function() {
        expect(selectedTourReducer(initialState, selectedTourAction.setLoadBocklyEnabled())).toEqual({
            ...initialState,
            blocklyReloadEnabled: true
        });
    });
});
