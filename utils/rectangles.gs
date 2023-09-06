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
 * @param {Array<Object>} objects
 * @param {Array<string>} keys
 * 
 * @returns {Rectangle}
 */
function objects2rectangle_(objects, keys) {
  var res = [], row = [];
  for (var i = 0; i < objects.length; i++) {
    row = object2row_(objects[i], keys);
    res.push(row);
  }
  return res;
}

/**
 * @param {Object} obj
 * @param {Array<string>} keys
 * 
 * @returns {Array} row
 */
function object2row_(obj, keys) {
  var row = [], val, k;
  for (var i = 0; i < keys.length; i++) {
    val = '';
    k = keys[i];
    if ( obj.hasOwnProperty(k) ) {
      val = obj[k]
    }
      row.push(val);
  }
  return row;
}
