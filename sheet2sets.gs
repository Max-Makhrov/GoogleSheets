// source: https://github.com/Max-Makhrov/GoogleSheets/blob/master/sheet2sets.gs
// author: makhrov.max@gmail.com



/**********************************************            **************************************** */
/********************************************* Testing Area *************************************** */
/********************************************                ************************************** */
function test_me() {
  var sets = {};
  /**
   * #1. Copy sample file:
   *      https://docs.google.com/spreadsheets/d/1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw/copy
   *                                             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   *                                                 this is the unique ID of Spreadsheet
   */


  /**
   * #2. Change Spreadsheet ID to yours ↓
   */
  sets.file = '1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw';


  /**
   * #3. Test settings from multiple sheets
   *      Run `test_me` and see logs
   */
  var test_options = default_sheet2script_options
  test_options.file = sets.file;
  logJson_(getSetsFromSheets_(test_options), 'Sets from multiple Tabs');


  /** 
   * #4. Test getting settings by sheet name
   *      See Sample Sheets
   *       |data|
   *        https://docs.google.com/spreadsheets/d/1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw/edit#gid=1297134980
   *       |list|
   *        https://docs.google.com/spreadsheets/d/1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw/edit#gid=1674625252
   *       |library|
   *        https://docs.google.com/spreadsheets/d/1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw/edit#gid=1793199605
   */
  // standard
  sets.sheet = 'data';
  logJson_(getStandardSets_(sets).data, 'Standard Sets');
  // grouped
  sets.sheet = 'list1';
  sets.key = 'group';
  logJson_(getGroupedSets_(sets).data, 'Grouped Sets');
  sets.sheet = 'library';
  sets.key = 'name';
  logJson_(getLibrarySets_(sets).data, 'Library');

  /**
   * #5. Test editing Library
   *      See Sample Sheet
   *       |library|
   *        https://docs.google.com/spreadsheets/d/1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw/edit#gid=1793199605
   *        ^
   *        👀 the sheet after update
   * 
   */
  var libsets = {
    file: sets.file, // file id
    sheet: 'library',
    key: 'name',
    // the script will update or add new rows
    data: {
      "Leo": {
        "age": 6, // update age
      },
      "Max": {
        "name": "Maxxx", // update key =)
        "age": 35, // update age
        "stars": "⭐⭐⭐⭐" // update stars
      },
      // 2 new rows
      "Sam": {
        "name": "Sam",
        "age": 20,
        "stars": "⭐⭐"
      },
      "Ann": {
        "name": "Ann",
        "age": 20,
        "stars": "⭐⭐⭐"
      }
    }
  };
  updateLibrary_(libsets);


}



/** logs Json 
 * 
 * @param {json} j
 * @param  {any} chapter (optional)
 * 
*/
function logJson_(j, chapter) {
  if (chapter) {
    console.log('*************************  << ' + chapter + ' >>  **************************');
  }
  console.log(JSON.stringify(j, null, 2))
}




