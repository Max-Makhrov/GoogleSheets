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
  var node, data, res = {};
  for (var k in ini_sets) {
    if (k !== 'file') {
      // get node
      node = ini_sets[k];
      // get sheet + range
      sheetname = node.sheet || k;
      sheet = file.getSheetByName(sheetname);
      range = sheet.getDataRange();
      // get data
      data = range.getValues();
      node.data = data;
      // set defaults
      node.tagsrow = node.tagsrow || 1;
      node.datarow = node.datarow || 2;
      // add 2 result
      res[k] = node.func(node);
    }
  }
  console.log(JSON.stringify(res, null, 4));
  return res;
}

function data2jsonarray_(node) {
  var tags = node.data[node.tagsrow -1]; 
  // loop rows
  var res = [], chunk = {}, num_vals, val;
  for (var i = node.datarow - 1; i < node.data.length; i++) {
    chunk = {};
    num_vals = 0;
    for (var ii = 0; ii < tags.length; ii++) {
      if (tags[ii] !== '') {
        val = node.data[i][ii];
        chunk[tags[ii]] = val;
        if (val !== '') { num_vals++; }
      } 
    }
    if (num_vals > 0) {
      res.push(chunk);
      console.log(num_vals)
    }
    
  }
  return res;
}

// see also: 
//  * sheet to JSON: 
//    https://gist.github.com/pamelafox/1878143
