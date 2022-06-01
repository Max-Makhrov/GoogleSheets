// 👋 https://github.com/Max-Makhrov/GoogleSheets/blob/master/other/dvl2022.gs
// 👀 'About' section further in the code
// Install: https://t.co/oKK9ARurUz



// Settings
function getLists_DVL_() {
  var lists = [
    
    // 1️⃣ 4-level lists, starting from column A, row 2
    // on sheet Dropdowns, data on 'Dictionary'!A2:E
    {  
      dict: "'Dictionary'!A2:E",
      sheet: "Dropdowns",
      // first_row: 2,
      // first_column: 'A'
      // stop_autocleanup: true,
      // stop_autocomplete: true
      // clear_notfound: true
    }, 
    
    // 2️⃣ 3-level lists, starting from row 2, columns M, N,... R 
    // on sheet Dropdowns, data on 'Countries'!A2:C
    { 
      dict: "'Countries'!A2:C",
      sheet: "Dropdowns",
      first_row: 2,
      display_values: true,
      columns: [13, 14, 18] // ['M', 'N', 'R']
    },
    
    // 3️⃣ last row of validation is 26
    {
      dict: "'Dictionary'!A2:E",
      first_row: 6,
      last_row: 26,
      sheet: 'Dropdowns+'
    },
    
    // 4️⃣ Use last item as range reference
    {
      dict: "'Ranges Dictionary'!A2:C",
      sheet: 'Dropdowns++',
      first_row: 6,
      last_is_range: true
    },
    
    // 5️⃣ One list depends on another
    {
      dict: "'Cross'!A2:B",
      sheet: 'Dropdowns',
      columns: ['N', 'U'],
      last_is_range: true
    },
    {
      dict: "'Cross2'!A2:B",
      sheet: 'Dropdowns',
      columns: ['M', 'W']
    },

    // Advanced
    {
      sheet: 'Advanced',
      dict: "'Ducks_Data'!A2:C",
      first_row: 3,
      first_column: 'A',
      stop_autocleanup: true
    },
    {
      sheet: 'Advanced',
      dict: "'Ducks_Data'!A2:C",
      first_row: 3,
      first_column: 'E',
      stop_autocomplete: true
    },
    {
      sheet: 'Advanced',
      dict: "'Ducks_Data'!A2:C",
      first_row: 3,
      first_column: 'I',
      clear_notfound: true
    },
    {
      sheet: 'Advanced',
      dict: "'Ducks_Data'!A2:C",
      first_row: 3,
      first_column: 'M'
    }

  ];
  return lists;
}
                               


// 📖 Contents
// select →
// press Ctrl+F12 → 
// go to definition
function dvl_contents_() {
  onEdit();
  getConfigDvl0_();
  parseConfigInfo_();
  onEdit_DVL_(); // ⭐
  dvl_row_(); // ❤️
  Tasker_();
  getDict_(); // cache
}




//   _______   _                           
//  |__   __| (_)                          
//     | |_ __ _  __ _  __ _  ___ _ __ ___ 
//     | | '__| |/ _` |/ _` |/ _ \ '__/ __|
//     | | |  | | (_| | (_| |  __/ |  \__ \
//     |_|_|  |_|\__, |\__, |\___|_|  |___/
//                __/ | __/ |              
//               |___/ |___/               
//
// Simple Triggers              
// Note: onEdit and onOpen are special function names, called
// simple triggers. They run automatically when user edits file, 
// or file is opened.
// ###1
function onEdit(e) {
  onEdit_DVL_(e);
  // add more functions if needed
}                             
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('♟️ dvl')
      .addItem('Refresh', 'clearMemory')
      .addToUi();
  clearMemory(); // refresh momory on open
}                              



//            _                 _   
//      /\   | |               | |  
//     /  \  | |__   ___  _   _| |_ 
//    / /\ \ | '_ \ / _ \| | | | __|
//   / ____ \| |_) | (_) | |_| | |_ 
//  /_/    \_\_.__/ \___/ \__,_|\__|
//
// Dependent Drop-Down Data Validation Lists (DVL)
// -----------------------------------------------
// Author:  @Max__Makhrov  
//          makhrov.max@gmial.com
//
// Thanks
//  ⭐
//    ⭐
//        ⭐
//               ⭐                     
//               Thanks so much for the idea
//               and sample script of super-fast           
//               cache DVL    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//               https://t.me/google_sheets/408
//               ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
// 
//  
// ♟️ Sample settings ↓  
/***************************************************** 
  // Sample of all possible sets,
  // required are with a star
    {                     
      dict: "'Dictionary'!A2:E",    // * range with data
      sheet: "Dropdowns",           // * sheet with validation
      first_row: 2,                 // row to start drop-down, default 2
      first_column: 'A',            // column to start, default: 'A
      last_row: 100500,             // last row, default: ∞ (infinity)
      columns: ['A', 'B', 'D'],     // columns with drop-down levels, default: null
      last_is_range: false,         // last value is A1-address: 'Sheet'!A1:A1500", default: false
      display_values: false         // use display values, default: false
      stop_autocomplete: false      // not auto-fill values, default: false
      stop_autocleanup: false       // not delete drop-downs if main is cleared, default: false
      clear_notfound: false         // delete drop-downs if nothing found, default: false
      
      // 🎁 Use another file
      //    #source_other_file
      // Use hidden param: dict_file = id of source file
      // Will work if you install onEdit trigger and give it permissions
      dict_file: '1ZDtY26f5VIIfkfo1CqCkKWxY2Su1D2DH0yOtuNKIFb4'
    }
***********************************************************/




