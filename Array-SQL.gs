  var C_ARR1 = 
      [
        [1, 'm', 6.6],
        [2, 'm', 6.6],
        [3, 'm', 6.6],
        [4, 'm', 6.6],
        [5, 'm', 6.6],
        [6, 'm', 6.6],
        [7, 'm', 6.6]   
      ];
  
  var C_ARR2 = 
      [
        [1, 'n', 0.1],
        [6, 'n', 0.1],
        [8, 'n', 0.1]   
      ]; 

  var C_ARR3 = 
      [
        [9,  'o', 500.1],
        [10, 'o', 500.1],
        [3,  'o', 500.1]   
      ]; 


function test_get2JoinedTables()
{
  var ArraySql = 'Col1';
  Logger.log(get2JoinedTables_([C_ARR1, C_ARR2], ArraySql));
  //  [[1.0, n, 0.1], [2.0, m, 6.6], [3.0, m, 6.6], [4.0, m, 6.6], [5.0, m, 6.6], [6.0, n, 0.1], [7.0, m, 6.6], [8.0, n, 0.1]]
  //    ^ Update                                                                   ^ Update                      ^ Insert
  
}
function get2JoinedTables_(datas, ArraySql)
{
  // ArraySql = "ColN"
  var result = [];
  var index = ArraySql.match(/\d+$/gm) * 1;
  
  return join2Arrays_(index, datas[0], datas[1]);
  
}


function test_join2Arrays()
{ 
  var index = 1; // number of column
  Logger.log(join2Arrays_(index, C_ARR1, C_ARR2));
  //  [[1.0, n, 0.1], [2.0, m, 6.6], [3.0, m, 6.6], [4.0, m, 6.6], [5.0, m, 6.6], [6.0, n, 0.1], [7.0, m, 6.6], [8.0, n, 0.1]]
  //    ^ Update                                                                   ^ Update                      ^ Insert
    
}

/*
  Makes an update with insert by ID.
  
  arr1  --  Array with key data, leave this data and fill it with the data from arr2
  index --  The column number (index of array 0 = column 1!) of IDs. 
  
  The resulting table has 
       [IDs & data] from arr1 
     + [IDs & data] matched from arr2, preserving the position of elements of arr1
     + [IDs & data] not matched from arr2, in the order they were in arr2 
*/             
function join2Arrays_(index, arr1, arr2)
{
  
  var result = [];
  
  var returnKey_ = function(row) { return row[index - 1]; }
  var newKeys = arr2.map(returnKey_);
  
  
  
  // replace existing
  var key = null;
  var row = [];
  var newRow = [];
  var newPos = -1;
  var ll = arr1[0].length;
  
  var indexsDelete = {};
  for (var i = 0, l = arr1.length; i < l; i++)        
  {
    row = arr1[i];
    key = row[index - 1];
    
    newPos = newKeys.indexOf(key);
        
    if (newPos > -1)
    {
      newRow = arr2[newPos];
      result.push(newRow);
      // delete element from array
      indexsDelete['' + newPos] = 'ok';
    }
    else { result.push(row); }    
  }

  // add new rows
  for (var i = 0, l = arr2.length; i < l; i++)
  {
    if (indexsDelete[i] !== 'ok') { result.push(arr2[i]); }    
  }
    
    
  return result;  
}


function test_joinArrays()
{
  
  Logger.log(joinArrays_(1, [C_ARR1, C_ARR2, C_ARR3]));
  
}

/*
   Array #1     -- array with key data, leave this data and fill it with the data from other arrays
   Other Arrays -- concatnate other arrays, then join the result with array #1
*/
function joinArrays_(index, arrays)
{
  // Get Array #1
  var array1 = arrays[0];
  
  // Get Other Arrays
  var otherArrays = arrays.splice(1);  
  var mergedArray = [];  
  var concatMergedArray_ = function(array) { mergedArray = mergedArray.concat(array); };
  otherArrays.forEach(concatMergedArray_);
  
  // Join 2 Arrays
  return join2Arrays_(index, array1, mergedArray);
  
  
}
