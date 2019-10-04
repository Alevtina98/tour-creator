if (!chrome.runtime) {
    chrome.runtime = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        connect: () => {
            return {
                postMessage: () => {},
                onMessage: {
                    addListener: () => {},
                },
            };
        },
    };
}
if (!chrome.devtools) {
    chrome.devtools = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        inspectedWindow: {
            tabId: 1,
        },
    };
}

const backgroundPageConnection = chrome.runtime.connect({
    name: "panel",
});

backgroundPageConnection.postMessage({
    name: "init",
    tabId: chrome.devtools.inspectedWindow.tabId,
});

export default backgroundPageConnection;
