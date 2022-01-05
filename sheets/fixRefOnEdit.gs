// sample file:
// https://docs.google.com/spreadsheets/d/10Lhj0V6m_RjaPusRTP-siXvqJfW4TZTxMzzolUVjYeU/copy

function test_onEdit() {
  var e = {
    range: SpreadsheetApp
      .getActive()
      .getSheetByName('Sheet1')
      .getRange("A2:Z3")
  }
  onEdit(e)
}


function onEdit(e) {
  fixRefErrors_(e);
}

/**
 * fix #Ref errors when user overwrites
 * values with onEdit simple trigger
 */
function fixRefErrors_(e) {
  /** SETTINGS ******************************************* */
  var sheetnames = ['Sheet1'];
  var formularows = [1];
  /******************************************************* */

  // except edits on other sheets
  var range = e.range;
  var sheet = range.getSheet();
  var index = sheetnames.indexOf(sheet.getName())
  if (index < 0) {
    return -1;
  }

  // detect formula range
  var width = range.getWidth();
  var column = range.getColumn();
  var row = formularows[index];
  var rangeCheck = sheet.getRange(row, column, 1, width);
  var values = rangeCheck.getValues()[0];

  // detect if #Ref-errors are in a range
  var isRefColumns = [], val;
  for (var i = 0; i < width; i++) {
    val = values[i];
    if (val === '#REF!') {
      isRefColumns.push(i+column);
    }
  }

  // fix errors
  var columngroups = groupNumbers_(isRefColumns);
  var rClear , group;
  var last = sheet.getLastRow();
  for (i = 0; i < columngroups.length; i++) {
    group = columngroups[i];
    rClear = sheet.getRange(
      row + 1,
      group.start,
      last,
      group.count
    );
    rClear.clearContent();
  }

  return ; // OK
  
}

/**
 * convert array of sorted numbers
 * to object of groups of numbers
 * 
 * [1,2,3,  4,5,   8,9] →
 * 
 * [{start: 1, end: 5, count: 5},
 *   {start: 8, end: 9, count: 2}]
 * 
 * @arr {array} of sorted numbers
 * 
 * @retuen {array} of objects with desired ranges
 */
// function test_groupNumbers() {
//   var array = [1,2,3,4,5,  8,9,  500,501];
//   var res = groupNumbers_(array);
//   console.log(res);
//   // [ { start: 1, end: 5, count: 5 },
//   //   { start: 8, end: 9, count: 2 },
//   //   { start: 500, end: 501, count: 2 } ]
//   console.log(groupNumbers_([]))
// }
function groupNumbers_(array) {
  if (array.length === 0) {
    return [];
  }
  var i = 0;
  var node = {
    start: array[i], 
    end: array[i],
    count: 1
  }
  var res = [node];
  for (i = 1; i < array.length; i++) {
    if (array[i-1]+1 === array[i]) {
      node.end++;
      node.count++;
    } else {
      node = {
        start: array[i], 
        end: array[i],
        count: 1
      }
      res.push(node);
    }
  }
  return res;
}
