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
