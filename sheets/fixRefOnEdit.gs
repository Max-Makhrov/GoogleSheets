// https://github.com/Max-Makhrov/GoogleSheets/blob/master/sheets/fixRefOnEdit.gs
function onEdit(e) {
  // add more functions if needed
  fixArrayFormulaRefErrors_(e);
  // add more functions if needed
}

/**
 * onEdit
 * 
 * Trigger event for Google Sheets
 * https://developers.google.com/apps-script/guides/triggers/events
 * 
 * @typedef {Object} Event
 * @property {SpreadsheetApp.Range} range
 * @property {SpreadsheetApp.Spreadsheet} source
 */

/**
 * @param {Event} e
 */
function fixArrayFormulaRefErrors_(e) {

  var lookFor = '#REF!';

  // 🦆type
  // error gives value = #REF
  // #REF error also has a formula in it
  // #REF is above the edited range
  // #REF is in the previous or the save column
  // values between #REF and edited range are blank
  //
  // can also use Sheets API and see error message
  // https://stackoverflow.com/questions/75925161

  var numRow = e.range.getRow();
  if (numRow === 1) return;
  var numCol = e.range.getColumn();
  if (numCol === 1) return;

  var sheet = e.range.getSheet();
  var range = sheet.getRange(1,1,numRow, numCol);
  var values = range.getValues();

  var rowCheckFrom = 0;
  var colCheckFrom = 0;

  /** 
   * @param {Number} rowIndex
   * @param {Number} columnIndex
   * 
   * @returns {String} comment - may use to debug
   */
  function _dealWith(rowIndex, columnIndex) {
    if (rowIndex === numRow - 1 && columnIndex === numCol - 1) {
      return 'do not check self';
    }
    var checkValue = values[rowIndex][columnIndex];
    if (checkValue === '') {
      return 'empty cell, continue checking without changes';
    }
    if (checkValue === lookFor) {
      var r = sheet.getRange(rowIndex+1, columnIndex+1);
      if (isRangeAFormula_(r)) {
        e.range.clearContent();
        stopLoopExecution_();
        return '😎 fixed';
      }
    }
    rowCheckFrom = rowIndex + 1;
    return 'reduced the number of cells to check';
  }

  function stopLoopExecution_() {
    rowCheckFrom = numRow;
    colCheckFrom = numCol;
  }

  // start search from the column above edited one
  // move to the top by row first
  // stop if not blank and not #REF value is found
  // then move to the previous row
  for (var ii = numCol - 1; ii >= colCheckFrom; ii--) {
    for (var i = numRow - 1; i >= rowCheckFrom; i--) { 
      _dealWith(i, ii);
    }
  }


}

/**
 * @param {SpreadsheetApp.Range} range
 * 
 * @returns {Boolean}
 */
function isRangeAFormula_(range) {
  var f = range.getFormula();
  if (f === '') return false;
  return true;
}
