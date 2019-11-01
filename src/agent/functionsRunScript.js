function select(el) {
    return document.querySelector(el)

}
function blackout (el) {
    var el = select(el);
    console.log('blackout FN', el);
}
function description (el, str) {
    var el = select(el);
    console.log('description FN', el, str);
}
