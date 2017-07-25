/*
  
  Note: 
    link to original code:
    https://github.com/Max-Makhrov/GoogleSheets/edit/master/Sheets.js
  
    this code use:
    https://github.com/Max-Makhrov/GoogleSheets/blob/master/2dArray.js

*/



/*
   _____ _               _         _____        __      
  / ____| |             | |       |_   _|      / _|     
 | (___ | |__   ___  ___| |_ ___    | |  _ __ | |_ ___  
  \___ \| '_ \ / _ \/ _ \ __/ __|   | | | '_ \|  _/ _ \ 
  ____) | | | |  __/  __/ |_\__ \  _| |_| | | | || (_) |
 |_____/|_| |_|\___|\___|\__|___/ |_____|_| |_|_| \___/ 
                                                        
                                                        
*/



/*
    use getSheetsInfo(ids)
    
    write the report into sheet:
    
    input:
      * file                       SpreadSheet
      * strSheet                   'Sheet1'
      * data                       [['Name', 'Age'], ['Max', 28], ['Lu', 26]]
                              
  If strSheet doesn't exist → creates new sheet
                                    
*/
function writeDataIntoSheet(file, sheet, data, rowStart, colStart) {
  file = file || SpreadsheetApp.getActiveSpreadsheet();
  
  // get sheet as object
  switch(typeof sheet) {
    case 'object':
        break;
    case 'string':
        sheet = createSheetIfNotExists(file, sheet);
        break;
    default:
        return 'sheet is invalid';
  }
  
  // get dimansions and get range
  rowStart = rowStart || 1;
  colStart = colStart || 1;   
  var numRows = data.length;
  var numCols = data[0].length; 
  var range = sheet.getRange(rowStart, colStart, numRows, numCols);
  
  // clear old data if rowStart or colStart are not defined
  if(!rowStart && !colStart) { sheet.clearContents(); }

  
  // set values
  range.setValues(data);
  
  // report success
  return 'Wtite data to sheet -- ok!';

}

function TESTwriteDataIntoSheet() {
  var data = [['Name', 'Age'], ['Max', 28], ['Lu', 26]];
  var strSheet = "Sheet1";
  Logger.log(writeDataIntoSheet(false, strSheet, data));

}


/*

  input 
    * ids                          '16rzrnZrAQK9czPHOfAN...'
                            
                            or 2Darray:
                              
                              column
                                   [['sdfswee...'], ['s123df...'], ['...'], ...]
                              
                              or line
                                  ['sdfswee...', 's123df...', '...', ...]]
  output
    array
      ____________________________________________________________________________    
      [['Id*', 'fileId', 'fileName', 'sheetId', 'sheetName', 'lastRow', 'lastCol']   
       ['...', '16rr...', 'My Fi...', 'sdFg...', 'my she...',     5000 ,       28]
       [ ...                                                                     ]]
      -----------------------------------------------------------------------------
      * Id = fileName/sheetName/fileId/sheetId
*/
function getSheetsInfo(ids) {

  var result = [];
  var headers = ['Id', 'fileId', 'fileName', 'sheetId', 'sheetName', 'lastRow', 'lastCol'];
  // Id = fileName/sheetName/fileId/sheetId

  result.push(headers);
  
  
  if (Array.isArray(ids)) {

  
    ids = get1DArray(ids); 
        
    var rows = [];    
    for (var i = 0; i < ids.length; i++) {
      rows = [];
      rows = getSheetsInfo_(ids[i]);
      result = result.concat(rows);
    }
    
    
  }
  else {
    result = getSheetsInfo_(ids);  
  }
  
  return result;

}
function TESTgetSheetsInfo() {
  var ids = ['16rzrnZrAQK9cz...', '1ld-Ww6WiOO8r39vcOPcF...'];
  var data = getSheetsInfo(ids);
  Logger.log(data);

}


/*
  input 
    * fileId                '16rzrnZrAQK9czPHOfANJNsDN1_Ni3ecU40GStF3aWSM'
  
  output
    array
      [['fileId', 'fileName', 'sheetId', 'sheetName', 'lastRow', 'lastCol']
      ______________________________________________________________________     
   →  [['16r...', 'My Fi...', 'sdFg...', 'my she...',     5000 ,       28 ]
       [...                                                               ]]
      ----------------------------------------------------------------------

*/
function getSheetsInfo_(fileId) {
  var result = [];
  
  
  var row = [];

  var file = SpreadsheetApp.openById(fileId);
  var fileName = file.getName();
  var sheets = file.getSheets();
  var sheetName, sheetId
  for (var i = 0; i < sheets.length; i++) {
    
    var sheet = sheets[i];
    
    row = [];
        
    sheetName = sheet.getName();
    sheetId = sheet.getSheetId();
    // Id = fileName/sheetName/fileId/sheetId
    row.push(fileName + '/' + sheetName + '/' + fileId + '/' + sheetId);
    row.push(fileId);
    row.push(fileName);
    row.push(sheetId);
    row.push(sheetName);    
    row.push(sheet.getLastRow());
    row.push(sheet.getLastColumn());
    
    result.push(row);
    
  }
  
  return result;
  
}


/*
  returns sheet {} by given fileId, sheetId
*/
function test_getSheetById()
{
 var fileId = '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8'; 
 var sheetId = 0;
  Logger.log(getSheetById(fileId, sheetId).getName());
  
}
function getSheetById(fileId, sheetId)
{
  var file = SpreadsheetApp.openById(fileId);
  var sheets = file.getSheets();
  
  for(var i = 0, l = sheets.length; i < l; i++)
  {
   if (sheets[i].getSheetId() == sheetId) return sheets[i]; 
  }
  
  return false;
  
}



/*

  __  __             _             _       _          _____ _               _       
 |  \/  |           (_)           | |     | |        / ____| |             | |      
 | \  / | __ _ _ __  _ _ __  _   _| | __ _| |_ ___  | (___ | |__   ___  ___| |_ ___ 
 | |\/| |/ _` | '_ \| | '_ \| | | | |/ _` | __/ _ \  \___ \| '_ \ / _ \/ _ \ __/ __|
 | |  | | (_| | | | | | |_) | |_| | | (_| | ||  __/  ____) | | | |  __/  __/ |_\__ \
 |_|  |_|\__,_|_| |_|_| .__/ \__,_|_|\__,_|\__\___| |_____/|_| |_|\___|\___|\__|___/
                      | |                                                           
                      |_|                                                          
*/


/* copySheet
  * make copy of sheet and mave it after current sheet
  
  * SS           SpreadSheet
  * strToCopy    Name of sheet to copy
  * strName      Name of new sheet
*/
function copySheet(SS, strToCopy, strName) {

  var SS = SS || SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SS.getSheetByName(strToCopy);
  var newSheet = sheet.copyTo(SS);
  newSheet.setName(strName);
  var index = sheet.getIndex() + 1;  
  SS.setActiveSheet(newSheet);
  SS.moveActiveSheet(index);

}

/*
  Creates sheet if it does not exist
  Returns sheet object
 
  * ss           SpreadSheet                 default: current sheet
  * name         Name of sheet
*/
function createSheetIfNotExists(ss, name) { 
  var ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  
  try {ss.setActiveSheet(ss.getSheetByName(name));}
    catch (e) {ss.insertSheet(name);} 
  
  var sheet = ss.getSheetByName(name);
  return sheet;
}


