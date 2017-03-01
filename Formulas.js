/*
  This file use:
    https://github.com/Max-Makhrov/GoogleSheets/blob/master/Strings.js

*/


/**
 * Get 2d array with results like this:
 * row   column     formula
 *    1        1     = B1 + C1
 *    2        1     = B2 + C2
 *    3        1     = B3 + C3
 *
 * @param {string} strSheet sheet name
 * @param {string} rangeA1 range address in A1 notation
 * @return All formulas from selected area and their addresses.
 * @customfunction
 */
function getFormulas(strSheet, rangeA1, skipHeaders) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(strSheet);
  var range;
  if (rangeA1) { range = sheet.getRange(rangeA1); } else { range = sheet.getDataRange(); }
  var data = range.getFormulas(); 
  return getFormulas_(data, skipHeaders);
}


function TESTGetFormulasSheets() {
var sheets = [['Staff','Buh','Design']];
Logger.log(getFormulasSheets(sheets));

}
/*
  sheets -- row with sheet names
*/
function getFormulasSheets(sheets) {
  var strSheet;
  sheets = sheets[0];
  var sheet;
  var range
  var data = [];
  var result = [];
  var subResult = [];
  
  for (var i = 0; i < sheets.length; i++) {
    strSheet = sheets[i];
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(strSheet);
    range = sheet.getDataRange();
    var data = range.getFormulas();
    subResult = getFormulasSheets_(data, strSheet, i);
    result = result.concat(subResult);
    
  }

  return result;
  
}

function getFormulasSheets_(data, strSheet, i) {
  var row = [], resultRow = [], result = [];
  if (i ==0) { result.push(['sheet', 'row', 'column', 'formula']); }
  var cell;
   for (var i = 0; i < data.length; i++) {
     row = data[i];
     for (var j = 0; j < row.length; j++) {
       cell = row[j];
       if (cell.substring(0, 1) == '=') { 
       // && cell.substring(0, 13) != '=getFormulas('
         resultRow = [];
         resultRow.push(strSheet);
         resultRow.push(i+1);
         resultRow.push(j+1);
         resultRow.push(cell);
         result.push(resultRow);       
       }
     }   
   }
   
   return result;
}



function getFormulas_(data, skipHeaders) {
  
  var row = [], resultRow = [], result = [];
  if (!skipHeaders) { result.push(['row', 'column', 'formula']); }
  var cell;
   for (var i = 0; i < data.length; i++) {
     row = data[i];
     for (var j = 0; j < row.length; j++) {
       cell = row[j];
       if (cell.substring(0, 1) == '=') { 
       // && cell.substring(0, 13) != '=getFormulas('
         resultRow = [];
         resultRow.push(i+1);
         resultRow.push(j+1);
         resultRow.push(cell);
         result.push(resultRow);       
       }
     }   
   }
   
   return result;

}

function TESTgetFormulas() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Formulas');
  var range = sheet.getRange('C2:C7');
  var data = range.getValues();
  Logger.log(getFormulas(data));

}


/*
  * buld formulas in single sheet in file
  
  * idFile      - 'Ww6WiOO8r39vcOPcFKPbRKc-6BiZ8eUR1ThtWGh8' 
 
  * strSheet    - 'Sheet1'
  * formulas    - ['=text(A1;QUOTE00,0QUOTE)', '=A2+B1']
  * cells       - [B3', 'C3']

*/
var STR_NUMSYMBOL = 'NUMSYMBOL';        // → #
var STR_QUOTE = 'QUOTE';                // → "         
var STR_SLASH = "SLASH";                // → \

function buildFormulas(idFile, strSheet, formulas, cells) {
    var file = SpreadsheetApp.openById(idFile);
    
    // get sheet
    var sheetTo = file.getSheetByName(strSheet);
    
    // loop cells, set formulas
    for (var j = 0; j < cells.length; j++) {
      //Logger.log(cells[j]);
      //Logger.log(sheetTo.getName());
      cell = sheetTo.getRange(cells[j]);
      formula = formulas[j];
      // replace QOUTE with ", etc.
      buildFormula(cell, formula)
    }

}

/*
  cell = [object]
  formula = [string]

*/
function buildFormula(cell, formula) {
      // replace QOUTE with ", etc.
      formula = replaceAll(formula, STR_QUOTE, '"');
      formula = replaceAll(formula, STR_NUMSYMBOL, '#');
      formula = replaceAll(formula, STR_SLASH, "\\");      
      
      cell.setFormula(formula);
}
