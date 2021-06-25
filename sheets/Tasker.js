var OBJ_TASKS_DV = {}; // object for tasks


/*
  Problem
    If we take action for each cell separately, it may take 
    too much time and may be annoying for a user to wait.
    
  Solution
    The idea is to make global object and store actions in it.
    Then merge all actions and small ranges into bigger ranges
    and take action on bigger ranges.
    
  .............................................................
  
  
  OBJ_TASKS_DV
   "clearContents"   ~   keyTask
      ""   ~   keyData 
        numRows = [1,2,3,4]
        numColumnss = [[2,3], [2,3], [2,3], [2,3]]
   "makeDv"
       "Paris>Lion"
          numRows = [1,2,3,4]
          numColumnss = [[2,3], [2,3], [2,3], [2,3]]         
          data = ["Paris", "Lion"]
*/


/*

  _______        _          _      _ _                          
 |__   __|      | |        | |    (_) |                         
    | | __ _ ___| | _____  | |     _| |__  _ __ __ _ _ __ _   _ 
    | |/ _` / __| |/ / __| | |    | | '_ \| '__/ _` | '__| | | |
    | | (_| \__ \   <\__ \ | |____| | |_) | | | (_| | |  | |_| |
    |_|\__,_|___/_|\_\___/ |______|_|_.__/|_|  \__,_|_|   \__, |
                                                           __/ |
                                                          |___/ 
*/

/* 
  use C_TASKS_FUNCTIONS to run a function
  function variables are:
    
    * range = {range}:                 SpreadsheetApp.getActiveSheet().getRange(row, column) 
    * data = [list]:                   ["Paris", "Lion"]
    * key = "String"                   "Paris>Lion"

*/

var C_TASKS_FUNCTIONS = 
{
  "clearContents":    makeTasksClearContents,
  "clearDv":          makeTasksClearDataValidation,
  "makeDv":           makeTasksDataValidation,
  "setVal":           makeTasksSetValue
}
function makeTasksClearContents(range) { range.clear({contentsOnly: true}); }
function makeTasksClearDataValidation(range) { range.clear({validationsOnly: true}); }
function makeTasksDataValidation(range, data, key) { makeDvFromList(range, data, key); }
function makeTasksSetValue(range, data, key) 
  {     
    var w = range.getWidth();
    var h = range.getHeight();
    if (w === 1 && h === 1) { range.setValue(key); }
    else { range.setValues(getFilled2DArray(key, w, h)); }  
  }

/*
              _     _   _            _        
     /\      | |   | | | |          | |       
    /  \   __| | __| | | |_ __ _ ___| | _____ 
   / /\ \ / _` |/ _` | | __/ _` / __| |/ / __|
  / ____ \ (_| | (_| | | || (_| \__ \   <\__ \
 /_/    \_\__,_|\__,_|  \__\__,_|___/_|\_\___/
                                              
                                            
*/
function test_addTask()
{
  var keyTask = 'clearContents';
  var keyData = '';
  var numRow = 3;
  var numCols = [4,5,7];
  addTask(keyTask, keyData, numRow, numCols);
  
  Logger.log(JSON.stringify(OBJ_TASKS_DV)); // {"clearContents":{"":{"numRows":[3],"numColumnss":[[4,5,7]]}}}
  
  var keyTask = "makeBaby";
  var keyData = "Lu-Max";
  var data = ["ooo", "oah", "aaah"];
  addTask(keyTask, keyData, numRow, numCols, data);

  Logger.log(JSON.stringify(OBJ_TASKS_DV)); 
  /* {
      "clearContents":{"":{"numRows":[3],"numColumnss":[[4,5,7]]}},
      "makeBaby":{"Lu-Max":{"numRows":[3],"numColumnss":[[4,5,7]],"data":["ooo","oah","aaah"]}}} 
  */

}

function addTask(keyTask, keyData, numRow, numCols, data)
{
    /*
      numRows = [1,2,3,4]
      numColumnss = [[2,3], [2,3], [2,3], [2,3]]
    */
    if (!OBJ_TASKS_DV[keyTask]) { OBJ_TASKS_DV[keyTask] = {}; }
    if (!OBJ_TASKS_DV[keyTask][keyData]) { OBJ_TASKS_DV[keyTask][keyData] = {}; }
    if (!OBJ_TASKS_DV[keyTask][keyData].numRows) { OBJ_TASKS_DV[keyTask][keyData].numRows = []; }
    if (!OBJ_TASKS_DV[keyTask][keyData].numColumnss) { OBJ_TASKS_DV[keyTask][keyData].numColumnss = []; } 
    OBJ_TASKS_DV[keyTask][keyData].numRows.push(numRow);
    OBJ_TASKS_DV[keyTask][keyData].numColumnss.push(numCols);
    
    // add data 
    if (data)
    {
      if (!OBJ_TASKS_DV[keyTask][keyData].data) { OBJ_TASKS_DV[keyTask][keyData].data = data; }
    }

}



