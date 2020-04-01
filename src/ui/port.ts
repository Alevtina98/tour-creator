export interface postMessageParams {
    name: string,
    data?: {}
    tabId?: number,
}
// Сделано для отключения обрбаотки extension
const notTest = process.env.NODE_ENV !== "test";
export const testPort = {
    postMessage: (obj: postMessageParams) => null
};
let isDisabled = false;

if (notTest && !chrome.runtime && !isDisabled) {
    isDisabled = true;
    chrome.runtime = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        connect: () => {
            return {
                postMessage: () => {},
                onMessage: {
                    addListener: () => {}
                }
            };
        }
    };
}
if (notTest && !chrome.devtools) {
    chrome.devtools = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        inspectedWindow: {
            tabId: 1
        }
    };
}

let backgroundPageConnection;

if (notTest && !isDisabled) {
    backgroundPageConnection = chrome.runtime.connect({
        name: "panel"
    });

    backgroundPageConnection.postMessage({
        name: "init",
        tabId: chrome.devtools.inspectedWindow.tabId
    });
}

export default notTest ? ( isDisabled ? chrome.runtime.connect() : backgroundPageConnection) : testPort;
