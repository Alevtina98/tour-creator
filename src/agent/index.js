import Agent from "./Agent";

import sendMessage from "./util/sendMessage";

window.__coquette_inspect_agent_injected__ = true; //injectDebugger проверяет это значение
sendMessage("locatedCoquette");
// patchEntities(window.__coquette__);
new Agent(window);
// if (window.__coquette__) {
//
// } else {
//   sendMessage('noCoquetteFound');
// }
