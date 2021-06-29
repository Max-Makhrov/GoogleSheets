// Settings from sheets
var ssets = {
  onedit: {
    func: data2jsonarray_
  }
}

// fast sets read using cache
function readOnEditSets() {
  var t = new Date();

  var key = 'abracadabraOnEdit';

  // var c = getCache_();
  // c.remove(key);

  var res = {};
  var sval = readCache_(key);
  if (sval) {
    res = JSON.parse(sval);
  } else {
    res = getSets().onedit[0];
    putCache_(key, JSON.stringify(res));
  }

  console.log('time to read sets = ' + (new Date() - t));
  // console.log(JSON.stringify(res));
  return res;
 
}


function getSets() {
  var file = SpreadsheetApp.getActive();
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


function getCache_() {
  return CacheService.getDocumentCache();
}
function putCache_(key, val) {
  var c = getCache_();
  c.put(key, val, 21600); // max cache life
}
function readCache_(key) {
  var c = getCache_();
  return c.get(key);
}
