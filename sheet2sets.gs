// Settings from sheets
var ssets = {
  file: '1UTMsO5zeIgnqPndvRrm6kpTXNJ9MM2YrZkazOLEr2wY',
  tasks: {
    sheet: 'esets',
    tagsrow: 1,
    datarow: 2,
    func: data2jsonarray_
  },
  boom: {
    func: data2jsonarray_
  }
}

function getSets(setsObj) {
  var ini_sets = setsObj || ssets;
  var fileid = ini_sets.file;
  var file;
  if (fileid) {
    file = SpreadsheetApp.openById(fileid);
  } else {
    file = SpreadsheetApp.getActive();
  }
  var sheetname, sheet, range;
  var sets, data, res = {};
  for (var k in ini_sets) {
    if (k !== 'file') {
      // get sets
      sets = ini_sets[k];
      // get sheet + range
      sheetname = sets.sheet || k;
      sheet = file.getSheetByName(sheetname);
      range = sheet.getDataRange();
      // get data
      data = range.getValues();
      sets.data = data;
      // add 2 result
      res[k] = sets.func(sets);
    }
  }
  console.log(JSON.stringify(res, null, 4));
  return res;
}

/**
 * converts data to object with keys
 * 
 * param {array} sets.data 
 * param {number} sets.tagsrow   row number with tag names
 * param {number} sets.datarow   row number data starts 
 * 
 */
function data2jsonarray_(sets) {
  var tagsrow = sets.tagsrow || 1;
  var datarow = sets.datarow || 2;
  var tags = sets.data[tagsrow -1]; 
  // loop rows
  var res = [], chunk = {}, num_vals, val;
  for (var i = datarow - 1; i < sets.data.length; i++) {
    chunk = {};
    num_vals = 0;
    for (var ii = 0; ii < tags.length; ii++) {
      if (tags[ii] !== '') {
        val = sets.data[i][ii];
        chunk[tags[ii]] = val;
        if (val !== '') { num_vals++; }
      } 
    }
    if (num_vals > 0) {
      res.push(chunk);
    } 
  }
  return res;
}

// see also: 
//  * sheet to JSON: 
//    https://gist.github.com/pamelafox/1878143
