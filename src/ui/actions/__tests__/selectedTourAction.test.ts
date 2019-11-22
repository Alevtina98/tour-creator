import * as selectedTourAction from "../selectedTourAction";
import selectedTourState from "../../reducers/selectedTourReducer";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import IDB, { ScriptValue } from "../../util/indexedDB";
import { cleanup } from "@testing-library/react";
import "fake-indexeddb/auto";
import { StoreType } from "../../reducers";

const initTour: ScriptValue = {
    name: "",
    date: "",
    desc: "",
    code: "",
    key: ""
};
const testTour: ScriptValue = {
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    desc: "custom description",
    date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
};
const testTourNew: ScriptValue = {
    key: "custom-key5",
    name: "custom name5",
    code: "<xml/>",
    desc: "custom description5",
    date: "Thu Oct 30 2019 09:32:45 GMT+0300 (Москва, стандартное время)"
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
const testListTourNew: ScriptValue[] = [
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
    },
    {
        key: "custom-key5",
        name: "custom name5",
        code: "<xml/>",
        desc: "custom description5",
        date: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)"
    }
];

describe("inspectAction", function() {
    beforeEach(cleanup);
    const initialState = {
        tourDB: testTour,
        tourXML: "<xml/>",
        blocklyReloadEnabled: false,
        listTour: testListTour,
        tourJS: ""
    };
    it("should return correct type", () => {
        expect(selectedTourAction.setLoadBocklyEnabled()).toEqual({
            type: "SET_RELOAD_BLOCKLY_ENABLED"
        });
        expect(selectedTourAction.setLoadBocklyDisabled()).toEqual({
            type: "SET_RELOAD_BLOCKLY_DISABLED"
        });
        expect(selectedTourAction.setListTour(testListTour)).toEqual({
            payload: testListTour,
            type: "SET_LIST_TOUR"
        });
        expect(selectedTourAction.setTourDB(testTour)).toEqual({
            payload: testTour,
            type: "SET_TOUR"
        });
        expect(selectedTourAction.setTourXML("<xml/>")).toEqual({
            payload: "<xml/>",
            type: "SET_TOUR_XML"
        });
        expect(selectedTourAction.setTourJS("")).toEqual({
            payload: "",
            type: "SET_TOUR_JS"
        });
    });
    it("should change state (for standard action)", () => {
        expect(selectedTourState(initialState, selectedTourAction.setLoadBocklyEnabled())).toEqual({
            ...initialState,
            blocklyReloadEnabled: true
        });
        expect(selectedTourState(initialState, selectedTourAction.setLoadBocklyDisabled())).toEqual({
            ...initialState,
            blocklyReloadEnabled: false
        });
        expect(selectedTourState(initialState, selectedTourAction.setListTour(testListTourNew))).toEqual({
            ...initialState,
            listTour: testListTourNew
        });
        expect(selectedTourState(initialState, selectedTourAction.setTourDB(testTourNew))).toEqual({
            ...initialState,
            tourDB: testTourNew
        });
        expect(selectedTourState(initialState, selectedTourAction.setTourXML("NEW<xml/>"))).toEqual({
            ...initialState,
            tourXML: "NEW<xml/>"
        });
        expect(selectedTourState(initialState, selectedTourAction.setTourJS("NEW"))).toEqual({
            ...initialState,
            tourJS: "NEW"
        });
    });
    it("should dispatch actions (for function action)", async () => {
        const middlewares: any[] = [thunk];
        const mockStore = createMockStore(middlewares);
        const testStore = mockStore({ SelectedTourState: initialState });
        //Загрузка
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.key));
        await Promise.all(promiseAdd);
        testStore.dispatch(selectedTourAction.loadListTour()).then(() => {
            expect(testStore.getActions()).toEqual([
                {
                    payload: testListTour,
                    type: "SET_LIST_TOUR"
                }
            ]);
        });
        //Редактирование описания
        await (await IDB()).put("script", { ...testTour, name: "old test name", desc: "old test desc" }, testTour.key);
        await selectedTourAction.saveDescTour(testTour)(testStore.dispatch, testStore.getState);
        expect(testStore.getActions()).toEqual([
            {
                /*payload: testTour,
                type: "SET_LIST_TOUR"*/
            }
        ]);
        //Закрытие
        // await (await IDB()).delete("script", "anyKey");
        testStore.dispatch(selectedTourAction.closeSelectedTour());
        expect(testStore.getActions()).toEqual([
            {
                type: "SET_RELOAD_BLOCKLY_DISABLED"
            },
            {
                payload: initTour,
                type: "SET_TOUR"
            }
        ]);
    });
});
