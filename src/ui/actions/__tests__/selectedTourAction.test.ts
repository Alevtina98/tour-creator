import * as selectedTourAction from "../selectedTourAction";
import selectedTourState from "../../reducers/selectedTourReducer";
import createMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import IDB from "../../util/indexedDB";
import { cleanup } from "@testing-library/react";
import "fake-indexeddb/auto";
import { getInitData, TourType } from "../../util/restClient/requestTour";

const initTour: TourType = getInitData();
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
const testListTourNew: TourType[] = [
    ...testListTour,
    getInitData({
        id: 4,
        name: "custom name5"
    })
];

describe("selectedTourAction", function() {
    beforeEach(cleanup);
    const initialState = {
        tourDB: testListTour[0],
        tourXML: "<xml/>",
        blocklyReloadEnabled: false,
        listTour: testListTour,
        tourJS: "",
        errorsRunTour: []
    };
    const middlewares: any[] = [thunk];
    const mockStore = createMockStore(middlewares);
    let periodicallySaveTimer = 0;
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
        expect(selectedTourAction.setTourDB(testListTour[0])).toEqual({
            payload: testListTour[0],
            type: "SET_TOUR"
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
        expect(selectedTourState(initialState, selectedTourAction.setTourDB(testListTour[2]))).toEqual({
            ...initialState,
            tourDB: testListTour[2]
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
    it("should dispatch actions (for action loadListTour)", async () => {
        const testStore = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTourNew.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        await selectedTourAction.loadListTour(testListTourNew)(testStore.dispatch);
        expect(testStore.getActions()).toEqual([
            {
                payload: testListTourNew,
                type: "SET_LIST_TOUR"
            }
        ]);
    });
    it("should dispatch actions (for action saveDescTour)", async () => {
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        //текущего тура
        await selectedTourAction.saveDescTour({ ...testListTour[0], name: "new name", desc: "new desc" })(
            store.dispatch,
            store.getState
        );
        const result = await (await IDB()).getAll("script");
        const newdateChange = store.getActions()[0].payload.dateChange;
        expect(store.getActions()).toEqual([
            {
                payload: { ...testListTour[0], name: "new name", desc: "new desc", dateChange: newdateChange },
                type: "SET_TOUR"
            },
            {
                payload: result,
                type: "SET_LIST_TOUR"
            }
        ]);
        store.clearActions();
        //другого тура
        await selectedTourAction.saveDescTour({ ...testListTour[2], name: "new name", desc: "new desc" })(
            store.dispatch,
            store.getState
        );
        const result2 = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                payload: result2,
                type: "SET_LIST_TOUR"
            }
        ]);
    });
    it("should dispatch actions (for action delToDb)", async () => {
        periodicallySaveTimer = 10;
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        //текущего тура
        await selectedTourAction.delToDb(testListTour[0].id)(store.dispatch, store.getState);
        const result = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                type: "SET_RELOAD_BLOCKLY_DISABLED"
            },
            {
                payload: result,
                type: "SET_LIST_TOUR"
            }
        ]);
        store.clearActions();
        //другого тура
        await selectedTourAction.delToDb(testListTour[2].id)(store.dispatch, store.getState);
        const result2 = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                payload: result2,
                type: "SET_LIST_TOUR"
            }
        ]);
    });
    it("should dispatch actions (for action periodicallySave) after each 5 second", async () => {
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        jest.useFakeTimers();
        await selectedTourAction.periodicallySave()(store.dispatch, store.getState);
        //const newdateChange = store.getActions()[0].payload.dateChange;
        expect(store.getActions()).toEqual([]);
        jest.advanceTimersByTime(5000);
        //const newdateChange = store.getActions()[0].payload.dateChange;
        const newdateChange = dateChange();
        const result = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange
                },
                type: "SET_TOUR"
            },
            {
                payload: result,
                type: "SET_LIST_TOUR"
            }
        ]);
        jest.advanceTimersByTime(5000);
        const newdateChange2 = dateChange();
        //const newdateChange2 = store.getActions()[2].payload.dateChange;
        const result2 = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange
                },
                type: "SET_TOUR"
            },
            {
                payload: result,
                type: "SET_LIST_TOUR"
            },
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange2
                },
                type: "SET_TOUR"
            },
            {
                payload: result2,
                type: "SET_LIST_TOUR"
            }
        ]);
        jest.advanceTimersByTime(5000);
        //const newdateChange3 = store.getActions()[4].payload.dateChange;
        const newdateChange3 = dateChange();
        const result3 = await (await IDB()).getAll("script");
        expect(store.getActions()).toEqual([
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange
                },
                type: "SET_TOUR"
            },
            {
                payload: result,
                type: "SET_LIST_TOUR"
            },
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange2
                },
                type: "SET_TOUR"
            },
            {
                payload: result2,
                type: "SET_LIST_TOUR"
            },
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange3
                },
                type: "SET_TOUR"
            },
            {
                payload: result3,
                type: "SET_LIST_TOUR"
            }
        ]);
        jest.clearAllTimers();
    });
    it("should dispatch actions (for action loadToDb)", async () => {
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        await selectedTourAction.loadToDb(testListTour[2].id)(store.dispatch);
        expect(store.getActions()).toEqual([
            {
                type: "SET_RELOAD_BLOCKLY_DISABLED"
            },
            {
                payload: testListTour[2],
                type: "SET_TOUR"
            },
            {
                type: "SET_RELOAD_BLOCKLY_ENABLED"
            }
        ]);
    });
    it("should dispatch actions (for action createNewTour)", async done => {
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        await selectedTourAction.createNewTour("custom name5 NEW tour", "custom description5")(store.dispatch);
        const key = store.getActions()[2].payload.id;
        setTimeout(() => {
            expect(store.getActions()).toEqual([
                {
                    type: "SET_RELOAD_BLOCKLY_DISABLED"
                },
                {
                    payload: initTour,
                    type: "SET_TOUR"
                },
                {
                    payload: {
                        ...initTour,
                        name: "custom name5 NEW tour",
                        desc: "custom description5",
                        key: key
                    },
                    type: "SET_TOUR"
                },
                {
                    type: "SET_RELOAD_BLOCKLY_ENABLED"
                }
            ]);
            done();
        }, 5);
    });
    it("should dispatch actions (for action createCopyTour)", async done => {
        const store = mockStore({ SelectedTourState: initialState });
        const promiseAdd = testListTour.map(async el => await (await IDB()).add("script", el, el.id));
        await Promise.all(promiseAdd);
        await selectedTourAction.createCopyTour("custom name5 COPY tour", "custom description5")(
            store.dispatch,
            store.getState
        );
        const key = store.getActions()[2].payload.id;
        setTimeout(() => {
            expect(store.getActions()).toEqual([
                {
                    type: "SET_RELOAD_BLOCKLY_DISABLED"
                },
                {
                    payload: initTour,
                    type: "SET_TOUR"
                },
                {
                    payload: {
                        ...initTour,
                        name: "custom name5 COPY tour",
                        desc: "custom description5",
                        code: store.getState().SelectedTourState.tourXML,
                        key: key
                    },
                    type: "SET_TOUR"
                },
                {
                    type: "SET_RELOAD_BLOCKLY_ENABLED"
                }
            ]);
            done();
        }, 5);
    });
    it("should dispatch actions (for action saveSelectedTour)", async () => {
        const store = mockStore({ SelectedTourState: initialState });
        await selectedTourAction.saveSelectedTour()(store.dispatch, store.getState);
        const newdateChange = store.getActions()[0].payload.dateChange;
        expect(store.getActions()).toEqual([
            {
                payload: {
                    ...initialState.tourDB,
                    code: initialState.tourXML,
                    dateChange: newdateChange
                },
                type: "SET_TOUR"
            }
        ]);
    });
    it("should dispatch actions (for action closeSelectedTour)", () => {
        const store = mockStore({ SelectedTourState: initialState });
        store.dispatch(selectedTourAction.closeSelectedTour());
        expect(store.getActions()).toEqual([
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
