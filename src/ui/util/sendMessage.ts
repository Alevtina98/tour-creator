import port from "../port";

const sendMessage = function (name: string, data?: any) {
  port.postMessage({
    name: name,
    tabId: chrome.devtools.inspectedWindow.tabId,
    data: data || {}
  });
};

export default sendMessage;

