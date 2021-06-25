/* getSheetContent
  * return sheets content into array
  use defaults: if SS = false then SS = ActiveSpreadsheet
  
  * SS           SpreadSheet
  * strSheet     Name of sheet                     
  * numRow       number of row to start               if kipped: get all data from sheet
  * numCol       number of volumn to start            if kipped: get all data from numRow to the end of sheet            
  * numRows      number of rows to get                if kipped: get all data from numRow, numCol to the end of sheet 
  * numCols      number of columns to get             if kipped: get all numRows, all columns from numRow, numCol 
  
*/
function getSheetContent(SS, strSheet, numRow, numCol, numRows, numCols) {
  var SS = SS || SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SS.getSheetByName(strSheet);
  if (!sheet) { return 'Sheet does not exist'; }
  var range;
  var data = [];
  
  // if starting row is undefined, get all cells
  if (!numRow && !numCol && !numRows && !numCols) {
    range = sheet.getDataRange();
    data = range.getValues();
    return data;
  }
  
  numRow = numRow || 1;
  numCol = numCol || 1;
  numRows = numRows || sheet.getLastRow() - numRow + 1;;
  numCols = numCols || sheet.getLastColumn() - numCol + 1;;

  range = sheet.getRange(numRow, numCol, numRows, numCols);
  
  if (!range) { return 'Range not defined'; }
  
  data = range.getValues();
  
  return data;
  
}


function test_getRangeValuesMapR1C1()
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getActiveSheet();
  var range = sheet.getRange('B2:C12');
  Logger.log(getRangeValuesMapR1C1(range));
}
/*
 {rowNums=[2, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0], 
 R2C2=, 
 ... 
 R5C2=Mainland, 
 R5C3=Country, 
 ...}
*/
function getRangeValuesMapR1C1(range, values) {
  values = values || range.getValues();
  
  var colStart = range.getColumn();
  var rowStart = range.getRow();
    
  var cols = range.getWidth() + colStart - 1;
  var rows = range.getHeight() + rowStart - 1;
  
  var obj = {};
  
  obj.rowNums = [];

  
  for (var row = rowStart; row <= rows; row++)
  {
    obj.rowNums.push(row);
    for (var col = colStart; col <= cols; col++) 
    { 
      obj['R' + row + 'C' + col] = values[row - rowStart][col - colStart]; 
    }  
  }
  
  return obj;
   
}
