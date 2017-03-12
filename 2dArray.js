/*

  __  __             _             _       _       
 |  \/  |           (_)           | |     | |      
 | \  / | __ _ _ __  _ _ __  _   _| | __ _| |_ ___ 
 | |\/| |/ _` | '_ \| | '_ \| | | | |/ _` | __/ _ \
 | |  | | (_| | | | | | |_) | |_| | | (_| | ||  __/
 |_|  |_|\__,_|_| |_|_| .__/ \__,_|_|\__,_|\__\___|
                      | |                          
                      |_|                                           
*/


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



/* unpivot
    convert wide table into normal view


  input:
    * head1  →  [['Id', 'Date'      ]]
    * data1  →   [   1, '03-05-2050'],
                 [   2, '04-05-2050'],
                 [   3, '05-05-2050'],
                 [   4, '06-05-2050']]
      
    * head2  →  [['Plan'  , ''      , 'Fact'  , ''      ],
                 ['Sales' , 'Profit', 'Sales' , 'Profit']]
    * data2  →  [[   120.2,     12.5,    135.7,     13.0],
                 [   121.2,     12.8,    125.0,     10.1],
                 [   122.2,     13.4,    138.2,     18.6],
                 [   123.2,     14.5,    155.8,     23.2]]
    
    * labels →   ['PlanFact', 'Metric', 'Volume']            


  result
    * array
                 [[Id,   Date,       PlanFact, Metric, Volume], 
                   [1.0, 03-05-2050, Plan,     Sales,   120.2], 
                   [1.0, 03-05-2050, Plan,     Profit,   12.5], 
                   [1.0, 03-05-2050, Fact,     Sales,   135.7], 
                   [1.0, 03-05-2050, Fact,     Profit,   13.0], 
                   [2.0, 04-05-2050, Plan,     Sales,   121.2], 
                   [2.0, 04-05-2050, Plan,     Profit,   12.8], 
                   [2.0, 04-05-2050, Fact,     Sales,   125.0], 
                   [2.0, 04-05-2050, Fact,     Profit,   10.1], 
                   [3.0, 05-05-2050, Plan,     Sales,   122.2], 
                   [3.0, 05-05-2050, Plan,     Profit,   13.4], 
                   [3.0, 05-05-2050, Fact,     Sales,   138.2], 
                   [3.0, 05-05-2050, Fact,     Profit,   18.6], 
                   [4.0, 06-05-2050, Plan,     Sales,   123.2], 
                   [4.0, 06-05-2050, Plan,     Profit,   14.5], 
                   [4.0, 06-05-2050, Fact,     Sales,   155.8], 
                   [4.0, 06-05-2050, Fact,     Profit,   23.2]]
*/
function unpivot(head1, data1, head2, data2, labels) {
  var result = [];
  var headers = head1[0].concat(labels);
  result.push(headers);
  
  // fill head2
  head2 = fillRight2d(head2);
  // slice by rows
  var rightSide = [], leftSide = [], part = [], head2Clone = [];;
  for (var i = 0; i < data1.length; i++) {
    leftSide = data1[i];
    head2Clone = JSON.parse(JSON.stringify(head2)); 
    head2Clone.push(data2[i]);
    rightSide = transpose(head2Clone);
    part = addValuesToArray(leftSide, rightSide);
    result = result.concat(part);    
  }

  return result;
}


function TESTunpivot() {
  var head1 = [['Id', 'Date'      ]];
  var data1 = [[   1, '03-05-2050'],
               [   2, '04-05-2050'],
               [   3, '05-05-2050'],
               [   4, '06-05-2050']];
               
  var head2 = [['Plan'  , ''      , 'Fact'  , ''      ],
               ['Sales' , 'Profit', 'Sales' , 'Profit']];
  var data2 = [[   120.2,     12.5,    135.7,     13.0],
               [   121.2,     12.8,    125.0,     10.1],
               [   122.2,     13.4,    138.2,     18.6],
               [   123.2,     14.5,    155.8,     23.2]];
  
  var labels = ['PlanFact', 'Metric', 'Volume'];
  
  var result = unpivot(head1, data1, head2, data2, labels);
  
  Logger.log(result);

}

