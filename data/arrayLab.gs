/**
 * 
 * @arr2d {array} of arrays
 * 
 * @return {int} last not-empty row
 */
// function test_get_2d_last() {
//   var arr = [['ddd'], ['ddd'], ['']];
//   var res = get_2d_last_(arr);
//   console.log(res);
// }
function get_2d_last_(arr2d) {
  var last = 0, row = [];
  var i = arr2d.length-1;
  var isRowEmpty_ = function(row) {
    var e = true;
    for (var i = 0; i < row.length; i++) {
      if (row[i] !== '') {
        e = false;
      }
    }
    return e;
  }
  while (i >= 0 && last === 0) {
    row = arr2d[i];
    if (!isRowEmpty_(row)) {
      last = i;
    }
    i--;
  }
  return last+1;
}



/**
 * return new array of values
 * up to the last not-empty row
 * 
 * returns first row only 
 * if all rows are empty
 * 
 * @arr2d {array} of arrays
 * 
 * @return {array} of arrays
 */
// function test_trim_2d_down() {
//   var arr = [['ddd'], ['']];
//   var res = trim_2d_down_(arr);
//   console.log(res);
// }
function trim_2d_down_(arr2d) {
  var last = get_2d_last_(arr2d);
  var res = arr2d.slice(0, last);
  return res;
}



/**
 * converts 2d array to 1 d
 * direction: 
 * rows → columns
 * 
 * @arr2d {array} of arrays
 * 
 * @return {array}
 */
// function test_convert_2d_1d() {
//   var arr = [[1], [2], [2, 4]];
//   console.log(convert_2d_1d_(arr));
// }
function convert_2d_1d_(arr2d) {
  var res = [];
  for (var i = 0; i < arr2d.length; i++) {
    for (var ii = 0; ii < arr2d[i].length; ii++) {
      res.push(arr2d[i][ii]);
    }
  }
  return res;
}



/**
 * get array filled with value
 * 
 * @return {array}
 */
function get_1d_(val, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(val);
  }
  return arr;
}



/**
 * Appends 2d array rows
 * to fixed width
 * fill with blancs
 * 
 * @return {array}
 */
// function test_scale_2d_width() {
//   var arr = [
//     [1,2,3],
//     [1,2],
//     [1]
//   ];
//   var res = scale_2d_width_(arr, 3);
//   console.log(res);
// }
function scale_2d_width_(arr, width) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    res.push(arr[i]);
  }
  var row = [];
  for (var i = 0; i < res.length; i++) {
    row = res[i];
    for (var ii = row.length; ii < width; ii++) {
      res[i].push('');
    }
  }
  return res;
}



/**
 * get missing numbers in array of numbers 
 * 
 * 
 * @arr {array} of numbers or blank cells
 * 
 * @retuen {array} of numbers or empty
 */
// function test_1d_missingintegers() {
//   var arr = [2, 1, '', '5', 7, ''];
//   var res = get_1d_missingintegers_(arr);
//   console.log(res); // [ 3, 4, 6 ]
// }
function get_1d_missingintegers_(arr) {
  var min, max, val;
  var obj_check = {};
  for (var i = 0; i < arr.length; i++) {
    val = arr[i];
    if (arr[i] !== '') {
      val = parseInt(arr[i]);
      min = min || val;
      max = max || val;
      if (val > max) {
        max = val;
      }
      if (val < min) {
        min = val;
      }
    }
    obj_check[val] = true;
  }
  var res = [];
  for (var k = min; k <= max; k++) {
    if (!obj_check[k]) {
      res.push(k);
    }
  }
  // console.log(min);
  // console.log(max);
  return res;
}


/**
 * convert array of sorted numbers
 * to object of groups of numbers
 * 
 * [1,2,3,  4,5,   8,9] →
 * [
 *   {start: 1, end: 5, count: 5},
 *   {start: 8, end: 9, count: 2},
 * ]
 * 
 * 
 * @arr {array} of sorted numbers
 * 
 * @retuen {array} of objects with desired ranges
 */
// function test_groupNumbers() {
//   var array = [1,2,3,4,5,   8,9, 500, 501];
//   var res = groupNumbers_(array);
//   console.log(res);
//   // [ { start: 1, end: 5, count: 5 },
//   //   { start: 8, end: 9, count: 2 },
//   //   { start: 500, end: 501, count: 2 } ]
// }
function groupNumbers_(array) {
  var i = 0;
  var node = {
    start: array[i], 
    end: array[i],
    count: 1
  }
  var res = [node];
  for (i = 1; i < array.length; i++) {
    if (array[i-1]+1 === array[i]) {
      node.end++;
      node.count++;
    } else {
      node = {
        start: array[i], 
        end: array[i],
        count: 1
      }
      res.push(node);
    }
  }
  return res;
}