/*

  __  __       _          _            _        
 |  \/  |     | |        | |          | |       
 | \  / | __ _| | _____  | |_ __ _ ___| | _____ 
 | |\/| |/ _` | |/ / _ \ | __/ _` / __| |/ / __|
 | |  | | (_| |   <  __/ | || (_| \__ \   <\__ \
 |_|  |_|\__,_|_|\_\___|  \__\__,_|___/_|\_\___/
                                                
                                                
*/


function makeTasks(sheet)
{ 
  /*
    OBJ_TASKS_DV
      {"makeDv":
        {"Tatooine":{"numRows":[6,7],"numColumnss":[[2],[2]],"data":["Yulab","Asia"]},
        "Earth":{"numRows":[8],"numColumnss":[[2]],"data":["Europe","Asia","Africa","America"]}},
        
       "clearContents":{"":
         {"numRows":[6,6,6,7,7,7,8,8,8],
         "numColumnss":[[5],[3,5],[2,3,5],[5],[3,5],[2,3,5],[5],[3,5],[2,3,5]]}}}  
  */
  
  
  // step 1. Prepare info for tasks, create task-maker obj  
  var ObjTaskMaker = getTaskMaker(OBJ_TASKS_DV);

  
  /*
    {"clearContents":{
        "":{
            "rangesA1":[
                {"numRow":6,"numCol":2,"numCols":2,"numRows":3},
                {"numRow":6,"numCol":5,"numCols":1,"numRows":3}
                ]}},
    "makeDv":{
        "Tatooine":{
            "data":["Yulab","Asia"],
            "rangesA1":[
                {"numRow":6,"numCol":2,"numCols":1,"numRows":2}
                ]},
        "Earth":{
            "data":["Europe","Asia","Africa","America"],
            "rangesA1":[
                {"numRow":8,"numCol":2,"numCols":1,"numRows":1}
                ]}}}
  */
  
  
    
  // step 2. Make tasks
  var tasks = Object.keys(ObjTaskMaker);
  var keyTask = '';
  var oSubTasks = {};
  var subTasks = [];
  var keySubTasks = '';
  var subTask = {};
  var keySubTask = '';
  var taskFunction;
  for (var i = 0, l = tasks.length; i < l; i++)
  {
     keyTask = tasks[i];
     taskFunction = C_TASKS_FUNCTIONS[keyTask];
     oSubTasks = ObjTaskMaker[keyTask];
     subTasks = Object.keys(oSubTasks);     
     for (var ii = 0, ll = subTasks.length; ii < ll; ii++)
     {
       keySubTask = subTasks[ii];
       /*
       "data":["Yulab","Asia"],
         "rangesA1":[
           {"numRow":6,"numCol":2,"numCols":1,"numRows":2}
         ]},       
       */

       subTask = oSubTasks[keySubTask];
       
        /*
          * sheet = {sheet} object:          SpreadsheetApp.getActiveSheet().getRange(row, column) 
          * ranges = [iRange, iRange]:       [{"numRow":6,"numCol":2,"numCols":2,"numRows":3}, ... ]
          * data = [list]:                   ["Paris", "Lion"]
          * key = "String"                   "Paris>Lion"
        */
       makeTasksFunctions(taskFunction, sheet, subTask.rangesA1, subTask.data, keySubTask);          
     }       
  }
  
    
  // step 3. Free memory, set OBJ_TASKS_DV to empty array
  OBJ_TASKS_DV = {};
  return 0;

}


function makeTasksFunctions(func, sheet, ranges, data, key)
{
  /*
    ranges = 
      [
        {"numRow":6,"numCol":2,"numCols":2,"numRows":3},
        {"numRow":6,"numCol":5,"numCols":1,"numRows":3}
      ]      
  */
  
  var range;
  var oRange = {};
  for (var i = 0, l = ranges.length; i < l; i++)
  {
    oRange = ranges[i];
    range = sheet.getRange(oRange.numRow, oRange.numCol, oRange.numRows, oRange.numCols);
    func(range, data, key);
  }  



}







/*
  _____                                 _        __      
 |  __ \                               (_)      / _|     
 | |__) | __ ___ _ __   __ _ _ __ ___   _ _ __ | |_ ___  
 |  ___/ '__/ _ \ '_ \ / _` | '__/ _ \ | | '_ \|  _/ _ \ 
 | |   | | |  __/ |_) | (_| | | |  __/ | | | | | || (_) |
 |_|   |_|  \___| .__/ \__,_|_|  \___| |_|_| |_|_| \___/ 
                | |                                      
                |_|                                      
*/