// Settings from sheets
// test:
// https://script.google.com/u/0/home/projects/1GhlbHQx1ke_enwGc5G7kfVXio_5XMmfyNWMuOfWKi9vJioYzJlETMwMk/edit
var default_sheet2script_options = {
  // file: '1KKJLYfcXsZfI0DXLyobiLVMz-vnMRO_R6or73ENeZKw',
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
/*********************************************               ************************************** */
/**********************************************             *************************************** */
/**************************************************      ****************************************** */


//   _    _          
//  | |  | |         
//  | |  | |___  ___ 
//  | |  | / __|/ _ \
//  | |__| \__ \  __/
//   \____/|___/\___|
/**
 * get standard
 * 
 * @param {string} sets.file
 * @param {string} sets.sheet
 * 
 */
function getStandardSets_(sets) {
  var options = {
    file: sets.file,
    sets: {
      sheet: sets.sheet,
      row_marker: 2,
      func: data2jsonarray_
    }
  }
  var sets = getSetsFromSheets_(options);
  return {
    data: sets.sets,
    sets: sets.sets__sheetoptions
  };
}

/**
 * get sets grouped by key into objects
 * 
 * @param {string} sets.file
 * @param {string} sets.sheet
 * @param {string} sets.key
 * 
 */
function getGroupedSets_(sets) {
  var task_source_settings = {
    file: sets.file,
    sets: {
      sheet: sets.sheet,
      key: sets.key,
      row_tags: 1,
      row_marker: 2, // use to create self-description for data
      func: data2jsongroups_
    }
  }
  var sets = getSetsFromSheets_(task_source_settings);
  return {
    data: sets.sets,
    sets: sets.sets__sheetoptions
  };
}

/**
 * get json grouped by key
 * select last found value by group
 * 
 * @param {string} sets.file
 * @param {string} sets.sheet
 * @param {string} sets.key
 * 
 */
function getLibrarySets_(sets) {
  var task_source_settings = {
    file: sets.file,
    sets: {
      sheet: sets.sheet,
      key: sets.key,
      row_tags: 1,
      row_marker: 2, // use to create self-description for data
      func: data2library_
    }
  }
  var sets = getSetsFromSheets_(task_source_settings);
  return {
    data: sets.sets,
    sets: sets.sets__sheetoptions
  };
}


/**
 * get sets grouped by key into objects
 * 
 * @param {string} sets.file
 * @param {string} sets.sheet
 * @param {string} sets.key
 * 
 * @param {json} sets.data
 *  {
 *    "Max": {
 *        "name": Max,
 *        "age": 34
 *      }
 *     "Liu" {
 *        "name": Max,
 *        "age": 32
 *     }
 *  }
 * 
 */

function updateLibrary_(sets) {
  var sheetsets = getLibrarySets_(sets);
  var olddata = sheetsets.data;
  logJson_(sheetsets.sets, 'sheet sets')
	// {
  // "Max": {
  //   "__row_A1": "'library'!A5",
  //   "name": "Max",
  //   "age": 34,
  //   "stars": "⭐⭐⭐"
  // }
  var updates = [], inserts = [], task;
  var ss = getSpredsheetById_(sets.file);
  var sheet = ss.getSheetByName(sets.sheet);
  for (var key in sets.data) {
    if (key in olddata) {
      // add task on refreshing library data
      task = {
         row: olddata[key]["__row"],
         data: sets.data[key],
         olddata: olddata[key]
      }
      updates.push(task);
    } else {
      // add task on adding new Row
      task = {
        data: sets.data[key]
      }
      inserts.push(task);
    }
  }

  // do update tasks
  updateSheetLibrary_(updates, sheet, sheetsets.sets);

  // do insert tasks
  insertSheetLibrary_(inserts, sheet, sheetsets.sets);

}
/**
 * updates library by tasks
 */
function updateSheetLibrary_(tasks, sheet, sets) {
  // sets
  //   "header": [
  //   "name",
  //   "age",
  //   "stars"
  // ],
  // "row_data_starts": 5,
  // "column": 1,
  // "free_row": 8
  //

  // logJson_(tasks, 'update tasks');
  // [
  //   {
  //     "row": 7,
  //     "data": {
  //       "age": 6
  //     },
  //     "olddata": {
  //       "__row_A1": "'library'!A7",
  //       "name": "Leo",
  //       "age": 5,
  //       "stars": "⭐"
  //     }
  //   }
  // ]

  // TODO: eliminate number of calls
  var row = [], k, task, range, rownum = sets.free_row;
  for (var i = 0; i < tasks.length; i++) {
    task = tasks[i];
    // detect what to insert
    row = [];
    // get final row
    for (var ii = 0; ii < sets.header.length; ii++) {
      k = sets.header[ii];
      if (k === '') {
        row.push('');
      } else if (k in task.data) {
        row.push(task.data[k]);
      } else if (k in task.olddata) {
        row.push(task.olddata[k]);
      } else {
        row.push('');
      }
    }
    // insert new row
    range = sheet.getRange(
      task.row,
      sets.column,
      1,
      row.length
    );
    range.setValues([row]);
    rownum++;
  }

  return 0;
}

/**
 * 
 * @param {int} sets.
 * 
 */
function insertSheetLibrary_(tasks, sheet, sets) {
  // logJson_(tasks, 'insert tasks');
  // TODO: eliminate number of calls
  var row = [], k, task, range, rownum = sets.free_row;
  var data = []
  for (var i = 0; i < tasks.length; i++) {
    task = tasks[i];
    // detect what to insert
    row = [];
    // get final row
    for (var ii = 0; ii < sets.header.length; ii++) {
      k = sets.header[ii];
      if (k === '') {
        row.push('');
      } else if (k in task.data) {
        row.push(task.data[k]);
      } else {
        row.push('');
      }
    }
    data.push(row);
  }
	
  if (data.length === 0) {
    return 0;
  }

  // insert new rows
  range = sheet.getRange(
    rownum,
    sets.column,
    data.length,
    row.length
  );
  range.setValues(data);
  
  return 0;
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
 * convert data to arrays of json grouped by key
 * selects last found value by group
 * 
 * param {array} options.data 
 * param {array} options.header
 * param {string} options.key
 * param {number} options.row_data_starts
 * 
 */
function data2library_(options) {
  var tags = options.header; 
  var key = options.key;
  var start = options.row_data_starts -1;
  // loop rows
  var res = {}, chunk = {}, val, k;
  for (var i = start; i < options.data.length; i++) {
    chunk = {};
    chunk['__row'] = (i+1); // this may be rewritten by sets in Sheets
    for (var ii = 0; ii < tags.length; ii++) {
      if (tags[ii] !== '' && tags[ii] === key) {
        k = options.data[i][ii];
      }
      val = options.data[i][ii];
      chunk[tags[ii]] = val;
    }
    if (k && k!=='') {
      res[k] = chunk;
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
 * get Spredsheet
 * 
 * @param {string} id
 */
function getSpredsheetById_(id) {
  var file;
  if (id) {
    file = SpreadsheetApp.openById(id);
  } else {
    file = SpreadsheetApp.getActive();
  }
  return file;
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
  var file = getSpredsheetById_(ini_sets.file); 
  var sheetname, sheet, range;
  var sets_i, data, res = {};
  for (var k in ini_sets) {
    if (k !== 'file') {
      // get sets
      sets_i = ini_sets[k];
      // get sheet + range
      sheetname = sets_i.sheet || k;
      sheet = file.getSheetByName(sheetname);
      
      try {
        range = sheet.getDataRange();
      } catch (err) {
        console.log(sheetname);
        throw err;
      }
      // get data
      data = range.getValues();
      sets_i.data = data;
      setSheetsDataEndpoints_(sets_i);
      sets_i.column = range.getColumn();
      sets_i.free_row = findSheetFirstEmptyRow_(data);
      // add to the result
      res[k] = sets_i.func(sets_i);
      res[k + '__sheetoptions'] = sets_i;
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
    var row_stars = findTaggedValueInRow_(markers, marker_data_starts)
    // console.log('found row started = ' + row_stars)
    if (row_stars != null) {
      // end if found
      options.row_data_starts = parseInt(row_stars);
      return 0;
    }
  }
  // #2.3. defaults
  options.row_data_starts = 2;
  return 0;
}

/**
 * 
 * @param {string} search_marker - 'rowstart: '
 * @param {arary} markers - row with all markers + data
 */
function findTaggedValueInRow_(markers, search_marker) {
  // find row holding markers
  for (var i = 0; i < markers.length; i++) {
    // find text in a row where marker is ↓
    if (startsWith_(markers[i], search_marker)) {
      return markers[i].replace(
          search_marker, '');
    }
  }
}

/**
 * return last filled row
 * 
 */
// function test_findSheetFirstEmptyRow() {
//   var data = [
//     ['f'],['f'],['f'],['f'],['f'],
//     [''],['f'],['f'],['f'],['f'],
//     [''],[''],[''],[''],['']
//   ];
//   console.log(findSheetFirstEmptyRow_(data)); // 11

//   data = [
//     ['f'],['f']
//   ];
//   console.log(findSheetFirstEmptyRow_(data)); // 3
  
//   data = [
//     [''],['']
//   ];
//   console.log(findSheetFirstEmptyRow_(data)); // 1

//   data = [
//     ['f']
//   ];
//   console.log(findSheetFirstEmptyRow_(data)); // 2
// }
function findSheetFirstEmptyRow_(data) {
  for (var i = data.length -1; i>=0;i--) {
    if (data[i].join('') !== '') {
      return i+2;
    }
  }
  return 1;
}


/**
 * If text str starts with word
 * 
 * @param {string} str
 * @param {string} word
 */
function startsWith_(str, word) {
  str = '' + str;
  word = '' + word;
  return str.lastIndexOf(word, 0) === 0;
}