/*

   _____      _      _____      _                           
  / ____|    | |    / ____|    | |                          
 | |  __  ___| |_  | |     ___ | |_   _ _ __ ___  _ __  ___ 
 | | |_ |/ _ \ __| | |    / _ \| | | | | '_ ` _ \| '_ \/ __|
 | |__| |  __/ |_  | |___| (_) | | |_| | | | | | | | | \__ \
  \_____|\___|\__|  \_____\___/|_|\__,_|_| |_| |_|_| |_|___/
                                                            
                                                            

*/

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
              _     _    _____      _                           
     /\      | |   | |  / ____|    | |                          
    /  \   __| | __| | | |     ___ | |_   _ _ __ ___  _ __  ___ 
   / /\ \ / _` |/ _` | | |    / _ \| | | | | '_ ` _ \| '_ \/ __|
  / ____ \ (_| | (_| | | |___| (_) | | |_| | | | | | | | | \__ \
 /_/    \_\__,_|\__,_|  \_____\___/|_|\__,_|_| |_| |_|_| |_|___/
                                                                
*/

function TESTaddToArray() {

  var a = [[1, 'a'],
           [2, 'b'],
           [3, 'c']];
  
  var b = [[4, 'd'],
           [5, 'e'],
           [6, 'f']];
  //a.extend(b);  
  //a.push.apply(a, b)
  
  var c = addColumnsToArray(a, b);
  Logger.log(c); // the result: [[1, a, 4.0, d], [2, b, 5.0, e], [3, c, 6.0, f]]
  Logger.log(a); // remains
  Logger.log(b); // remains
  
  var d = [1, 'a'];
  
  var e = addValuesToArray(d, a);
  Logger.log(e); // the result:  
  //Logger.log(a); // remains
  //Logger.log(d); // remains  

}


/*
  arr1  = [[1, 'a'],
           [2, 'b'],
           [3, 'c']];
  
  arr2  = [[4, 'd'],
           [5, 'e'],
           [6, 'f']];
           
  result 
          [[1, 'a', 4, 'd'], 
           [2, 'b', 5, 'e'], 
           [3, 'c', 6, 'f']]
*/

function addColumnsToArray(arr1, arr2) {

  var self = this;
  this.arr2 = arr2;
  
  function appendColumns(currentValue, index) {  
    self.arr2[index].forEach(function(val) { currentValue.push(val); });
  }
  
  // to prevent affecting original array
  var arr = JSON.parse(JSON.stringify(arr1));
    
  arr.map(appendColumns);
  
  return arr;

}



/*
  arr1  =  [1, 'a'];
  
  arr2  = [[4, 'd'],
           [5, 'e'],
           [6, 'f']];
           
  result 
          [[1, 'a', 4, 'd'], 
           [1, 'a', 5, 'e'], 
           [1, 'a', 6, 'f']]
*/

function addValuesToArray(arr1, arr2) {

  var self = this;
  this.arr1 = arr1;
  
  function appendValues(currentValue) {
    return self.arr1.concat(currentValue);
  }
  
  // to prevent affecting original array
  var arr = JSON.parse(JSON.stringify(arr2));
  
  var result = arr.map(appendValues);
  
  return result;

}

/*

  ______ _ _ _ 
 |  ____(_) | |
 | |__   _| | |
 |  __| | | | |
 | |    | | | |
 |_|    |_|_|_|
                              

*/

/*
  Input
    * arr
    _______________
    [1, 2, 3, 4, 5]
    ---------------
    
    * value
    0
  
  Output
    * result
    _______________
    [0, 0, 0, 0, 0]
    --------------- 

*/

function fill(arr, value) {
  
  function returnValue() {
    return value;    
  }
  
  var result = arr.map(returnValue);

  return result;
}
function TESTfill() {
  var arr = [1, 2, 3, 4, 5];
  Logger.log(fill(arr, 0));
}


/*
  Input
    * arr
    __________________________
    ['Plan', '', 'Fact', '', '']
    --------------------------
  
  Output
    * arr -- affects original array!
    ________________________________________
    ['Plan', 'Plan', 'Fact', 'Fact', 'Fact']
    ----------------------------------------  

*/
function fillRight(arr) {
  var val = '';
  var filledVal = '';
  for (var i = 0; i < arr.length; i++) {
    val = arr[i];
    if (val != '') { filledVal = val; }
    else {arr[i] = filledVal; }  
  }  
}

function TESTfillRight() {
  var arr = ['Plan', '', 'Fact', '', ''];
  fillRight(arr);
  Logger.log(arr);
}

/*
  Input
    * arr
    __________________________
    [['Plan', '', 'Fact', ''],
     [1     , 2 , 3     , 4 ]]
    --------------------------
  
  Output 
    __________________________________
    [['Plan', 'Plan', 'Fact', 'Fact'],
     [1,    ,  2 ,     3     , 4    ]]
    ----------------------------------   

*/
function fillRight2d(arr) {
  // to prevent affecting original array
  var arr0 = JSON.parse(JSON.stringify(arr)); 
  arr0.forEach(fillRight);
  return arr0;

}
function TESTfillRight2d() {
  
  var arr =     [['Plan', '', 'Fact', ''],     [1,  2 , 3     , 4 ]];
  var result = fillRight2d(arr);
  
  Logger.log(result);
  Logger.log(arr);

}
