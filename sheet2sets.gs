// Settings from sheets
// test:
// https://script.google.com/u/0/home/projects/1GhlbHQx1ke_enwGc5G7kfVXio_5XMmfyNWMuOfWKi9vJioYzJlETMwMk/edit
var default_sheet2script_options = {
  file: '1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw',
  data: {
    row_tags: 1,
    row_marker: 2, // use to create self-description for data
    func: data2jsonarray_
  },
  lists: {
    sheet: 'list1',
    key: 'group',
    row_marker: 2,
    func: data2jsongroups_
  },
  memory: {
    key: 'key',
    value: 'value',
    func: data2keyvalues_
  }
}

function test_getSets(options) {
  if (!options) {
    options = default_sheet2script_options;
  }
  var res = getSetsFromSheets_(options);
  console.log(JSON.stringify(res, null, 4));
}


//   ______                    
//  |  ____|                   
//  | |__ _   _ _ __   ___ ___ 
//  |  __| | | | '_ \ / __/ __|
//  | |  | |_| | | | | (__\__ \
//  |_|   \__,_|_| |_|\___|___/
/**
 * converts data to object with keys
 * 
 * param {array} options.data 
 * param {array} options.header
 * param {number} options.row_data_starts
 * 
 */
function data2jsonarray_(options) {
  var tags = options.header; 
  // loop rows
  var res = [], chunk = {}, num_vals, val;
  var start = options.row_data_starts -1;
  for (var i = start; i < options.data.length; i++) {
    chunk = {};
    num_vals = 0;
    for (var ii = 0; ii < tags.length; ii++) {
      if (tags[ii] !== '') {
        val = options.data[i][ii];
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

/**
 * convert data to arrays of json grouped by key
 * 
 * param {array} options.data 
 * param {array} options.header
 * param {string} options.key
 * param {number} options.row_data_starts
 * 
 */
function data2jsongroups_(options) {
  var tags = options.header; 
  var key = options.key;
  var start = options.row_data_starts -1;
  // loop rows
  var res = {}, chunk = {}, num_vals, val, k;
  for (var i = start; i < options.data.length; i++) {
    chunk = {};
    num_vals = 0;
    for (var ii = 0; ii < tags.length; ii++) {
      if (tags[ii] !== '' && tags[ii] !== key) {
        val = options.data[i][ii];
        chunk[tags[ii]] = val;
        if (val !== '') { num_vals++; }
      } else if (tags[ii] !== '' && tags[ii] === key) {
        k = options.data[i][ii];
      }
    }
    if (num_vals > 0) {
      if (!(k in res)) {
        res[k] = [chunk];
      } else {
        res[k].push(chunk);
      }
    } 
  }
  return res;
}

/**
 * converts data to key-value pairs
 * 
 * param {array} options.data 
 * param {array} options.header
 * param {string} options.key
 * param {string} options.value
 * param {number} options.row_data_starts
 * 
 */
function data2keyvalues_(options) {
  var tags = options.header;
  // loop rows
  var start = options.row_data_starts -1;
  var res = {};
  var keyIndex = tags.indexOf(options.key);
  var valueIndex = tags.indexOf(options.value);
  var k, v;
  for (var i = start; i < options.data.length; i++) {
    k = options.data[i][keyIndex];
    v = options.data[i][valueIndex];
    if (k !== '') {
      res[k] = v;
    }
  }
  return res;
}
                            

//    _____               
//   / ____|              
//  | |     ___  _ __ ___ 
//  | |    / _ \| '__/ _ \
//  | |___| (_) | | |  __/
//   \_____\___/|_|  \___| 
/**
 * getSetsFromSheet_
 * 
 * gets sets from sheet
 * or from multiple sheets
 * 
 * @param {object} options
 */
function getSetsFromSheets_(options) {
  var ini_sets = options;
  var file;
  if (ini_sets.file) {
    file = SpreadsheetApp.openById(ini_sets.file);
  } else {
    file = SpreadsheetApp.getActive();
  }
  var sheetname, sheet, range;
  var sets_i, data, res = {};
  for (var k in ini_sets) {
    if (k !== 'file') {
      // get sets
      sets_i = ini_sets[k];
      // get sheet + range
      sheetname = sets_i.sheet || k;
      sheet = file.getSheetByName(sheetname);
      range = sheet.getDataRange();
      // get data
      data = range.getValues();
      sets_i.data = data;
      setSheetsDataEndpoints_(sets_i);
      // add to the result
      res[k] = sets_i.func(sets_i);
    }
  }
  // console.log(JSON.stringify(res, null, 4));
  return res;
}


/**
 * sets data endpoints:
 *   {
 *     header: ['id', 'name', 'sum'],
 *     row_data_starts: 2
 *    }
 * 
 *  @param {array}  options.data - sheet.getDataRange().getvalues()
 *  @param {int}    options.row_tags
 *  @param {int}    options.row_data_starts
 *  @param {int}    options.row_marker
 *  @param {string} options.marker_data_starts
 */
function setSheetsDataEndpoints_(options) {
  // #1. set header
  // by default starts with row 1
  var row_tags = options.row_tags || 1;
  options.header = options.data[row_tags - 1];

  // #2. set row_data_starts
  // #2.1.
  if (options.row_data_starts) {
    // it was set by the script
    return 0;
  }
  // #2.2. concept of self-descriptive tables
  if (options.row_marker) {
    var marker_data_starts = options.marker_data_starts || 'rowstart: ';
    var markers = options.data[options.row_marker - 1];
    for (var i = 0; i < markers.length; i++) {
      // find text in a row where marker is ↓
      if (markers[i].startsWith(marker_data_starts)) {
        options.row_data_starts = parseInt(
          markers[i].replace(
            marker_data_starts, ''));
        return 0;
      }
    }
  }
  // #2.3. defaults
  options.row_data_starts = 2;
  return 0;
}
