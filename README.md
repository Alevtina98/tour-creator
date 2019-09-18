devtools.html -> devtools.js (создание вкладки в devtools) -> panel.html -> /build/ui.bundler.js
**UI**:
1) index.tsx (после получения сообщения "load" рендерится MainContainer, содержащий MainComponent) 
2) components/Main.tsx (MainComponent - компонент-представление)
3) AgentHandler.ts (вызывает обработчик по полученному от background сообщению:
"connected" -  
"tick" -  изменение значения selector
"enabledSelectMode" - 
"disabledSelectMode" -
"reloaded" - вызов injectDebugger)
    agent -> content-script.js -> background.js -> [devtools]
4) injectDebugger.ts (посылаем сообщение "connect", иначе отправляем /build/agent.bundle.js (если агент еще не введен))
    agent <- content-script.js <- background.js <- [devtools]
**AGENT:**
1) index.js (отправка сообщения "locatedCoquette")
2) Agent.js (вызывает обработчик по полученному от content-script сообщению:
"connected" - оповещение, что devtools открыты
"subscribeToEntity" -  
"unsubscribeFromEntity" - 
"enableSelectMode" -
"disableSelectMode" - )
    [agent] -> content-script.js -> background.js -> devtools




agent <-> content-script.js <-> [background.js] <-> devtools
background.js - 

agent <-> [content-script.js] <-> background.js <-> devtools
content-script.js - 