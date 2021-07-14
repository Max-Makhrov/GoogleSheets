// sample file:
// https://docs.google.com/spreadsheets/d/1RPe8snQOuJOMVjE4P2DIsEWQl5aPUW9lH9BIs8AJaiI/copy

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Do some magic')
      .addItem('Collapse my sheets', 'addGroups')
      // .addSeparator()
      // .addSubMenu(ui.createMenu('Sub-menu')
      //     .addItem('Second item', 'menuItem2'))
      .addToUi();
}


function addGroups() {
  var tasks = getSets().tasks;
  tasks.forEach(docollapse_);
}
function docollapse_(set) {
  var maxDepth = 8;
  set = set || {
    sheet: 'Sheet1',
    row: 2,
    col1: 1,
    col2: 2
  };
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName(set.sheet);
  var rows = sheet.getLastRow();
  var h = rows - set.row + 1;
  if (h < 0) {
    console.log('empty sheet');
    return -1;
  }
  // note:
  // take 1 more level to see
  // blank cells and decide groups
  var l = set.col2 - set.col1 + 2;
  if (l > (maxDepth+1)) {
    l = maxDepth+1;
  }
  var range0 = sheet.getRange(set.row, set.col1, h, l);
  var data = range0.getValues();
  // console.log(data)
  range0.shiftRowGroupDepth(maxDepth * -1);

  //
  // loops
  var val0='', val, groupVal, groupVal0 = '';
  // loop to fill data
  for (c = (l-2); c>=0; c--) {
    for (var r = 0; r < h; r++) { 
      groupVal = data[r][c];
      if (groupVal === '') { groupVal = groupVal0; }
      val = data[r][c+1];
      // correct for empty data
      if (data[r][c] === '' && val !== '') {
        data[r][c] = groupVal0;
      }
      groupVal0 = groupVal;
    }
    val = '',
    groupVal0 = '', groupVal = '';
  }
  // loop data and see rows to group
  // loop columns first
  var start = 0, fin = 0;
  for (c = (l-2); c>=0; c--) {
    for (var r = 0; r < h; r++) { 
      groupVal = data[r][c];
      if (groupVal === '') { groupVal = groupVal0; }
      val = data[r][c+1];
      // correct for empty data
      if (data[r][c] === '' && val !== '') {
        data[r][c] = groupVal0;
      }
      // start...
      if (val0 === '' && val !== '') {
        start = r + set.row;
        console.log(start)
      }
      if (val === '' && val0 !== '') {
        fin = r + set.row - 1;
        console.log(fin);
        // For debug purpose only. 
        // Name of group
        console.log(groupVal0);
        if (fin > start) {
          sheet.getRange(start + ':' + fin)
            .shiftRowGroupDepth(1);
        }
      }
      if (r === (h-1)) {
        fin = r + set.row;
        console.log(fin);
        // For debug purpose only. 
        // Name of group
        console.log(groupVal);
        if (fin > start) {
          sheet.getRange(start + ':' + fin)
            .shiftRowGroupDepth(1);
        }
      }
      val0 = val;
      groupVal0 = groupVal;
    }
    val0 = '', val = '',
    groupVal0 = '', groupVal = '';
  }
  // console.log(data);
}


/// Sets
// Settings from sheets
var ssets = {
  tasks: {
    sheet: 'collapsets',
    func: data2jsonarray_
  }
}

function getSets() {
  var file = SpreadsheetApp.getActive()
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