function getTaskMaker(oTasks)
{
  /*
    oTasks
      {"makeDv":
        {"Tatooine":{"numRows":[6,7],"numColumnss":[[2],[2]],"data":["Yulab","Asia"]},
        "Earth":{"numRows":[8],"numColumnss":[[2]],"data":["Europe","Asia","Africa","America"]}},
        
       "clearContents":{"":
         {"numRows":[6,6,6,7,7,7,8,8,8],
         "numColumnss":[[5],[3,5],[2,3,5],[5],[3,5],[2,3,5],[5],[3,5],[2,3,5]]}}}  
  */  
  var result = {};  
  
  
  var tasks = Object.keys(oTasks); // ["makeDv", "clearContents"]
  var task = '';
  var oTask = {};
  var oSubTask = {};
  var subTask = '';
  
  var oTaskNew = {};
  var oSubTaskNew = {};
  
  var subTasks = [];
  
  for (var i = 0, l = tasks.length; i < l; i++)
  {
    task = tasks[i]; // "makeDv"
    oTask = oTasks[task];
    /*
      oTask = 
        {"Tatooine":{"numRows":[6,7],"numColumnss":[[2],[2]],"data":["Yulab","Asia"]},
            "Earth":{"numRows":[8],"numColumnss":[[2]],"data":["Europe","Asia","Africa","America"]}}
    */
    oTaskNew = {};    
    // run sub-tasks
    subTasks = Object.keys(oTask); // ["Tatooine", "Earth"]
    for (var ii = 0, ll = subTasks.length; ii < ll; ii++)
    {
      subTask = subTasks[ii]; // "Tatooine"
      oSubTask = oTask[subTask]; // {"numRows":[6,7],"numColumnss":[[2],[2]],"data":["Yulab","Asia"]}
      oSubTaskNew = getSubTask(oSubTask);
      oTaskNew[subTask] = oSubTaskNew;        
    } 
    result[task] = oTaskNew;
  }
  
  return result;

}


function getSubTask(oSubTask)
{
  /*
    oSubTask = 
      {"numRows":[6,7],"numColumnss":[[2],[2]],"data":["Yulab","Asia"]}
  */
  
  var result = {};
  
  // return data without changes
  var data = oSubTask.data;
  if (data) { result.data = oSubTask.data; }
  
  var oSubTaskRows = getSubTaskRows({"numRows": oSubTask.numRows, "numColumnss": oSubTask.numColumnss});
  /*
    result = 
      "rows":{			
        "6":{"listCols":[2,3,5]},"7":{"listCols":[2,3,5]},
        "8":{"listCols":[2,3,5]}}}}
  */
  var rangesA1 = getSubTaskA1Ranges(oSubTaskRows);  
  /*
  
  
  */
  
  
  result.rangesA1 = rangesA1;
  
  return result;
  
}


function getSubTaskRows(oSubTask)
{

  /*
    oSubTask = 
      {"numRows":[6,7],"numColumnss":[[2],[2]]}
  */
  
  
  var result = {};
  // create unique list of rows and columns
  var oRows = {};
  var oRow = {};
  var listRows = oSubTask.numRows; // [6,7]
  var numRow = 0;
  var listColss = oSubTask.numColumnss; // [[2],[2]]
  var listCols = [];
  var listColsNew = [];
  
  for (var i = 0, l = listRows.length; i < l; i++)
  {
    numRow = listRows[i];
    // get or create oRow
    oRow = oRows[numRow] || {}; // {...}      
    // get or create listCols
    listCols = oRow.listCols || []; // [...]
    // add new values to array and get uniques sorted values
    listColsNew = listColss[i]; // [2]  
    listCols = listCols.concat(listColsNew); // [... , 2]
    listCols = getUniqueLine(listCols).sort(function(a,b) { return a - b; } ); // [1, 2, ...]
    // add listCols to oRow
    oRow.listCols = listCols;
    // add oRow to oRows
    oRows[numRow] = oRow;
  }
  
  result.rows = oRows;
  
  return result;
  /*
    result = 
      "rows":{			
        "6":{"listCols":[2,3,5]},"7":{"listCols":[2,3,5]},
        "8":{"listCols":[2,3,5]}}}}
  */
}



function test_getSubTaskA1Ranges()
{

  var oSubTaskRows = 
  {
    rows:{
      11:{listCols:[2]}, 
      12:{listCols:[2]}, 
      13:{listCols:[2]}, 
      6:{listCols:[2]}, 
      7:{listCols:[2]}, 
      8:{listCols:[2]}, 
      9:{listCols:[2]}, 
      10:{listCols:[2]}
    }
   };
  
  Logger.log(getSubTaskA1Ranges(oSubTaskRows));
  

}

