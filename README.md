###### agent <-> content-script <-> background <-> devtools

# devtools-page

devtools.html -> devtools.js (создание вкладки в devtools) -> panel.html -> /build/**ui.bundler.js**

## UI

(C:\workspace\tour-creator\src\ui)

### index.tsx

Точка входа. После получения сообщения "load" рендерится MainContainer, содержащий MainComponent

### \components

#### MainComponent
 
Функциональный компонент-представление (без props). 
Возвращает BlocklyComponent и интерфейс включенного режима инспекции. Оповещает Agent о смене режима: 

'enableSelectMode' - начало инспекции (произошло нажатие на блок Selector)
###### agent <- content-script <- background <- [devtools - 'enableSelectMode']
'disableSelectMode' - режим инспекции отменен 
###### agent <- content-script <- background <- [devtools - 'disableSelectMode']
Данный компонент хранит три состояния: 
1) isInspectEnabled - сигнализирует о вкл/откл режиме инспекции (ожидание получения селектора выделяемого элемента). 
Изменение данного состояния на стороне devtools контролирует функция onInspectClickHandler. 
Данная функция передается как props в BlocklyComponent (включение режима инспекции) 
и устанавливается как обработчик клика по кнопке Отмена (отключения режима инспекции).  
2) selector - хранит полученный из инспектируемого окна селектор, передается как props в BlocklyComponent
3) connected - используется только при тестрировании установления связи с инспектируемой страницей(см. ConnectionStatus.tsx). 

При первой отрисовке MainComponent (в качестве эффекта) инициализируется AgentHandler, предназначенный для обработки сообщений, получаемых со стороны Agent. 

#### BlocklyComponent
Компонент, основанный на классе. 

Props (приходят из MainComponent):
1) selector - устанавливается как текст в блок Selector
2) inspect - функция, срабатываемая при клике на блок Selector

States:
1) toolboxCategories
2) blockId - id блока, по которому произошел клик. 
        
### AgentHandler.ts

Вызывает обработчик по полученному от background сообщению:

 _connected_: связь с инспектируемым окном установлена, событие CONNECTION_SUCCESS усанавливает состояние "connected: true" 
 
 _tick_: изменение значения selector
 
 _enabledSelectMode_: включение режима инспекции 
 
 _disabledSelectMode_: отключение режима инспекции 
 
 _reloaded_: вызов injectDebugger
    
### injectDebugger.ts

Если агент еще не введен в инспектируемое окно, происходит отправка скрипта /build/**agent.bundle.js**     
###### inspected Window <- [devtools - agent.bundle.js]
 иначе отправка сообщения 'connect' - оповещение, что devtools открыт 
###### agent <- content-script <- background <- [devtools - 'connect']

## AGENT

(C:\workspace\tour-creator\src\agent)

### index.js

Отправка сообщения "locatedCoquette" (кому?))

###Agent.js

Вызов обработчика по полученному от content-script сообщению:

_connect_ - отправка ответного 'connected'
###### [agent - 'connected'] -> content-script -> background -> devtools 
_enableSelectMode_: добавление обработчика _findTargetCb на 'click', отправляющего 'tick' с селектором, 
отправка сообщения о том, что инспектируемое окно ожидает клик 
###### [agent - 'enableSelectMode'] -> content-script -> background -> devtools 
произошел клик
###### [agent - 'tick'] -> content-script -> background -> devtools 
оповещение о выключении в инспектируемом окне режима инспекции
###### [agent - 'disabledSelectMode'] -> content-script -> background -> devtools   
_disableSelectMode_ - удаление обработчика,  оповещение о выключении в инспектируемом окне режима инспекции
###### [agent - 'disabledSelectMode'] -> content-script -> background -> devtools 
            
# background

background.js 

# content-scripts

content-script.js 