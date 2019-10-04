// Сделано для отключения обрбаотки extension
let isDisabled = false;
if (!chrome.runtime) {
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
if (!chrome.devtools) {
    chrome.devtools = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        inspectedWindow: {
            tabId: 1
        }
    };
}

let backgroundPageConnection;

if (isDisabled) {
    backgroundPageConnection = chrome.runtime.connect({
        name: "panel"
    });

    backgroundPageConnection.postMessage({
        name: "init",
        tabId: chrome.devtools.inspectedWindow.tabId
    });
}

export default isDisabled ? chrome.runtime.connect() : backgroundPageConnection;
