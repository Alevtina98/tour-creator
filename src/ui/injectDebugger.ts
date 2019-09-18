import sendMessage from "./util/sendMessage";
// thx https://github.com/emberjs/ember-inspector/blob/master/app/adapters/chrome.js
const injectDebugger = function () {
  /* jshint evil: true */

  const injectedGlobal = 'window.__coquette_inspect_agent_injected__';

  chrome.devtools.inspectedWindow.eval(injectedGlobal, function (result) {

    //Функция, вызываемая по завершении оценки
    if (!result) {

      // script hasn't been injected yet
      const xhr = new XMLHttpRequest();
      xhr.open('GET', chrome.extension.getURL('/build/agent.bundle.js'), false);
      xhr.send();
      const script = xhr.responseText;

      chrome.devtools.inspectedWindow.eval(script, function (result, err) {
        if (err) {
          console.error(err.value);
        }

        sendMessage('connect');
      });
    } else {
      // we're already injected, so just connect
      sendMessage('connect');
    }

  });
};

export default injectDebugger;

