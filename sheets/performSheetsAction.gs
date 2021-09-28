// copy sample file:
// https://docs.google.com/spreadsheets/d/1ahfopToshSXeo8PLer2tPsd1wP8DcFw1jNPrXPNjpZY/copy

// change these settings
var performSets = {
  
  // change to any Spreadsheet if needed
  // default: active sheet
  file: SpreadsheetApp.getActive(),
  
  // regular expression to find
  // sheets for action
  re: /^Sheet.*/,
  
  // function to perform on each sheet
  func: function(sheet, sheetName) {
    sheet.getRange('A1').setValue('Yay!');
    console.log(sheetName);
  }

}

// ↓ this function will do same task with all sheets
function doSomeWorkWithSheets() {
  actWorkSheets_(performSets.func);
}


// this function checks 1 sheet if it matches 
// your condition
// change this rule to any if needed
function getSheetMatchs_(sheetName) {
  // what type of sheet matchs
  if (!sheetName) { return false; }
  var re = performSets.re;
  if (sheetName.match(re)) { return true; }
  return false;
}

// this function will loop all sheets and perform action
function actWorkSheets_(func) {
  // selects all sheets that matches to do some good work
  var file = performSets.file;
  var sheets = file.getSheets();
  var sheet, sheetName;
  for (var i = 0; i < sheets.length; i++) {
    sheet = sheets[i];
    sheetName = sheet.getName();
    if (getSheetMatchs_(sheetName)) {
      sheet.activate();
      func(sheet, sheetName);
    }
  }
}
