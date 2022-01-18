/**
 *  hide rows or columns
 *  by single row/column condition
 */
function hideLines_(sets) {
  // show defaults
  sets = sets || {
    sheet: SpreadsheetApp.getActiveSheet(),
    hide_rows: true, // or columns if false
    line: 1, // row or column to check
    regex: '^\<.*?\>$',
    hide_matched: false
  }

  // show all rows or columns
  var maxLen = 0;
  if (sets.hide_rows) {
    maxLen = sets.sheet.getMaxRows()
    // sets.sheet.showRows(1, maxLen);
  } else {
    maxLen = sets.sheet.getMaxColumns();
    // sets.showColumns(1, maxLen);
  }

  // loop rows or columns
  var data = sets.sheet.getDataRange().getValues();
  var re = new RegExp(sets.regex), match, val;
  var hideLines = [];
  for (var i = 0; i < maxLen; i++) {
    if (sets.hide_rows) {
      if (data[i]) {
        val = data[i][sets.line-1];
      } else {
        val = '';
      } 
    } else {
      val = data[sets.line-1][i] || '';
    }
    match = val.match(re);
    if (
      (!match && !sets.hide_matched) ||
      (match  &&  sets.hide_matched)
    ) { hideLines.push(i+1); }   
  }
  var hideGroups = groupNumbers_(hideLines);
  var hideGroup;
  for (var i = 0; i < hideGroups.length; i++) {
    hideGroup = hideGroups[i];
    if (sets.hide_rows) {
      sets.sheet.hideRows(
        hideGroup.start, 
        hideGroup.count);
    } else {
      sets.sheet.hideColumns(
        hideGroup.start, 
        hideGroup.count);
    }
  }
  return 0;
}

/**
 * convert array of sorted numbers
 * to object of groups of numbers
 * 
 * [1,2,3,  4,5,   8,9] →
 * [
 *   {start: 1, end: 5, count: 5},
 *   {start: 8, end: 9, count: 2},
 * ]
 * 
 * 
 * @arr {array} of sorted numbers
 * 
 * @retuen {array} of objects with desired ranges
 */
// function test_groupNumbers() {
//   var array = [1,2,3,4,5,   8,9, 500, 501];
//   var res = groupNumbers_(array);
//   console.log(res);
//   // [ { start: 1, end: 5, count: 5 },
//   //   { start: 8, end: 9, count: 2 },
//   //   { start: 500, end: 501, count: 2 } ]
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
