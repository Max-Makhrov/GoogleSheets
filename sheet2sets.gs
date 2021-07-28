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

function getSets() {
  var fileid = ssets.file;
  var file;
  if (fileid) {
    file = SpreadsheetApp.openById(fileid);
  } else {
    file = SpreadsheetApp.getActive();
  }
  var sheetname, sheet, range;
  var node, data, res = {};
  for (var k in ssets) {
    if (k !== 'file') {
      // get node
      node = ssets[k];
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
  var res = [], chunk = {};
  for (var i = node.datarow - 1; i < node.data.length; i++) {
    chunk = {};
    for (var ii = 0; ii < tags.length; ii++) {
      chunk[tags[ii]] = node.data[i][ii];
    }
    res.push(chunk);
  }
  return res;
}

// see also: 
//  * sheet to JSON: 
//    https://gist.github.com/pamelafox/1878143
