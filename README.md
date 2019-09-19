###### agent <-> content-script <-> background <-> devtools

# devtools-page

devtools.html -> devtools.js (создание вкладки в devtools) -> panel.html -> /build/**ui.bundler.js**

## UI

(C:\workspace\tour-creator\src\ui)

### \store

### \actions

### \reducer

### \components
#### Main.tsx
 
MainComponent - компонент-представление, содержит обработчик onInspectClickHandler на кнопку включения инспекции, 
который отсылает сообщения 'disableSelectMode' или 'enabledSelectMode'  
###### agent <- content-script <- background <- devtools <- [devtools - 'dis/en-ableSelectMode']

### index.tsx

После получения сообщения "load" рендерится MainContainer, содержащий MainComponent
        
### AgentHandler.ts

Вызывает обработчик по полученному от background сообщению:

 _connected_ - связь с инспектируемым окном установлена, событие CONNECTION_SUCCESS усанавливает состояние "connected: true" 
 
 _tick_ -  изменение значения selector
 
 _enabledSelectMode_ - инспектируемое окно ожидает клика 
 
 _disabledSelectMode_ - 
 
 _reloaded_ - вызов injectDebugger
    
### injectDebugger.ts

посылаем сообщение 'connect', если агент еще не введен, отправляем /build/**agent.bundle.js**     
###### agent <- content-script <- background <- devtools <- [devtools - 'connect']

## AGENT

(C:\workspace\tour-creator\src\agent)

### index.js

отправка сообщения "locatedCoquette" (кому?))

###Agent.js

вызывает обработчик по полученному от content-script сообщению:

_connect_ - оповещение, что devtools открыты, отправка ответного 'connected'`
###### [agent - 'connected'] -> content-script -> background -> devtools 

_subscribeToEntity_ -  ?

_unsubscribeFromEntity_ - ?

_enableSelectMode_ - включен режим инспекции, подтверждение, добавляется обработчик _findTargetCb на 'click', отправляющий 'tick' с селектором
###### [agent - 'enableSelectMode'] -> content-script -> background -> devtools 
###### [agent - 'tick'] -> content-script -> background -> devtools 
     
_disableSelectMode_ - режим инспекции отменен, подтверждение, обработчик удаляяется
###### [agent - 'disabledSelectMode'] -> content-script -> background -> devtools 
            
# background

background.js 

# content-scripts

content-script.js 