/**
 * Get running total for the array of numbers
 * by makhrov.max@gmail.com
 * 
 * @param {array} numbers The array of numbers
 * @param {number} total_types (1-dafault) sum, (2) avg, (3) min, (4) max, (5) count;
 *                  1-d array or number
 * @param {number} limit number of last values to count next time. 
 *                 Set to 0 (defualt) to take all values
 * @param {array} keys (optional) array of keys. Function will group result by keys
 * @return The hex-code of cell background & font color
 * @customfunction
 */
function runningTotal(numbers, total_types, limit, keys) { 
  
  // possible types to return
  var oTypes = {
    '1': 'sum',
    '2': 'avg',
    '3': 'min',
    '4': 'max',
    '5': 'count'
  }
  // checks and defaults
  var errPre = '🥴 ';
  if( typeof numbers != "object" ) {
    numbers = [ [numbers] ];
  }
  total_types = total_types || [1];
  if( typeof total_types != "object" ) {
    total_types = [ total_types ];
  }
  if( keys && typeof keys != "object" ) {
    keys = [ [keys] ];
  }
  if (keys) {
    if (numbers.length !== keys.length) {
      throw errPre + 'Numbers(' + 
        numbers.length + 
        ') and keys(' + 
        keys.length + 
        ') are of different length'; }
  }
  // assign types
  var types = [], type, k;
  for (var i = 0; i < total_types.length; i++) {
    k = '' + total_types[i];
    type = oTypes[k];
    if (!type) {
      throw errPre + 'Unknown total_type = ' + k;
    }
    types.push(type);
  }
  limit = limit || 0;
  if (isNaN(limit)) {
    throw errPre + '`limit` is not a Number!';
  }
  limit = parseInt(limit);

  // calculating running totals
  var result = [], 
    subres = [], 
    nodes = {}, 
    key = '-', 
    val;
  var defaultNode_ = {
      values: [],
      count: 0,
      sum: 0,
      max: null,
      min: null,
      avg: null,
      maxA: Number.MIN_VALUE,
      maxB: Number.MIN_VALUE,
      maxC: Number.MIN_VALUE,
      minA: Number.MAX_VALUE,
      minB: Number.MAX_VALUE,
      minC: Number.MAX_VALUE
    };
  for (var i = 0; i < numbers.length; i++) {
    val = numbers[i][0];
    // find correct node
    if (keys) { key = keys[i][0]; }
    node = nodes[key] || 
      JSON.parse(JSON.stringify(defaultNode_));
    /**
     * For findig running Max/Min
     * sourse of algorithm
     * https://www.geeksforgeeks.org
     * /sliding-window-maximum-maximum-of-all-subarrays-of-size-k/
     */
    // max
    //reset first second and third largest elements
    //in response to new incoming elements
    if (node.maxA<val) {
      node.maxC = node.maxB;
      node.maxB = node.maxA;
      node.maxA = val;
    } else if (node.maxB<val) {
      node.maxC = node.maxB;
      node.maxB = val;
    } else if (node.maxC<val) {
      node.maxC = val;
    }
    // min
    if (node.minA>val) {
      node.minC = node.minB;
      node.minB = node.minA;
      node.minA = val;
    } else if (node.minB>val) {
      node.minC = node.minB;
      node.minB = val;
    } else if (node.minC>val) {
      node.minC = val;
    }

    // if limit exceeds
    if (limit !== 0 && node.count === limit) {
      //if the first biggest we earlier found
      //is matching from the element that
      //needs to be removed from the subarray
      if(node.values[0]==node.maxA) {
        //reset first biggest to second and second to third
        node.maxA = node.maxB;
        node.maxB = node.maxC;
        node.maxC = Number.MIN_VALUE;
        if (val <= node.maxB) {
          node.maxC = val;
        }
      } else if (node.values[0]==node.maxB) {
        node.maxB = node.maxC;
        node.maxC = Number.MIN_VALUE;
        if (val <= node.maxB) {
          node.maxC = val;
        }
      } else if (node.values[0]==node.maxC) {
        node.maxC = Number.MIN_VALUE;
        if (val <= node.maxB) {
          node.maxC = val;
        }
      } else if(node.values[0]==node.minA) {
        //reset first smallest to second and second to third
        node.minA = node.minB;
        node.minB = node.minC;
        node.minC = Number.MAX_VALUE;
        if (val > node.minB) {
          node.minC = val;
        }
      }
      if (node.values[0]==node.minB) {
        node.minB = node.minC;
        node.minC = Number.MAX_VALUE;
        if (val > node.minB) {
          node.minC = val;
        }
      } 
      if (node.values[0]==node.minC) {
        node.minC = Number.MAX_VALUE;
        if (val > node.minB) {
          node.minC = val;
        }
      }
      // sum
      node.sum -= node.values[0];
      // delete first value
      node.values.shift();
      // start new counter
      node.count = limit-1; 
    }
    // add new values
    node.count++;
    node.values.push(val);
    node.sum += val;
    node.avg = node.sum/node.count;
    node.max = node.maxA;
    node.min = node.minA;
    // remember entered values for the next loop
    nodes[key] = node;

    // get the result depending on 
    // selected total_types
    subres = [];
    for (var t = 0; t < types.length; t++) {
      subres.push(node[types[t]]);
    }
    result.push(subres);
  }
  // console.log(JSON.stringify(nodes, null, 4));
  return result;
}
