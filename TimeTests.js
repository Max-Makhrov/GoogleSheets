// --------------------------------------------------------------------------------------------------------------- //
/*   ------------------------------------https://learn.javascript.ru/decorators----------------------------------*

   _____ ____  _____  ______   _    _ ______ _____  ______ 
  / ____/ __ \|  __ \|  ____| | |  | |  ____|  __ \|  ____|
 | |   | |  | | |  | | |__    | |__| | |__  | |__) | |__   
 | |   | |  | | |  | |  __|   |  __  |  __| |  _  /|  __|  
 | |___| |__| | |__| | |____  | |  | | |____| | \ \| |____ 
  \_____\____/|_____/|______| |_|  |_|______|_|  \_\______|
                                                                                                                     
*/
// --------------------------------------------------------------------------------------------------------------- //
var timers = {};

// adds time f inti timers[timer]
function timingDecorator(f, timer) {
  return function() {
    var start = new Date();

    var result = f.apply(this, arguments); // (*)

    if (!timers[timer]) timers[timer] = 0;
    timers[timer] += new Date() - start;

    return result;
  }
}

/*
  _______ ______  _____ _______ _____ 
 |__   __|  ____|/ ____|__   __/ ____|
    | |  | |__  | (___    | | | (___  
    | |  |  __|  \___ \   | |  \___ \ 
    | |  | |____ ____) |  | |  ____) |
    |_|  |______|_____/   |_| |_____/ 
                                                                           
*/


/*
   Test what faster: 
      1. use `ImportRange` function → conbert it into values
      2. get data directly from taget sheet
      
   Results:
      1. 2193 ms
      2. 587 ms

*/
   function TESTgetValueImport() {
     var strSheet = 'test_Import';
     var strFormula = '=IMPORTRANGE("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","SheetFrom!A6:W")';
     //-------------------------------------------------
     var file = SpreadsheetApp.getActiveSpreadsheet();
     var sheet = file.getSheetByName(strSheet);
     var rangeA1 = sheet.getRange(1, 1);
     rangeA1.setFormula(strFormula);

     SpreadsheetApp.flush();

     var range = sheet.getDataRange();
     var data = range.getValues();
     range.setValues(data);
   }

   function TESTgetValueDirectly() {
     var strSheet = 'test_Import';
     var strKeyFrom = '1hrEsRVvilJi3aaVJV7dNzjIRoNtLtT0F50gD0pFYBtw';
     var strSheetFrom = 'Анкеты'
     var numRowStartFrom = 6;
     var numColStartFrom = 1;
     var numColumnsFrom = 23;
     //-------------------------------------------------
     var fileFrom = SpreadsheetApp.openById(strKeyFrom);
     var sheetFrom = fileFrom.getSheetByName(strSheetFrom);
     var numLastRowFrom = sheetFrom.getLastRow();
     var numRowsFrom = numLastRowFrom - numRowStartFrom + 1;
     var range = sheetFrom.getRange(numRowStartFrom, numColStartFrom, numRowsFrom, numColumnsFrom);
     var data = range.getValues();

     var file = SpreadsheetApp.getActiveSpreadsheet();
     var sheet = file.getSheetByName(strSheet);
     var range = sheet.getRange(1, 1, numRowsFrom, numColumnsFrom);
     range.setValues(data);


   }

   function TIME_TESTgetValue() {

     // Import
     var tester = timingDecorator(TESTgetValueImport, "Import");
     tester();
     Logger.log( timers.Import + ' ms' ); // 2193 ms
     // Directly

     var tester2 = timingDecorator(TESTgetValueDirectly, "Directly");
     tester2();
     Logger.log( timers.Directly + ' ms' ); // 587 ms  

   }