function getSubTaskA1Ranges(oSubTaskRows)
{

  /*
    oSubTaskRows = 
      "rows":{			
        "6":{"listCols":[2,3,5]},"7":{"listCols":[2,3,5]},
        "8":{"listCols":[2,3,5]}}}}
  */
  
  var rasult= [];
  
  // step 1. get lines
  var lines = {};  
  var line = null; // key = "R1C2", first row, first column
  var keyLine = '';
  var keysLine = [];
  var columns = [];
  var numCol0 = -1;
  var numCol = 0;
  var numRow = 0;
  var oRow = {};
  var rowNums = Object.keys(oSubTaskRows.rows); // ["6", "8"]
  var rowNums = rowNums.map(function(elt) {
    return parseInt(elt); // convert to integers
  });
  rowNums.sort(function(a,b) { return a - b; } ); // [6, 8]
  
  for (var i = 0, l = rowNums.length; i < l; i++)
  {
    numRow = rowNums[i]; // 6
    oRow = oSubTaskRows.rows[numRow]; // {"listCols":[2,3,5]}
    columns = oRow.listCols;
    
    for (var ii = 0, ll = columns.length; ii < ll; ii++)
    {
      numCol = columns[ii];
      
      if (numCol - numCol0 !== 1) 
      { 
        // if line exists, add it to lines
        if (line) { lines[keyLine] = line; }
        
        // create new line
        keyLine = "R" + numRow + "C" + numCol; // "R1C2"
        keysLine.push(keyLine)
        line = {};
        line.numRow = numRow;
        line.numCol = numCol;
        line.numCols = 1;
      }
      else
      {
        // expand existing line
        line.numCols = line.numCols + 1;      
      }
      // add last line
      lines[keyLine] = line;
            
      // remember line number
      numCol0 = numCol;    
    }
    // line = null;
    line = null;
  }
  
    
  /*
  lines = 
    {
      "R6C2":{"numRow":6,"numCol":2,"numCols":2},
      "R6C5":{"numRow":6,"numCol":5,"numCols":1},
      "R7C2":{"numRow":7,"numCol":2,"numCols":2},
      "R7C5":{"numRow":7,"numCol":5,"numCols":1},
      "R8C2":{"numRow":8,"numCol":2,"numCols":2},
      "R8C5":{"numRow":8,"numCol":5,"numCols":1}
    }
      
  */
  
  // step 2. Get Col-WIdth-Groups
  var colWidGroups = {};
  var group = {};
  var keyGroup = ''; // C1W2
  for (var i = 0, l = keysLine.length; i < l; i++)
  {
    keyLine = keysLine[i]; // "R1C2"
    line = lines[keyLine]; // {"numRow":6,"numCol":2,"numRows":2}
    keyGroup = 'C' + line.numCol + 'W' + line.numCols; // "C2W2"
    group = colWidGroups[keyGroup] || {}; // { ... }
    group.numCol = line.numCol; // 2
    group.numCols = line.numCols; // 2    
    group.rows = group.rows || []; // [ ... ]
    group.rows.push(line.numRow); // [6, ... ]
    colWidGroups[keyGroup] = group;  
  }
  
  /* 
  colWidGroups = 
   {
      "C2W2":{"numCol":2,"numCols":2,"rows":[6,7,8]},
      "C5W1":{"numCol":5,"numCols":1,"rows":[6,7,8]}
   }  
 */
 

  // step 3. Get Ranges
  var ranges = [];
  var oRange = null;
  var keysGroup = Object.keys(colWidGroups); // ["C2W2", "C5W1"]
  var rowsGroup = [];
  var numRow0 = -1;
  var numRow = 0;
  // loop groups

  for (var i = 0, l = keysGroup.length; i < l; i++)
  {
    keyGroup = keysGroup[i]; // "C2W2"
    group = colWidGroups[keyGroup]; // {"numCol":2,"numCols":2,"rows":[6,7,8]}  
    
    rowsGroup = group.rows;
    rowsGroup.sort(function(a,b) { return a - b; } ); // [6,7,8]
        
    // loop rows
    numRow0 = -1;
    oRange = null;
    for (var ii = 0, ll = rowsGroup.length; ii < ll; ii++)
    {      
      numRow = rowsGroup[ii]; // 6
      if (numRow - numRow0 !== 1)
      {
        // add if here
        if (oRange) { ranges.push(oRange); }
        // create new range
        oRange = oRange || {}; // create if not here
        oRange.numRow = numRow;
        oRange.numCol = group.numCol;
        oRange.numCols = group.numCols;
        oRange.numRows = oRange.numRows || 1;                   
      }
      else
      {
        oRange.numRows = oRange.numRows + 1;             
      }      
      // assign to current
      numRow0 = numRow;
    }
    // add last range
    ranges.push(oRange);  
  }
  
  return ranges;
  /*
  "rangesA1":[
      {"numRow":6,"numCol":2,"numCols":2,"numRows":3},
      {"numRow":6,"numCol":5,"numCols":1,"numRows":3}
    ]}},  
  */

}
