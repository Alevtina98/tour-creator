import port from "../port";

const sendMessage = function (name, data) {
  port.postMessage({
    name: name,
    tabId: chrome.devtools.inspectedWindow.tabId,
    data: data || {}
  });
};

export default sendMessage;

