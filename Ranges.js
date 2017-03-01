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
  if (!numRow) {
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
