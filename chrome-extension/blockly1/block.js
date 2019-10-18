
/**
 * Returns the language-neutral value from the field of a block.
 * @param {string} name The name of the field.
 * @return {?string} Value from the field or null if field does not exist.
 */
Blockly.Block.prototype.getFieldValue = function(name) {
  var field = this.getField(name);
  if (field) {
    //console.log("Имя функции >> ", field.getValue());
    return field.getValue();

  }
  //console.log("Функция без имени");
  return null;
};
