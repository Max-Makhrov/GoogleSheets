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


/**
 * @param {Object} data
 * @param {String} key
 * @param {String} nestKey
 * 
 * @returns {Arary<Array>}
 */
function nestedJson2rectangle_(data, key, nestKey) {
  var maxDepth = 0;
  function recursiveCreateArray(obj, depth) {
    if (maxDepth < depth) maxDepth = depth;
    var row = Array(depth).fill('');
    row.push(obj[key]);

    result.push(row);

    if (Array.isArray(obj[nestKey])) {
      obj[nestKey].forEach((folder) => {
        recursiveCreateArray(folder, depth + 1);
      });
    }
  }

  var result = [];
  recursiveCreateArray(data, 0);

  for (var i = 0; i < result.length; i++) {
    for (var ii = 0; ii < maxDepth+1; ii++) {
      result[i][ii] = result[i][ii] || '';
    }
  }

  return result;
}

/**
 * @param {Arary<Array>} arr
 * @param {String} key
 * @param {String} nestKey
 * 
 * @returns {Object}
 */
function rectangle2nestedJson_(arr, key, nestKey) {
  const result = { [key]: "", [nestKey]: [] };
  const stack = [result];

  for (const item of arr) {
    const name = item.find(x => x);
    const depth = item.findIndex(x => x);

    if (name) {
      const obj = { [key]: name, [nestKey]: [] };

      if (depth < stack.length) {
          stack.length = depth + 1;
      }

      stack[stack.length - 1][nestKey].push(obj);
      stack.push(obj);
    }
  }

  return result;
}
