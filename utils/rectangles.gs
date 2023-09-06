/** @typedef {Array<Array>} Rectangle */

/**
 * @param {Array} arr
 * @param {Array} [rowPrepend]
 * @param {Array} [rowAppend]
 * 
 * @returns {Rectangle}
 */
function array2Rectangle_(arr, rowPrepend, rowAppend) {
  rowPrepend = rowPrepend || [];
  rowAppend = rowAppend || [];
  var res = [], row = []
  for (var i = 0; i < arr.length; i++) {
    row = rowPrepend.concat([arr[i]]).concat(rowAppend);
    res.push(row);
  }
  return res;
}


/**
 * @typedef {Object} OptionsObjects2Rectangle
 * @property {Array} [headers]
 * @property {Boolean} [skip_headers]
 */

/**
 * @param {Array<Object>} objects
 * @param {OptionsObjects2Rectangle} [options]
 * @returns {Rectangle}
 * TODO: to string conversions
 */
function objects2Rectangle_(objects, options) {
  options = options || {};
  var headers = options.headers || objects2headers_(objects);
  var result = [];
  var skipHeaders = options.skip_headers
  if (!skipHeaders) {
    result = [headers];
  }
  for (var i = 0; i < objects.length; i++) {
    result.push(object2Row_(objects[i], headers));
  }
  /**
    * @param {Array} arr
    * @param {Object} [keys] 
  */
  function array2Keys_(arr, keys) {
    keys = keys || {};
    for (var i = 0; i < arr.length; i++) {
      keys[arr[i]] = true;
    }
    return keys;
  }
  /**
   * @param {Array<Object>} objects
   * @returns {Array} headers
   */
  function objects2headers_(objects) {
  var oHeaders = {}, obj;
    for (var i = 0; i < objects.length; i++) {
      obj = objects[i];
      oHeaders = array2Keys_(Object.keys(obj), oHeaders);
    }
    var headers = Object.keys(oHeaders);
    return headers;
  }
  /**
   * @param {Object} object
   * @param {Array} headers
   * 
   * @returns {Array}
   */
  function object2Row_(object, headers) {
    var result = [], val;
    for (var i = 0; i < headers.length; i++) {
      val = object[headers[i]];
      result.push(val);
    }
    return result;
  }
  return result;
}
