/*----------------------------------- Gets -------------------------------------------------*/
function getDvValue(e) {
  var value = e.value;

  if (value == undefined) { value = ''; }
  if (typeof value == 'object') { value = ''; } 
  return value;  


}

/*----------------------------------- Checks -----------------------------------------------*/

/*
  function to keep active sheet for all trigger actions
*/
var FILE, SHEET;
function smallDiscovery() {
  FILE = SpreadsheetApp.getActiveSpreadsheet();
  SHEET = SpreadsheetApp.getActiveSheet();
}


/* check, if row of range is > then row of headers
  results:
  * 0 -- don't match
  * 1 -- match  
*/
function checkRowDv(row, rowHead) {  
  if (row <= rowHead) { return 0; }
  return 1;
}




/* check, column matches
  input:
    * col          -         10
    * cols         -         10 or [10,11] or "1,2,3"
    * delim        -         ","
  
  results:
    * 0 -- don't match
    * 1 -- match  
*/
function checkColDv(col, cols, delim) {

  // number
  if (typeof cols == "number") {
    if (cols == col) { return 1; }
    return 0;      
  }
  
  // array
  var arr = [];
  if (Array.isArray(cols)) {
      arr = cols;
  }
  
  // string 
  if (typeof cols == "string") { 
    arr = cols.split(delim); 
    // convert into nums
    arr = arr.map(Number);
  }  

  if (arr.indexOf(col) != -1) { return 1; }
  
  return 0;

}


/*----------------------------------- Actions -----------------------------------------------*/

/*
  set ID for onEdit trigger
  The function uses smallDiscovery:
    FILE  - activeBook
    SHEET - activeSheet
  
  Suggest, next Id is calculated from sheet:
    * numRow          -         101
    * numColId        -         1
    * strRangeIdFree  -         'nextId'         // name of range, containts formula `=max(data!A:A)+1`

*/
function setId(numRow, numColId, strRangeIdFree) {

  var numRowId = numRow;  
  var cellId = SHEET.getRange(numRowId, numColId);

  // value current
  var val = cellId.getValue();
  if (val != '') {return 'has Id'; }
    
  // new Id
  var numId = +FILE.getRangeByName(strRangeIdFree).getValue();
  
  cellId.setValue(numId);
  return ('setId - ok');
  
}

/*
  set current Time for onEdit trigger
  The function uses  smallDiscovery:
    FILE  - activeBook
    SHEET - activeSheet
  
Input:  
    * numRow          -         101
    * numCol          -         1    
*/
function setTimeStamp(numRow, numCol) {

  // get cell
  var cell = SHEET.getRange(numRow, numCol);
  
  var d = new Date();
  
  // set date
  cell.setValue(d);


}

/*----------------------------------- Tests -----------------------------------------------*/
function TESTcheckCol() {

  Logger.log(checkColDv(1, 1));
  Logger.log(checkColDv(1, "1,2,3", ","));
  Logger.log(checkColDv(1, [1, 2, 3]));

  Logger.log(checkColDv(1, 2));
  Logger.log(checkColDv(1, "2,3", ","));
  Logger.log(checkColDv(1, [2, 3]));

}
