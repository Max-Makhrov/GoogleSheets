/*
  This file use functions from:
    https://github.com/Max-Makhrov/GoogleSheets/blob/master/2dArray.js

*/

function TESTgetTableDescription() {

  var rHeaders = 'Payments!1:1';
  Logger.log(getTableDescription(false, rHeaders));

}


/*
  Get table descriptions with data types
  The function corrects range to the last column
  
  Input
    * rHeader           'Sheet1!A1:H1'            // adress of range that contains headres of table
    
  Output
    table:
    
      Field Name      Data Type    
    |==============================|
    | Date          | DATE         |
    | Name          | VARCHAR      |
    | OrderId       | INTEGER      |
    | Sum           | FLOAT        |
    --------------------------------

*/
function getTableDescription(file, rHeaders) {
  var file = file || SpreadsheetApp.getActiveSpreadsheet();
  var headers = file.getRange(rHeaders);
   
  var numRows = headers.getHeight();
  
  // return if header is more then 1 row height
  if (numRows > 1) return 'Headers must contain 1 row';
  
  var headRow = headers.getRow();
  var sheet = headers.getSheet();
  var lastRow = sheet.getLastRow();
  
  // return if table is empty
  if (lastRow <= headRow) return 'Table has no contents.';
  
  var maxRows = 100;
  var numRows = lastRow - headRow;
  if (numRows > maxRows) numRows = maxRows;
  
  var numRow = headers.getRow();
  var numColumn = headers.getColumn();
  
  // correct range to the last column
  var numLastColumn = sheet.getLastColumn();
  var numLastColumnHead = headers.getLastColumn();
  if (numLastColumn < numLastColumnHead) { 
    // reset head range
    headers = sheet.getRange(numRow, numColumn, 1, numLastColumn - numRow + 1);  
  }

  var numColumns = headers.getWidth();
  
  var range = sheet.getRange(numRow + 1, numColumn, numRows, numColumns);
  
  var data = range.getValues();
  
  // get all data types
  var dataTypes = getDataTypes(data);
  var result = headers.getValues();
  
  result.push(dataTypes);
  
  return transpose(result);
  
  
}


/*
  * Try:
    ------------------------------------------------------------------
    function TESTgetDataTypes() {    
      Logger.log(getDataTypes([[1, 'foo'], [2, 'bar'], [3.3, 'go']]));
    }
   ------------------------------------------------------------------
   
   * Result: ['FLOAT', 'STRING']

   * Data types changes
      --------------------------------------------
      DATE        →     FLOAT       =       STRING
      DATE        →     INTEGER     =       STRING
      DATE        →     STRING      =       STRING
      --------------------------------------------
      FLOAT       →     INTEGER     =       FLOAT
      FLOAT       →     DATE        =       STRING
      FLOAT       →     STRING      =       STRING
      --------------------------------------------
      STRING      →     INTEGER     =       STRING
      STRING      →     DATE        =       STRING
      STRING      →     FLOAT       =       STRING
      --------------------------------------------
      INTEGER      →     DATE       =       STRING 
      INTEGER      →     STRING     =       STRING
      INTEGER      →     FLOAT      =       FLOAT
      --------------------------------------------
    means all data changes except FLOAT ←→ INTEGER give STRING
*/
function getDataTypes(data) {

  var result = [];
  var type = ''; 
  
  for (var row = 0; row < data.length; row++) {
     for (var column = 0; column < data[0].length; column++) {
       type = getDataType(data[row][column]);

       if (result[column] == undefined) result[column] = type;
       if (result[column] != type) {
         if ((result[column] == 'FLOAT' && type == 'INTEGER') || (result[column] == 'INTEGER' && type == 'FLOAT')) {              
           // FLOAT ←→ INTEGER = FLOAT
           result[column] = 'FLOAT';                 
         }
         // all data changes except FLOAT ←→ INTEGER give STRING
         else { result[column] = 'STRING'; }
       }
     
     } 
  
  }
  
  return result;

}

/*

  input: value
      
   
  return:
     STRING
     FLOAT       Double precision (approximate) decimal values
     INTEGER     -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
     DATE        'YYYY-[M]M-[D]D'     

*/
function getDataType(value) {
  
  if (Object.prototype.toString.call(value) === '[object Date]') {return 'DATE'; }
  
  switch (typeof value) {
    case 'string':
      return 'STRING';
    case 'number':
      if (Math.round(value) == value) {return 'INTEGER'; } else {return 'FLOAT'; }
    default:
      return 'UNNOWN';
  }

}
