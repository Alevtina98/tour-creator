import TourHelper from "C:/workspace/tour-creator/src/agent/TourHelper/utils.tsx";

export const testTour = () => {
    var element;
    element = 'body';
    TourHelper.blackout(element);
    TourHelper.description(element, 'Посмотрите сюда');
    element = 'body>p:nth-child(3)';
    TourHelper.description(element, 'И сюда');
    TourHelper.blackout(element);
    TourHelper.blocklyStep(function(){ return TourHelper.click()});
    TourHelper.description(element, 'А теперь сюда');
    TourHelper.blackout(element);
    TourHelper.blocklyStep(function(){ return TourHelper.click()});
    element = 'body>p:nth-child(10)';
    TourHelper.blackout(element);
    TourHelper.description(element, 'А еще есть это - кликните сюда');
    TourHelper.blocklyStep(function(){ return TourHelper.clickOn(element)});
    element = 'body>p:nth-child(15)';
    TourHelper.blackout(element);
    TourHelper.description(element, 'И даже вот это!');
};