//    _____             __ _       
//   / ____|           / _(_)      
//  | |     ___  _ __ | |_ _  __ _ 
//  | |    / _ \| '_ \|  _| |/ _` |
//  | |___| (_) | | | | | | | (_| |
//   \_____\___/|_| |_|_| |_|\__, |
//                            __/ |
//                           |___/ 
// config function,
// manipulations with config file,
// checks if config is set OK
// TODO: make a function instead of constant
function getConfigDvl0_() {
  return {
    // array of main sets for DVL
    lists: getLists_DVL_(), 
    // seconds of cashe to life,
    // after it rebuilds itself from sheet
    // 6 hours => maximum
    cashe_sec: 21600,
    // messages for the programm
    msgs: {
      trigger: 'Simple trigger cannot be launched from script body',
      err_dict: "The format of parameter [dict] must be: 'Sheet'!B3:C7. Current format: "
    },
    delim1: '_',
    defaults: {
      first_row: 2,
      first_column: 'A',
      last_row: 9999999
    },
    // set debud mode = true if you want to toast
    // errors of dependent lists
    debug_mode: false
  };
}
//
//
// this function returns new config with 
// all data needed for execution
// 
// In:  basic config
// Out: extended config and some checks
function parseConfigInfo_(sets) {
  // console.log(sets)
  // ↓
  // { lists: 
  //    [ { dict: 'Dictionary'!A2:E',
  //        sheet: 'Dropdowns',
  //        first_row: 2 },
  //    ... ],
  //   ...
  //   sheet: {},
  //   range: {} }
  // parse config info
  var lists = sets.lists; // dvl rules, preset by user
  var list = {}, 
      refs = {}, 
      ref = {}, 
      refKey = '', 
      refSheetName = '', 
      refRangeA1 = '',
      rangeA1bounds,
      lBoundA1,
      uBoundA1,
      num_levels,
      columns = [],
      numFirstColumn = 0; 
  for (var i = 0; i < lists.length; i++) {
    list = lists[i];
    // [ 1 ]. get reference object
    ref = {};
    refKey = list.dict;
    //
    // #source_other_file
    if (list.dict_file) { refKey = list.dict_file + list.dict; }
    //
    // [ 2 ]. extracts sheet name
    //        of dictionary for settings,
    //        extract and check reg range
    var regEx1 = new RegExp("^'?(.*?)'?\!(.*)$", "g");
    refSheetName = regEx1.exec(list.dict);
    if (!refSheetName || !refSheetName[1] || !refSheetName[2]) {
      throw sets.msgs.err_dict + list.dict + '. Not fit sheet regex or missed range. ';
    }
    ref.sheetName = refSheetName[1];
    refRangeA1 = refSheetName[2].replace(/\$/g, '').replace(/\d+/g, '');
    // [ 3 ]. check if range of 
    //        ref is valid and
    //        get number of levels
    rangeA1bounds = refRangeA1.split(':');
    if (!rangeA1bounds) {
      throw sets.msgs.err_dict + list.dict + '. Not fit range regex. ';
    }
    if (rangeA1bounds.length !== 2) {
      throw sets.msgs.err_dict + list.dict + '. Not fit range regex. ';
    }
    lBoundA1 = letterToColumn_(rangeA1bounds[0]);
    if (!lBoundA1) {
      throw sets.msgs.err_dict + list.dict + '. Invalid first column of range. ';
    }
    uBoundA1 = letterToColumn_(rangeA1bounds[1]);
    if (!uBoundA1) {
      throw sets.msgs.err_dict + list.dict + '. Invalid last column of range. ';
    }
    num_levels = uBoundA1 - lBoundA1 + 1;
    if (num_levels < 1) {
      throw sets.msgs.err_dict + list.dict + '. Invalid columns order of range. ';
    }
    ref.num_levels = num_levels;
    ref.range = list.dict;
    //
    // #source_other_file
    ref.file = list.dict_file;
    if (ref.file) {
      // add file id into key
      list.dict = ref.file + list.dict;
    }
    // 
    ref.rangeA1 = refRangeA1;
    ref.key = refKey;
    refs[refKey] = ref;
    list.ref = ref;
    // [ 4 ]. get dafaults
    // default first row = 2
    if (!list.first_row) { list.first_row = sets.defaults.first_row; }
    // default first column = A
    if (!list.first_column) { list.first_column = sets.defaults.first_column; }
    if (!list.last_row) { list.last_row = sets.defaults.last_row; }
    if (list.columns) {
      // use pre-set first column
      list.first_column = list.columns[0];
    }
    else {
      columns = [];
      numFirstColumn = letterToColumn_(list.first_column);
      for (var k = numFirstColumn; k < numFirstColumn + num_levels; k++) {
        // assign each column a letter
        columns.push(columnToLetter_(k));
      }
      list.columns = columns;
    }
    var num_columns = [];
    for (var j = 0; j < list.columns.length; j++) {
      num_columns.push(letterToColumn_(list.columns[j]));
    }
    list.num_columns = num_columns;
  }
  sets.refs = refs;
  // console.log(JSON.stringify(lists, null, 4))
  // console.log(JSON.stringify(refs, null, 4))
  // console.log(JSON.stringify(sets, null, 4))
  // ↓
  // { lists: 
  //    [ { dict: '\'Dictionary\'!A2:E',
  //        sheet: 'Dropdowns',
  //        first_row: 2,
  //        first_column: 'A',  ----------------------> + default 1st row and col
  //        ref: [Object] }, -------------------------> + ref object
  //    ... ],
  //   ...
  //   sheet: {},
  //   range: {},
  //   refs: -----------------------------------------> + refs
  //    { '\'Dictionary\'!A2:E': 
  //       { sheetName: 'Dictionary',
  //         file: undefined,
  //         range: '\'Dictionary\'!A2:E',
  //         key: '\'Dictionary\'!A2:E' },
  //      ... } }
  return sets;
}
//
// Fast way to convert letters to numbers and vice versa
//
// https://stackoverflow.com/questions/21229180
// function test_columnToLetter() {
//   console.log(letterToColumn_('a'));   // 1
//   console.log(letterToColumn_('A'));   // 1
//   console.log(letterToColumn_('B'));   // 2
//   console.log(letterToColumn_('z'));   // 26
//   console.log(letterToColumn_('AZ'));  // 52
//   console.log(letterToColumn_('AAZ')); // 728
//   console.log(columnToLetter_(1));    // A
//   console.log(columnToLetter_(2));    // B
//   console.log(columnToLetter_(26));   // Z
//   console.log(columnToLetter_(52));   // AZ
//   console.log(columnToLetter_(728));  // AAZ
//   console.log(columnToLetter_(5123)); // GOA
//   var badRes = letterToColumn_('AAZ$');
//   console.log(badRes); // null
// }
function columnToLetter_(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}
function letterToColumn_(letter)
{
  if (parseInt(letter) == letter) {
    // if column is already number
    return letter;
  }
  var column = 0, length = letter.length;
  var u_letter = letter.toUpperCase();
  if (/[^A-Z]/g.test(u_letter)) { return null; }
  for (var i = 0; i < length; i++)
  {
    column += (u_letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}
                               





//   __  __       _       
//  |  \/  |     (_)      
//  | \  / | __ _ _ _ __  
//  | |\/| |/ _` | | '_ \ 
//  | |  | | (_| | | | | |
//  |_|  |_|\__,_|_|_| |_|
// Functions for DVL
//
// function for trigger
function getTestEdit_DVL_() {
  console.log('testing onEdit function...')
  var f = SpreadsheetApp.getActive();
  var e = {
    test: true,
    source: f,
    range: f.getRange("Dropdowns!A4"),  // 'Dropdowns+'!A6:A26
    // value: 'DIDELPHIMORPHIA'
  }
  return e;
}
function onEdit_DVL_(e) {
  var sets = getConfigDvl0_();
  if (!e) { // launch test
    try {
      e = getTestEdit_DVL_();
    } catch (err) {
      console.log(sets.msgs.trigger);
      return -1;
    }  
  }
  try {
    sets.sheet = e.range.getSheet();
    sets.sheetName = sets.sheet.getName(); 
    sets.range = e.range,
    sets.value = e.value;
    // main data validation function
    dvl_(sets);
    // clear memory if it is ref-sheet
    clearMemory(sets.sheetName); 
  } catch(err) {
    if (sets.debug_mode) {
      // show error in debug mode
      SpreadsheetApp.getActive().toast(err.stack, 'Error', 10);
    }
    throw err; // to see error text in log
  }
  return 0; // OK
}
//
//
// this is main function for
// dvl, it finds & executes tasks
//       ↓↓↓
function dvl_(sets) {
  var config = parseConfigInfo_(sets);
  //
  // [[ 1 ]]. find all lists in area:
  //    - sheet
  //    - row
  //    - columns in level
  //    - columns not in last level
  var listsToDo = []; 
  var lists = config.lists;
  // console.log(config)
  // config.lists: [
  //   {
  //       "dict": "'Countries'!A2:C",
  //       "sheet": "Dropdowns",
  //       "first_row": 2,
  //       "columns": [
  //           "M",
  //           "N",
  //           "R"
  //       ],
  //       "ref": {
  //           "sheetName": "Countries",
  //           "num_levels": 3,
  //           "range": "'Countries'!A2:C",
  //           "rangeA1": "A:C",
  //           "key": "'Countries'!A2:C"
  //       },
  //       "first_column": "M",
  //       "num_columns": [
  //           13,
  //           14,
  //           18
  //       ]
  //   }
  // ]
  //
  var t0; // for timer tests
  // t0 = new Date();
  var sheetName = config.sheetName;
  // test times to read name from sheet
  // ~ 70-90 ms
  // console.log('time to read sheets name is ' + (new Date() - t0))
  var list, row, column, w, last_column, bool_level_in, bool_last_level_out, num_col;
  // for future for dvl
  var 
    // column of user iteraction
    dvl_num_column,   
    // index of level of user iteraction 
    dvl_index_level,  
    // minimal column for list
    list_min_column = Number.MAX_VALUE,
    // minimal column of dvl to read
    dvl_min_column = Number.MAX_VALUE,
    // maximum column of user iteraction with dvl
    dvl_max_column = 0;
  var connectedLists = {}, connectedTasks = {};
  var use_display_values = false;
  var use_values = false;
  for (var i = 0; i < lists.length; i++) {
    list = lists[i];
    // note: use nested ifs to reduce
    //       execution time
    //
    // sheet
    if (sheetName === list.sheet) {
      // t0 = new Date();
      row = row || config.range.getRow();
      // test times to read row from range
      // ~ 0-2 ms
      // console.log('time to read ranges row is ' + (new Date() - t0))
      //
      // row
      // 
      // console.log('row = ' + row + ', list.first_row = ' + list.first_row)
      if (row >= list.first_row) {
        connectedLists[list.num_columns.join(config.delim1)] = 
          {columns: list.num_columns};
        connectedTasks[list.num_columns.join(config.delim1)] = list;
        // t0 = new Date();
        column = column || config.range.getColumn();
        // console.log('time to read ranges column is ' + (new Date() - t0));
        // console.log(column);
        // t0 = new Date();
        w = w || config.range.getWidth();
        // test times to read columns and width from range
        // ~ 0-2 ms
        // console.log('time to read ranges height is ' + (new Date() - t0));
        // console.log(h);
        last_column = last_column || column + w - 1;
        // console.log({last_column: last_column});
        //
        // columns in level
        bool_level_in = false;
        // columns not in last level
        bool_last_level_out = true;
        // loop dvl columns
        dvl_columns_in = [];
        list_min_column = 9999999;
        for (var j = 0; j < list.num_columns.length; j++) {
          num_col = list.num_columns[j];
          // find minimal column for list
          if (list_min_column > num_col) {
            list_min_column = num_col;
          }
          // console.log('num_col to decide = ' + num_col)
          if (num_col >= column && num_col <= last_column) { 
            bool_level_in = true; 
            dvl_num_column = num_col;
            dvl_index_level = j;
          }
          if (
            j === (list.num_columns.length - 1) &&
            num_col >= column &&
            num_col <= last_column
          ) { bool_last_level_out = false; }  
        } // dvl columns
        if (bool_level_in && bool_last_level_out) {
          // 🎖️🎖️🎖️
          // add this list
          // into ToDo's
          list.dvl_num_column = dvl_num_column;
          list.dvl_index_level = dvl_index_level;
          listsToDo.push(list);
          if (list.display_values) {
            use_display_values = true;
          } else {
            use_values = true;
          }
          // set minimal column of dvl
          if (dvl_min_column > list_min_column) {
            dvl_min_column = list_min_column;
          }
          if (dvl_max_column < dvl_num_column) {
            dvl_max_column = dvl_num_column;
          }
        }
      } // row
    } // sheet
   // 
  } // lists
  //
  // test connected lists
  // console.log(connectedLists);
  // { '1_2_3_4_5': { columns: [ 1, 2, 3, 4, 5 ] },
  //   '13_14_18': { columns: [ 13, 14, 18 ] },
  //   '14_21': { columns: [ 14, 21 ] },
  //   '13_23': { columns: [ 13, 23 ] } }
  //
  // modify: add connections
  dvl_setListsConnections_(connectedLists);
  // console.log(connectedLists);
	// { '1_2_3_4_5': { columns: [ 1, 2, 3, 4, 5 ] },
  // '13_14_18': { columns: [ 13, 14, 18 ], kids: { '14': ['14_21'] } },
  // '14_21': { columns: [ 14, 21 ], parentKey: '13_14_18' },
  // '13_23': { columns: [ 13, 23 ] } }
  //
  // test main lists to do
  // console.log('lists to do: ' + JSON.stringify(listsToDo, null, 4));
  // [
  //   {
  //       "dict": "'Dictionary'!A2:E",
  //       "sheet": "Dropdowns",
  //       "ref": {
  //           "sheetName": "Dictionary",
  //           "num_levels": 5,
  //           "range": "'Dictionary'!A2:E",
  //           "rangeA1": "A:E",
  //           "key": "'Dictionary'!A2:E"
  //       },
  //       "first_row": 2,
  //       "first_column": "A",
  //       "columns": [
  //           "A",
  //           "B",
  //           "C",
  //           "D",
  //           "E"
  //       ],
  //       "num_columns": [
  //           1,
  //           2,
  //           3,
  //           4,
  //           5
  //       ],
  //       "dvl_num_column": 2,
  //       "dvl_index_level": 1
  //   }
  // ]
  // console.log(dvl_min_column); // for reading from
  // console.log(dvl_max_column); // for reading to

  //
  //
  // continue only in case
  // some rules matched the user
  // changes
  //  👀
  if (listsToDo.length > 0) {
    // console.log('have ' + listsToDo.length + ' lists to do');
    // [[ 2 ]]. read data for dvl
    //    - find maximum look area
    //         - left bound - minimum coulmn number of any dvl
    //         - right bound - maximum check level of any dvl
    //         - get array of columns
    //    - read values
    //        - value = single cell?
    //        - get all values
    //
    var left_bound = dvl_min_column;
    var right_bound = dvl_max_column;
    // columns array for reading data
    // on any level of any dvl
    //  👀
    var read_columns_array = []; 
    for (var k = left_bound; k <= right_bound; k++) {
      read_columns_array.push(k);
    }
    // console.log(read_columns_array)
    // [1, 2]
    //
    // if read area = single cell
    // t0 = new Date();
    var h = config.range.getHeight();
    // test times to read height from range
    // 0-2 ms
    // console.log(new Date() - t0)
    var read_values = []; // 2dArray
    var display_values = [];
    var read_range;
    if (use_values) {
      if (h === 1 && left_bound===right_bound && config.value) {
        read_values = [[config.value]];
      } else {
        // heavy operaton of reading data from sheet
        // t0 = new Date();
        read_range = config.sheet.getRange(row, dvl_min_column, h, right_bound - left_bound + 1);
        // speed test
        // read range from sheet
        // 3-4 ms
        // console.log('Time to get range from sheet = ' + (new Date() - t0));
        // t0 = new Date();
        // use display values?
        read_values = read_range.getValues();
        // speed test
        // read data from range
        //     light file, 
        //     range of 2 cells 
        //     ~ 60-150ms and more
        //     cannot predict the speed of reading data
        // console.log('Time to read range values = ' + (new Date() - t0));
      }
    //             👀
    // console.log(read_values); // [ [ 'MICROBIOTHERIA', 'Microbiotheriidae' ] ]
    } 
    if (use_display_values) {
      read_range = config.sheet.getRange(row, dvl_min_column, h, right_bound - left_bound + 1);
      display_values = read_range.getDisplayValues();
    }

    //
    //
    // [[ 3 ]]. loop lists
    //    - see last visible level
    //    - extract all-level values for dvl from entered data
    //           - by column numbers of dvl levels   
    //    - loop dvl list by rows
    //           - empty value → 
    //                - tasks on kill dv + kill value to the end of levels
    //           - not empty value
    //                - get dictionary
    //                - loop levels to the end
    //                      - only value
    //                            - set value, see next dvl
    //                      - not only value
    //                            - stop loop 
    //    - execute
    //
    var todo, data = [], col_find, col_index, datarow = [];
    var cc, bool_clear_next = false, node;
    // holder for saved in memory dictionaties
    // for multi-row validation
    Dicts = {};
    var Tasker = Tasker_(config.sheet);
    for (var i = 0; i < listsToDo.length; i++) {
      todo = listsToDo[i];
      // console.log(listsToDo[i])
      //             ↓↓↓
      // { dict: '\'Dictionary\'!A2:E',
      //   sheet: 'Dropdowns',
      //   ref: 
      //    { sheetName: 'Dictionary',
      //      num_levels: 5,
      //      file: undefined,
      //      range: '\'Dictionary\'!A2:E',
      //      rangeA1: 'A:E',
      //      key: '\'Dictionary\'!A2:E' },
      //   first_row: 2,
      //   last_row: 26,
      //   first_column: 'A',
      //   columns: [ 'A', 'B', 'C', 'D', 'E' ],
      //   num_columns: [ 1, 2, 3, 4, 5 ],
      //   dvl_num_column: 1,
      //   dvl_index_level: 0 }
      //
      // need to work
      //   1. row -- number of row edited
      //   2. h   -- number of rows edited
      //   3. read_values -- 2d array values of range in columns:
      //   4. read_columns_array -- 1d array
      //   5. todo.num_columns -- number of columns of levels
      //   6. todo.dvl_num_column -- column of current level
      //   7. todo.dvl_index_level -- index of current level
      //
      // [ 1 ]. get data
      // loop rows of edit
      // and loop columns of dvl
      data = [];
      for (var rr = 0; rr < h; rr++) {
        datarow = [];
        for (var cc = 0; cc <= todo.dvl_index_level; cc++) {
          col_find = todo.num_columns[cc];
          col_index = read_columns_array.indexOf(col_find);
          if (todo.display_values) {
            datarow.push(display_values[rr][col_index]);
          } else {
            datarow.push(read_values[rr][col_index]);
          }
        }
        data.push(datarow);
      }
      //             💼
      // console.log(data);
      // 	[ [ 'MICROBIOTHERIA', 'Microbiotheriidae' ] ]

      //
      // [ 2 ]. add tasks
      //
      // loop edited rows
      //   1. rr -- number of row edited
      //   2. ii -- index of current level
      //   3. cc -- number of dvl column
      //   4. datatow -- row of known values up to current level
      // console.log('will loop rows ' + rr + ' to ' + (row + h - 1));
      var max_row_dvl = row + h - 1;
      if (max_row_dvl > todo.last_row) {
        max_row_dvl = todo.last_row;
      }
      // check last row of sets
      // Browser.msgBox(
      //   'todo.last_row = ' + todo.last_row + 
      //   ', row = ' + row + 
      //   ', h = ' + h);
      for (var rr = row; rr <= max_row_dvl; rr++) {
        // send row for validation
        var dvl_row_set = {
          datarow: datarow = data[rr - row],
          rr: rr,
          todo: todo,
          connectedLists: connectedLists,
          connectedTasks: connectedTasks,
          config: config
        };
        dvl_row_(dvl_row_set, Tasker, Dicts);
      } // end of row in dvl todo
    } // end of dvl todos loop

    // [ 3 ]. execute
    // "setValues":              { func: setValuesRange,      useValue: 'collect' },
    // "setDataValidation":      { func: setDataValidation,   useValue: 'group'  },
    // "setRangeValidation":     { func: setRangeValidation,  useValue: 'group'  },
    // "clearDataValidation":    { func: clearDataValidation, useValue:  false }  
    Tasker.run('setDataValidation');
    Tasker.run('setRangeValidation');
    Tasker.run('setValues');
    Tasker.run('clearDataValidation');
    //
  } // end of dvl executions

  // 
  // update references if needed
  //
  var ref;
  for (var ref_k in config.refs) {
    // config.refs: {
    //     "'Dictionary'!A2:E": {
    //         "sheetName": "Dictionary",
    //         "num_levels": 5,
    //         "range": "'Dictionary'!A2:E",
    //         "rangeA1": "A:E",
    //         "key": "'Dictionary'!A2:E"
    //     },
    ref = config.refs[ref_k];
    if (ref.sheetName === sheetName && !ref.file) {
      invalidateCache_(ref_k);
      console.log('cleared cache 4 ' + ref_k);
    }
  }


  // prolongate cache memory (?)
  // 2021/06 => no to prevent conflicts
  return 0;
}


// var dvl_row_set = {
//   datarow: datarow = data[rr - row],
//   rr: rr,
//   todo: todo,
//   connectedLists: connectedLists,
//   connectedTasks: connectedTasks,
//   config: config
// };
// ❤️
function dvl_row_(set, Tasker, Dicts) {
  // ##1. Set.
  // from set
  var 
    // loop dvl columns starting from current level
    // console.log(datarow);
    //	[ 'MICROBIOTHERIA', 'Microbiotheriidae' ]
    datarow = set.datarow, // [1, 2, 3]
    // console.log(rr); 
    // num of current row
    rr = set.rr
    todo = set.todo,
    config = set.config,
    connectedLists = set.connectedLists, 
    connectedTasks = set.connectedTasks;
  // console.log(rr); // num of current row
  // other vars
  var 
    next_value = null,
    next_list = null,
    next_rangeA1 = null,
    next_list_key = null;
  // console.log(datarow);
  //	[ 'MICROBIOTHERIA', 'Microbiotheriidae' ]
  //
  // decide: need read dictionary or not
  // read dictionary if needed
  var bool_clear_next = false;
  last_user_value = datarow[datarow.length - 1];
  var dict;
  if (
    (!last_user_value || 
    last_user_value === '') &&
    !todo.stop_autocleanup
    ) {
    bool_clear_next = true; // clear values for next levels
    // console.log('clear next levels for row ' + rr);
  } else {
    // read dictionary
    dict = Dicts[todo.dict];
    if (!dict) {
      // read from memory
      // console.log('read dict')
      // // display values
      // console.log();
      // // dict object
      // console.log(config.refs[todo.dict]);
      //
      // t0 = new Date();
      dict = getDict_(todo.ref, config.cashe_sec, todo.display_values);
      // test time to get dictionary
      // from sheet 
      // ~1400 ms
      // from cache
      // ~70ms
      // console.log('Time to get dictionary = ' + (new Date() - t0))
      Dicts[todo.dict] = dict; // write to script memory
    } else {
      // console.log('Saved time! Took Dict from Mem')
    }
  }
  // find next node
  node = dict; // first node is whole dictionary
  for (var lvl = 0; lvl < (datarow.length - 1); lvl++) {
  // node minus level to find next in loop
    if (node) {
      node = node[datarow[lvl]];
    }
  }

  //
  //
  // ##n.
  // // note: clear content is same as set value ''
  // "setValues":              { func: setValuesRange,      useValue: 'collect' },
  // "setDataValidation":      { func: setDataValidation,   useValue: 'group'  },
  // "setRangeValidation":     { func: setRangeValidation,  useValue: 'group'  },
  // "clearDataValidation":    { func: clearDataValidation, useValue:  false }
  var dvl_dependent_tasks = [];
  for (var ii = todo.dvl_index_level; ii < todo.num_columns.length; ii++) {
  //       ^ current level                 ^^^ number of levels 
    // current level column
    cc = todo.num_columns[ii];
    // console.log(cc);
    // use
    //
    //
    // ###n.1. 
    // Add to Tasker
    // next_value, next_list, next_rangeA1;
    if (next_value !== null) {
      // add task on next value
      Tasker.put('setValues', [rr], [cc], next_value);
      
      // ###n.1.!
      // check if dependent valus from
      // other lists trigger this
      // auto-added value
      var colL = todo.num_columns.join(config.delim1);
      var dependent_node = connectedLists[colL];
      if (dependent_node) {
        var kids = dependent_node.kids;
        if (kids) {
          // console.log(kids);
          // console.log(cc);
          // console.log(next_value);
          var dependent_keys = kids['' + cc];
          if (dependent_keys) {
            var dK;
            for (var iii = 0; iii < dependent_keys.length; iii++) {
              dK = dependent_keys[iii];
              // console.log(dK);
              var dependent_task = connectedTasks[dK];
              if (dependent_task) {
                dependent_task.dvl_index_level = 0;
                var dvl_row_set = {
                  datarow: [next_value],
                  rr: rr,
                  todo: dependent_task,
                  connectedLists: connectedLists,
                  connectedTasks: connectedTasks,
                  config: config
                };
                // run dependent task!
                dvl_dependent_tasks.push(dvl_row_set);
              }
            }
          }
        }
      }
       if (next_value === '') {
        // add task on clear data validation
        Tasker.put('clearDataValidation', [rr], [cc], 'clear');
      }
    }
    if (next_list !== null && next_list) {
      // add task on validation from list
      // console.log(
      //   'for column ' + 
      //   cc + 
      //   ' set task on validation with list => ' + 
      //   JSON.stringify(next_list));
      Tasker.put('setDataValidation', [rr], [cc], next_list_key, next_list)
    }
    if (next_rangeA1 !== null && next_rangeA1) {
      // add task on validation from range
      Tasker.put('setRangeValidation', [rr], [cc], next_rangeA1);
    }
    //
    //
    // ###n.2.
    // decision maker         
    if (bool_clear_next) {
      next_value = ''; // to clear all next levels
    } else {
      // find out next actions
      //
      // check next node for this level
      if (node && datarow[ii]) {
        // find next level only if is not array
        // in other case end
        if (Object.prototype.toString.call(node) === '[object Array]') { 
          //   ^ is array: https://stackoverflow.com/a/20956445/5372400
          node_values = node;
        } else {
          // console.log('Trying to find next node by key = ' + datarow[ii])
          node = node[datarow[ii]];
          if (Object.prototype.toString.call(node) === '[object Array]') {
            node_values = node;
          } else if (node) {
            node_values = Object.keys(node);
          }
        }
      } else {
        // no next row value for node
        node = null;
      }
      // if node was found
      if (node) {
        // console.log('Node is ' + JSON.stringify(node))
        // console.log('Node values is ' + JSON.stringify(node_values));
        // list is range
        // and next level is final
        if (todo.last_is_range && ii === (todo.num_columns.length - 2)) {
          // set task to range validation
          next_value = null;
          next_list = null;
          next_rangeA1 = node_values[0];
          next_list_key = null;
        } else {
          // use usual rules for validation
          next_value = null;
          next_list = node_values;
          next_rangeA1 = null;
          next_list_key = datarow[ii];
          // if node value is the only one
          if (
            node_values.length === 1 &&
            !todo.stop_autocomplete
          ) {
            next_value = node_values[0];
            datarow.push(next_value); // to find next list
          }
        } // getting tasks for next level
      } else {
        // next node is null
        // do not perform any actions
        next_value = null;
        if (todo.clear_notfound) {
          next_value = ''; // will clear next values
        }
        next_list = null;
        next_rangeA1 = null;
        next_list_key = null;
      } // node => something found
    } // not task for clearing range
  } // end of level in dvl todo

  // ###nn. 
  // Run dependent tasks
  for (var i = 0; i < dvl_dependent_tasks.length; i++) {
    // console.log('Send dependent task!');
    dvl_row_(dvl_dependent_tasks[i], Tasker, Dicts);
  } 
}


// function test_dvl_setListsConnections() {
//   dvl_setListsConnections_();
// }
function dvl_setListsConnections_(nodes) {
  // function modifys original object
	var nodes = nodes || {
		tom: {columns: [1,2,4]},
		ben: {columns: [2,6]},
		sam: {columns: [2,8]},
		ron: {columns: [8,1]},   // violates → circular dependency
		max: {columns: [2,3,4]}, // violates → 2 to 1 (let it be)
    ken: {columns: [4,10]},
    liu: {columns: [10,11]}, 
    vue: {columns: [22,23]}, // independent
	};

  // find first parent
  var findFirstParentKey_ = function(column) {
    var node = {}, columns;
    for (var k in nodes) {
      node = nodes[k];
      columns = node.columns;
      for (var i = 1; i < columns.length; i++) {
        // look    ↑
        // starting from 2-d element
        if (columns[i] === column) {
          return k;
        }
      }
    }
    return null;
  }

  // find all parents
  var node, column1, parentKey;
  var kids = null, kidsset;
  for (var k in nodes) {
    node = nodes[k];
    column1 = node.columns[0];
    // find parents for column1 if possible
    parentKey = findFirstParentKey_(column1);
    if (parentKey) {
      // add parent & node
      nodes[k].parentKey = parentKey;
      kids = nodes[parentKey].kids || {};
      kidsset = kids[column1] || [];
      kidsset.push(k);
      kids[column1] = kidsset;
      nodes[parentKey].kids = kids;
    }
  }

  // break circular dependencies
  // list connections starting from 1 node
  var breakCircularDependenses = function(nodes, k, memory) {
    
    // defaults
    if (!memory) { memory = {} }

    // conditions to exit loop
    var node = nodes[k];
    if (!node) {
      return memory;
    }
    var kids = node.kids;
    if (!kids) {
      return memory;
    }
    // the k was used!
    // circular dependency
    // detected
    // delete this connection!
    if (memory[k]) {
      console.log('circular! ' + JSON.stringify(memory) + ' ' + k);
      // delete bad connection
      var bad;
      for (var memK in memory) {
        if (memory[memK].key === k) {
          bad = memory[memK];
        }
      }
      // console.log(bad);
      // 	{ key: 'tom', parent: 'ron', column: '1' }
      // delete from node badK kid: k
      var badNode = nodes[bad.parent];
      var badKids = badNode.kids;
      var badKidsColumn = badKids[bad.column];
      var goodKidsColumn = [];
      for (var i = 0; i < badKidsColumn.length; i++) {
        if (badKidsColumn[i] !== k) {
          goodKidsColumn.push(badKidsColumn[i]);
        }
      }
      nodes[bad.parent].kids[bad.column] = goodKidsColumn;
      return memory;
    }
    
    // actions
    var kidsKeys, kidK;
    for (var col_k in kids) {
      kidsKeys = kids[col_k];
      for (var i = 0; i < kidsKeys.length; i++) {
        kidK = kidsKeys[i];
        memory[k] = {key: kidK, parent: k, column: col_k};
        breakCircularDependenses(nodes, kidK, memory);
      }
    }
    return memory;
  }

  for (var k in nodes) {
    breakCircularDependenses(nodes, k);
  }

  // console.log(JSON.stringify(nodes, null, 4));

  return nodes;

}

                               











//   _______        _             
//  |__   __|      | |            
//     | | __ _ ___| | _____ _ __ 
//     | |/ _` / __| |/ / _ \ '__|
//     | | (_| \__ \   <  __/ |   
//     |_|\__,_|___/_|\_\___|_|  
// idea:
// https://github.com/Max-Makhrov/Smart-Data-Validation-in-Goolge-Sheets/blob/master/%23Tasker.gs
//
// Tasker is a function for faster operating with one sheet:
//     - set values
//     - set data validation
//     - delete data validation
//     - etc. if needed...
// 
// Important note:
//     - if tasks intersects, the final rule overwrites previous
//
//
// function test_Tasker() {
//   // [ 1 ]. test speed quality of Tasker
//   //        result:
//   //          number of cells: 16
//   //          number of ranges: 2
//   //          => Tasker 20ms VS setValue 120ms
//   //             6 times faster
//   var sheet = SpreadsheetApp.getActive().getSheetByName('testdots');
//   var t1 = new Date();
//   var tasker = Tasker_(sheet);
//   tasker.put("setValues", [11, 12], [2, 3, 4, 5, 6, 7], 'Test');
//   tasker.put("setValues", [2, 3], [2, 3], 'Test2');
//   var t2 = new Date();
//   console.log('time to get Tasker, ms = ' + (t2 - t1))
//   tasker.run("setValues");
//   var t3 = new Date();
//   console.log('time to set Tasker, ms = ' + (t3 - t2));
//   // run same with setValue
//   for (var rn = 2; rn < 4; rn++) {
//     for (var rc = 2; rc < 4; rc++) {
//       sheet.getRange(rn, rc).setValue('foo')
//     }
//   }
//    for (var rn = 11; rn < 13; rn++) {
//     for (var rc = 2; rc < 8; rc++) {
//       sheet.getRange(rn, rc).setValue('foo')
//     }
//   } 
//   var t4 = new Date();
//   console.log('setValue, ms = ' + (t4 - t3));
//   // 
//   // [ 2 ]. Execution tests
//   tasker.put("setDataValidation", [1], [2, 3], 'Test2', ['a1','b1']);
//   // overwrite dots
//   tasker.put("setDataValidation", [1], [2, 3], 'Test3', ['a2','b2']);
//   // run with no result
//   tasker.run();
//   // add more rules
//   tasker.put("setDataValidation", [5, 6, 7], [2, 3, 5], 'Test4', ['a3','b3']);
//   // set sata validation from array-list
//   tasker.run("setDataValidation");
//   // setRangeValidation
//   tasker.put('setRangeValidation', [5, 6], [5, 6, 7], "'Ranges Dictionary'!H2:H");
//   tasker.run('setRangeValidation');
//   // clearDataValidation
//   tasker.put('clearDataValidation', [5, 6], [6], "test");
//   tasker.run('clearDataValidation');
// }
//
//
// ~~~~~ Tasker
function Tasker_(sheet) {
  // [[ 1 ]]. Definitions
  var self = this;
  self.sheet = sheet;
  self.task_types = 
  {
    // note: clear content is same as set value ''
    "setValues":              { func: setValuesRange,      useValue: 'collect' },
    "setDataValidation":      { func: setDataValidation,   useValue: 'group'  },
    "setRangeValidation":     { func: setRangeValidation,  useValue: 'group'  },
    "clearDataValidation":    { func: clearDataValidation, useValue:  false }
  }
  self.tasks = {dots: [], subtasks: {}, dot_collector: {}};
  self.got_count = 0; // number of item in get
  //
  //
  // [[ 2 ]]. Executing functions
  //
  // set values
  function setValuesRange(rangeGroups, subtasks) {
    //
    // "subtasks": {
    //   "setValues_Test": {
    //       "value": "Test"
    //   },
    //   "setValues_Test2": {
    //       "value": "Test2"
    //   },
    //
    // rangeGroups =
    // {"self": {
    //     "1": {
    //         "dots": [
    //             {
    //                 "row": 1,
    //                 "column": 3,
    //                 "type": "setValues",
    //                 "subKey": "setValues_Test2"
    //             }
    //         ],
    //         "w": 1,
    //         "h": 1,
    //         "row": 1,
    //         "column": 3
    //     },
    var sheet = self.sheet;
    var collection = {}, group = {}, range, dots, data = [], row = [], k = 0;
    var sotrDotsF = function(a, b) {
      if (a.row === b.row) {
        return a.column - b.column;
      }
      return a.row - b.row;
    }
    for (var key in rangeGroups) {
      // self
      collection = rangeGroups[key];
      for (var ckey in collection) {
        group = collection[ckey];
        range = sheet.getRange(group.row, group.column, group.h, group.w);
        dots = group.dots;
        dots.sort(sotrDotsF);
        k = 0, data = [];
        // collect values
        for (var i = 0; i < group.h; i++) {
          row = [];
          for (var ii = 0; ii < group.w; ii++) {
            row.push( subtasks[dots[k].subKey].value );
            k++;
          }
          data.push(row);
        }
        // execute action =)
        range.setValues(data); 
      } // collection → range group
    }
    return 0;
  }
  // 
  // set validation from list
  function setDataValidation(rangeGroups, subtasks) {
    //         rule = (SpreadsheetApp
    //                 .newDataValidation()
    //                 .requireValueInList(validation.sort())
    //                 .build());
    //
    //
    // "subtasks": {
    //   "setDataValidation_Test2": {
    //       "value": "Test2",
    //       "list": [
    //           "a",
    //           "b"
    //       ]
    //   },
    // 
    var sheet = self.sheet;
    var collection = {}, group = {}, list, rule;
    for (var key in rangeGroups) {
      // self
      collection = rangeGroups[key];
      for (var ckey in collection) {
        group = collection[ckey];
        range = sheet.getRange(group.row, group.column, group.h, group.w);
        list = subtasks[group.dots[0].subKey].list;
        // execute action =)
        rule = (SpreadsheetApp
                .newDataValidation()
                .requireValueInList(list)
                .build())
        range.setDataValidation(rule);
      } // collection → range group
    }
    return 0;
  }
  function setRangeValidation(rangeGroups, subtasks) {
    var sheet = self.sheet;
    var collection = {}, group = {}, rA1, r, rule;
    var f = SpreadsheetApp.getActive();
    for (var key in rangeGroups) {
      // self
      collection = rangeGroups[key];
      for (var ckey in collection) {
        group = collection[ckey];
        range = sheet.getRange(group.row, group.column, group.h, group.w);
        rA1 = subtasks[group.dots[0].subKey].value;
        r = f.getRange(rA1);
        // execute action =)
        rule = (SpreadsheetApp
                .newDataValidation()
                .requireValueInRange(r)
                .build())
        range.setDataValidation(rule);
      } // collection → range group
    }
    return 0;
  }
  function clearDataValidation(rangeGroups, subtasks) {
    var sheet = self.sheet;
    var collection = {}, group = {};
    var f = SpreadsheetApp.getActive();
    for (var key in rangeGroups) {
      // self
      collection = rangeGroups[key];
      for (var ckey in collection) {
        group = collection[ckey];
        range = sheet.getRange(group.row, group.column, group.h, group.w);
        // execute action =)
        range.setDataValidation(null);
      } // collection → range group
    }
    return 0; 
  }
  //
  //
  // [[ 3 ]]. Function: get tasks from self
  self.get_ = function() {
      // get all tasks in proper form
      var tasks = self.tasks;
      // [ 1 ]. 
      // get subtasks
      // {"setValues_Test":{"value":"Test"},"setValues_Test2":{"value":"Test2"}}
      var subTaks = tasks.subtasks;

      // [ 2 ]. get dot_collector
      var dot_collector = tasks.dot_collector;
      // dot collector is an object of unique dottype groups
      // dottupe group has a key:
      //    - taskType
      // dots inside group have a key of 2 parts
      //     - row
      //     - column
      var dots = tasks.dots;
      //
      // check if all is found
      var got_count = self.got_count;
      var dotKey = '', dot, o_dot, o_dottype_group;
      for (var i = got_count; i < dots.length; i++) {
        got_count++;

        // [ 2.1 ] get dot group
        dot = dots[i];
        o_dottype_group = dot_collector[dot.type] || {};

        // [ 2.2 ] get dotKey
        dotKey =  dot.row + '_' + dot.column;

        // [ 2.3 ] get/set dot object from dot_collector
        o_dot = o_dottype_group[dotKey];
        if (o_dot) {
          console.log('have to rewrite dot: ' + JSON.stringify(o_dot));
        }
        o_dottype_group[dotKey] = dot; // replace with dot

        // [ 2.4 ] rewrite dot group
        dot_collector[dot.type] = o_dottype_group
      }
      self.got_count = got_count; // stop parsing next time
      tasks.dot_collector = dot_collector;
      return tasks;
  };
  //
  //
  // [[ 4 ]]. Object for user
  return {
    put: function(taskType, rows, columns, value, list) {
      // add task to memory
      // taskType: setValues, setDataValidation, etc.
      // rows:     [111, 112, 113]
      // columns:  [2, 4, 6]
      // value:    'boo' or null
      // list:     ['a', 'b'] or null

      // [ 1 ]. get subtask
      // subtask is a task without cells
      // it has a key of 2 parts:
      //     - task_Type
      //     - value (if some) 
      var subtasks = self.tasks.subtasks;
      var subKey = taskType;
      if (value) { 
        subKey += '_' + value;
      }
      if (list) {
        subKey += '_' + list.join();
      }
      var new_subtask = 
      {
        value: value,
        list: list
      }
      // rewrite or write subtask
      subtasks[subKey] = new_subtask;

      // [ 2 ]. get dots
      var dot = {};
      for (var i = 0; i < rows.length; i++) {
        for (var ii = 0; ii < columns.length; ii++) {
          dot = {
            row: rows[i],
            column: columns[ii],
            type: taskType,
            subKey: subKey // to connect with sub-task
          }
          self.tasks.dots.push(dot);
        }
      }
      return 0;
    },
    run: function(taskType) {
      // [ 0 ]. ini
      if (!taskType) { return -1; }
      var tasks = self.get_(); // get task object
      var dot_collector = tasks.dot_collector;
      var collection = dot_collector[taskType];
      // console.log(collection);
      if (!collection) { return -1; }
      var oType = self.task_types[taskType];
      if (!oType) { return -3; }
      var subtasks = tasks.subtasks;
      if (!subtasks) { return -4; }
      //
      //
      // [ 1 ]. group by value if needed
      var collections = {};
      // group by subKey
      if (oType.useValue === 'group') {
        // "setValues":              { func: setValuesRange,      useValue: 'collect' },
        // "setDataValidation":      { func: setDataValidation,   useValue: 'group'  },
        // "clearDataValidation":    { func: clearDataValidation, useValue:  false }
        var cckey = '', ccelement = {}, node = {};
        for (var ckey in collection) {
          ccelement = collection[ckey];
          // { '1_2': 
          //    { row: 1,
          //      column: 2,
          //      type: 'setDataValidation',
          //      subKey: 'setDataValidation_Test3' },}
          cckey = ccelement.subKey; // setDataValidation_Test3
          node = collections[cckey] || {};
          node[ckey] = ccelement;
          collections[cckey] = node;
        }
      } else {
        collections = {self: collection};
      }
      //
      //
      // [ 2 ]. group gots by maximum area
      //        count areas in directions
      //             1. ↓
      //             2. →
      //
      // ↓ will collect data on later stages
      // var boolCollectValues = (oType.useValue === 'collect');
      //
      // [ 2.1 ]. Define functions for creating ranges
      //  group by columns
      var groupDots2ColumnRanges_ = function(mainset) {
        //
        // < 1 >. Sort dots by column number
        //        and then by row number
        var sortF = function(a, b) {
          if (a.column - b.column !== 0) { return a.column - b.column; }
          return a.row - b.row;
        }
        var arrMain = [];
        for (var key in mainset) {
          arrMain.push(mainset[key]);
        }
        arrMain.sort(sortF);
        //
        // < 2 >. Create column groups
        var columnGroups = {}, rowCompare = -1, dot = {}, groupKey = 0, group;
        for (var i = 0; i < arrMain.length; i++) {
          dot = arrMain[i];
          if ( (dot.row - rowCompare) == 1) {
            // group dots
            group = columnGroups[groupKey] || { dots: [] };
            group.dots.push(dot);
            columnGroups[groupKey] = group;
          } else {
            // new group
            groupKey++;
            columnGroups[groupKey] = { dots: [dot] };
          }
          rowCompare = dot.row;
        }
        //
        // add first row, column, and num of dots - size
        for (var gkey in columnGroups) {
          group =  columnGroups[gkey];
          group.h = group.dots.length;
          group.column = group.dots[0].column;
          group.row = group.dots[0].row;
        }
        return columnGroups;
      }
      //
      //
      // group columns into range groups
      var groupColumns2Ranges_ = function(mainset) {
        // dots: [{ ... }, { ... }],
        // "h": 2,
        // "column": 4,
        // "row": 1 
        //
        // < 1 >. Sort columns by:
        //        1. h (heihgt)
        //        2. row (uppermost row)
        //        3. column
        var sortF = function(a, b) {
          if (a.h !== b.h) {
            return a.h - b.h;
          }
          if (a.row !== b.row) {
            return a.row - b.row;
          }
          if (a.column !== b.column) {
            return a.column - b.column;
          }
          return 0;
        }
        var arrMain = [];
        for (var key in mainset) {
          arrMain.push(mainset[key]);
        }
        // h → row → column
        arrMain.sort(sortF);
        //
        // < 2 >. Create range groups
        var groups = {}, groupKey = 0, group, orow = {};
        var column, row, h;
        for (var i = 0; i < arrMain.length; i++) {
          orow = arrMain[i];
          if (orow.row === row && orow.h === h && (orow.column - column) === 1) {
            // group orows
            group = groups[groupKey] || { dots: [], w: 1 };
            group.dots = group.dots.concat(orow.dots);
            group.w++;
            groups[groupKey] = group;
          } else {
            // new group
            groupKey++;
            groups[groupKey] = { 
              dots: orow.dots, 
              w: 1, 
              h: orow.h, 
              row: orow.row, 
              column: orow.column };
          }
          row = orow.row;
          column = orow.column;
          h = orow.h;
        }
        //
        return groups;
      }
      //
      // [ 2.2 ]. Loop dot groups and get ranges
      var odots = {}, ores = {}, subres1 = {}, subres2 = {};
      for (var cckey in collections) {
        // treat each group as individual task
        odots = collections[cckey];
        // console.log(cckey)
        // console.log(JSON.stringify(odots, null, 4));
        //
        // {
        //   "setDataValidation_Test3": {
        //       "1_2": {
        //           "row": 1,
        //           "column": 2,
        //           "type": "setDataValidation",
        //           "subKey": "setDataValidation_Test3"
        //       },
        //       ...
        //   },
        //   "setDataValidation_Test4": {
        //       "5_2": {
        //           "row": 5,
        //           "column": 2,
        //           "type": "setDataValidation",
        //           "subKey": "setDataValidation_Test4"
        //       },
        subres1 = groupDots2ColumnRanges_(odots);
        subres2 = groupColumns2Ranges_(subres1);
        ores[cckey] = subres2;
      }
      // execute main function
      oType.func(ores, subtasks);
      // console.log(JSON.stringify(ores, null, 4));
      return 0; // run tasks = done!
    }
  }
  // end of returned value ↑
}                               
                               










//    _____           _          
//   / ____|         | |         
//  | |     __ _  ___| |__   ___ 
//  | |    / _` |/ __| '_ \ / _ \
//  | |___| (_| | (__| | | |  __/
//   \_____\__,_|\___|_| |_|\___| 
//
//  Idea
//     ~~--->>> Use zip and unzip
//              https://gist.github.com/pfelipm/d4361211d45ae01e2e7a92bc3bd9e27b
//
//
// getDict_
// gets the dictionary
//   1. from cache
//   2. if not in cashe => create dictionary from sheet
//
// function test_getDict() {
//   var o_ref = 
//   { sheetName: 'Dictionary',
//     num_levels: 5,
//     range: "'Dictionary'!A2:E",
//     file: '1PF7zj_5laBbamPSVYy5oGTyMxaQsdcJh4pcs9e1wiiI',
//     rangeA1: 'A:E',
//     key: '1PF7zj_5laBbamPSVYy5oGTyMxaQsdcJh4pcs9e1wiiI\'Dictionary\'!A2:E' 
//   };

//   var cashe_sec = 3600;
//   var t = new Date();
//   getDict_(o_ref, cashe_sec);
//   var t2 = new Date();
//   console.log('Time to take 1-st time = ' + (t2- t));           // 1411
//   getDict_(o_ref, cashe_sec);
//   console.log('Time to take 2-nd time = ' + (new Date() - t2)); // 197  ~ 7x faster!
//   invalidateCache_(o_ref.key);
// }
//
// Params:
//   key
//   rangeA1
//   cashe_sec
//   fileId - use data from another file
//   display_values - use display values of sheet for dictionary
function getDict_(o_ref, cashe_sec, display_values) {
  //
  // o_ref:
  // { sheetName: 'Dictionary',
  //   num_levels: 5,
  //   range: '\'Dictionary\'!A2:E',
  //   file: '1PF7zj_5laBbamPSVYy5oGTyMxaQsdcJh4pcs9e1wiiI',
  //   rangeA1: 'A:E',
  //   key: '1PF7zj_5laBbamPSVYy5oGTyMxaQsdcJh4pcs9e1wiiI\'Dictionary\'!A2:E' }
  //

  var chunky = ChunkyCache_(CacheService.getDocumentCache());
  // console.log(o_ref.key);
  var dict = chunky.get(o_ref.key);
  if (dict) {
    return dict;
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("Please wait", "Rebuilding cache", 30);
  dict = readDictionary_(o_ref, display_values);
  chunky.put(o_ref.key, dict, cashe_sec);
  SpreadsheetApp.getActiveSpreadsheet().toast("", "Finished", 1);
  return dict;
}
//
//
// function test_readDictionary() {
//   var t = new Date()
//   console.log(readDictionary_("'Dictionary'!A2:E"));
//   console.log(new Date() -t);
// }
// function reads actual range from sheet
// it will take some time to run
// as reading data from sheet may be slow
function readDictionary_(o_ref, display_values) {
  var f;
  if (o_ref.file) {
    f = SpreadsheetApp.openById(o_ref.file)
  } else {
    f = SpreadsheetApp.getActive();
  } 
  var sheet = f.getSheetByName(o_ref.sheetName);
  var range = sheet.getRange(o_ref.rangeA1);
  var values;
  if (display_values) {
    values = range.getDisplayValues();
  } else {
    values = range.getValues();
  }
  var dict = buildDictionary_(values);
  return dict;
}
//
//
// function test_buildDictionary() {
//   var values = [
//     ['a', 'b', 'boo'],
//     ['a', 'c', 'boo'],
//     ['$100', 'e', 'boo']
//   ];
//   var dict = buildDictionary_(values);
//   console.log(JSON.stringify(dict, null, 4));
//   // { a: { b: [ 'boo' ], c: [ 'boo' ] }, d: { e: [ 'boo' ] } }
//   // values = SpreadsheetApp
//   //   .getActive()
//   //   .getRange('Countries!A2:C86')
//   //   .getDisplayValues();
//   // dict = buildDictionary_(values);
//   // console.log(JSON.stringify(dict, null, 4));
// }
function buildDictionary_(values) {
  var root = {};
  for (var i in values) {
    var row = values[i],
        level = root,
        col;
    for (var j = 0; j < row.length - 1; j++) {
      col = row[j];
      if (!level.hasOwnProperty(col)) {
        level[col] = j < row.length - 2 ? {} : []
      }
      level = level[col];
    }
    col = row[row.length - 1];
    if (level.indexOf(col) == -1) {
      level.push(col);
    }
  }
  return root; 
}
//
//
function invalidateCache_(key) {
  // https://developers.google.com/apps-script/reference/cache/cache#putkey,-value
  // The maximum amount of data that can be stored per key is 100KB 
  chunky = ChunkyCache_(CacheService.getDocumentCache());
  chunky.remove(key);
} 
//
//
// the code is from here: https://gist.github.com/pilbot/9d0567ef1daf556449fb
// function testGetCacheFrom() {
//     var chunky = ChunkyCache_(CacheService.getDocumentCache());
//     var s = '🧞‍♂️'.repeat(1024 * 400);
//     chunky.put('Data', s, 120);
//     var check = chunky.get('Data');
//     // console.log(check);
//     //console.log(Utilities.newBlob(s).getBytes().length); // length in KB
// }
function ChunkyCache_(cache){
  return {
    // ttl = expirationInSeconds
    // The minimum is 1 second and the maximum is 21600 seconds (6 hours).
    // https://developers.google.com/apps-script/reference/cache/cache#putkey,-value,-expirationinseconds
    put: function (key, value, ttl) {
      var json = JSON.stringify(value);
      // 1024*90 = indicates 90KB of data; should be ok with quota
      var chunkSize = 1024*90; // put chunk size here
      // this gives chunk size max 45KB
      // a half of limit, discussion: 
      // https://gist.github.com/pilbot/9d0567ef1daf556449fb
      var cSize = Math.floor(chunkSize / 2); 
      var chunks = [];
      var index = 0;
      while (index < json.length){
        cKey = key + "_" + index;
        chunks.push(cKey);
        // https://developers.google.com/apps-script/reference/cache/cache#putkey,-value,-expirationinseconds
        // The cap for cached items is 1,000
        // If more than 1,000 items are written, the cache stores the 900 items farthest from expiration.
        var part = json.substr(index, cSize);
        // console.log(Utilities.newBlob(part).getBytes().length / 1024); // get length in Kb
        cache.put(cKey, part, ttl+5);
        index += cSize;
      }     
      var superBlk = {
        chunkSize: chunkSize,
        chunks: chunks,
        length: json.length
      };
      cache.put(key, JSON.stringify(superBlk), ttl);
    },
    get: function (key) {
      var superBlkCache = cache.get(key);
      if (superBlkCache != null) {
        var superBlk = JSON.parse(superBlkCache);
        if (!superBlk.chunks) { return null; }
        chunks = superBlk.chunks.map(function (cKey){
          return cache.get(cKey);
        });
        if (chunks.every(function (c) { return c != null; })){
          return JSON.parse(chunks.join(''));
        }
      }
    },
    remove: function(key) {
      var superBlkCache = cache.get(key);
      if (superBlkCache != null) {
        var superBlk = JSON.parse(superBlkCache);
        superBlk.chunks.forEach(function (cKey){
          cache.remove(cKey);
        });
      }
    }
  }
};





function clearMemory(sheetName) {
  var sets = getConfigDvl0_();
  var config = parseConfigInfo_(sets);
  var refs = config.refs;
  // console.log(refs);
  //
  // clear all cache files
  var res = [];
  var key;
  for (var k in refs) {
    key = refs[k].key;
    // console.log(JSON.stringify(refs[k], null, 4))
    // {
    // "sheetName": "Dictionary",
    // "num_levels": 5,
    // "range": "'Dictionary'!A2:E",
    // "rangeA1": "A:E",
    // "key": "'Dictionary'!A2:E"
    // }
    if (sheetName) {
      if (refs[k].sheetName === sheetName) {
        invalidateCache_(key);
        res.push(key);
      }
    } else {
      invalidateCache_(key);
      res.push(key);
    }
  }
  if (res.length > 0) {
    console.log('cleared memory: ' + res);
  } else {
    // nothing was cleared
  }
  return 0; 
}
