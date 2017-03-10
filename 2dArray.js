/*
http://stackoverflow.com/questions/4492678/swap-rows-with-columns-transposition-of-a-matrix-in-javascript
  * Try:
    ------------------------------------------------------------
    function TESTtranspose() {  
      Logger.log(transpose([[1,2,3],[4,5,6],[7,8,9]]));
    }
    ------------------------------------------------------------
  * Result:
     [[1.0, 4.0, 7.0], [2.0, 5.0, 8.0], [3.0, 6.0, 9.0]]
*/
function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length ? a.length : 0,
    h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}


/* Extract Columns From Table Data
  
  * Det data from simple table
  
  data = []
 [[ 'Name'  ,'Age', 'Sal'],
  [ 'Tom'   ,   18,   500],  
  [ 'Mike'  ,   25,    15],
  [ 'Max'   ,   30,  2000]]
  
  columns = []
  ["Name", "Sal"]
  
  return = [] 
  only selected columns
  | Name  | Sal |
  | Tom   |  500|
  | Mike  |   15|
  | Max   | 2000|  

*/
function extrectColumnsFromTableData(data, columns) {
  var indexs = [];    
  var head = data[0];
  
  for (var i = 0; i < head.length; i++) {
    if (columns.indexOf(head[i]) > -1) { indexs.push(i); }    
  }
  
  if (indexs == []) { return []; }
  
  var result = [];
  var row = [];
  
  for (var i = 1; i < data.length; i++) {
    row = [];
    for (var j = 0; j < indexs.length; j++) { row.push(data[i][indexs[j]]); }                
    result.push(row);
  }
    
  return result;
}

function TESTextrectColumnsFromTableData() {
  var data = [[ 'Name'  , 'Age', 'Sal'],
              [ 'Tom'   ,   18,   500],  
              [ 'Mike'  ,   25,    15],
              [ 'Max'   ,   30,  2000]];
  
  var columns = ["Name", "Sal"];
  
  Logger.log(extrectColumnsFromTableData(data, columns)); 
              /*
                [[Tom, 500.0], 
                 [Mike, 15.0], 
                 [Max, 2000.0]]  
              */ 
}


/*

input:
  * arr        [[0,0,1],[2,3,3],[4,4,5]];
  

result:        ["0", "0", "1", "2", "3", "3", "4", "4", "5"] 

Othe possidle way:
http://stackoverflow.com/questions/14824283/convert-a-2d-javascript-array-to-a-1d-array
  function convert2dArrayTo1d(arrToConvert) {
    var newArr = [];
    for(var i = 0; i < arrToConvert.length; i++)
      {
          newArr = newArr.concat(arrToConvert[i]);
      } 
    return newArr;  
  }
*/
function get1DArray(arr){
    return arr.join().split(",");
}
