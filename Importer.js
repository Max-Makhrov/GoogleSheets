/*

  use code from:
  https://github.com/Max-Makhrov/GoogleSheets/blob/master/2dArray.js
  https://github.com/Max-Makhrov/GoogleSheets/blob/master/Sheets.js
*/



/*

  _____                            _            
 |_   _|                          | |           
   | |  _ __ ___  _ __   ___  _ __| |_ ___ _ __ 
   | | | '_ ` _ \| '_ \ / _ \| '__| __/ _ \ '__|
  _| |_| | | | | | |_) | (_) | |  | ||  __/ |   
 |_____|_| |_| |_| .__/ \___/|_|   \__\___|_|   
                 | |                            
                 |_|                            
  
  import data from Sources into Users
  
  Tables: sheets with data
  Sources: tables with their source props and with list of Users
  Users: tables with their user pops

*/


/*
---------------------------------------

__ ___  __ _____  _____  _____ _____ _____ _____ 
|| || \/ | ||_// ((   )) ||_//  ||   ||==  ||_// 
|| ||    | ||     \\_//  || \\  ||   ||___ || \\ 

---------------------------------------

TODO: split importer.run() into smaller funcitons
*/


function test_importer()
{
  var import = new importer();
  
  // set tables
  var fileIds = ['1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8'];
  var sheetIds = [0, 910354054, 990535806, 1472511767]; // Sheet1, Sheet2, Origin, Main
  var firstDataRows = [3, 6, 4, 4];
  var idColumns = [3, 2, 1, 1];
  var headerCols = [[3,6,1,7,2], [5,1,2,4,3], [1,2,3,4,5], [1,2,3,4,5]];
  var originSheetIds = [-1, -1, -1, 990535806];   
  import.setTables(fileIds, sheetIds, firstDataRows, idColumns, headerCols, originSheetIds);
  
  
  // set users
  var tableIds = [fileIds[0] + sheetIds[0], fileIds[1] + sheetIds[1]]; // Sheet1, Sheet2
  var tableIdSources = [fileIds[2] + sheetIds[2], fileIds[3] + sheetIds[3]]; // Origin, Main
  var checkFieldss = [1, 1] // check, check
  var killSources = [0, 0] // no, no → try [0, 1]
  var importTypes = [3, 1] // replace with id check, to the end
  var strMacroBefores = ['', 'test_macroBefore'];
  var strMacroAfters = ['test_macroAfter', ''];
  import.setUsers(tableIds, tableIdSources, checkFieldss, killSources, importTypes, strMacroBefores, strMacroAfters);
  
  // FieldTypes
  var fieldTypes = {"1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 2, "7": 1};
  import.setFieldTypes(fieldTypes);
  
  // set sources
  var tableIds = [fileIds[2] + sheetIds[2], fileIds[3] + sheetIds[3]]; // Origin, Main
  var userTableIdss =  [[fileIds[0] + sheetIds[0]] , [fileIds[1] + sheetIds[1]]]; // [[Set1], [Set2]...] Sheet1, Sheet2
  var updates = [1, 1]; // update, update
  import.setSources(tableIds, userTableIdss, updates);
  
  // Logger.log(JSON.stringify(import));
  
  import.run();
  
}

function test_macroBefore()
{
  Logger.log('before');
  
}

function test_macroAfter()
{
 Logger.log('after');   
}

function importer()
{
  var self = this;
  
  this.setTables = function(fileIds, sheetIds, firstDataRows, idColumns, headerCols, originSheetIds)
  {
    var tablesInfo = new TablesInfo(fileIds, sheetIds, firstDataRows, idColumns, headerCols, originSheetIds);
    self.tables = tablesInfo.tables; // {} tables
  }
  
  this.setUsers = function(tableIds, tableIdSources, checkFieldss, killSources, importTypes, strMacroBefores, strMacroAfters)
  {
    var usersInfo = new importUsers(tableIds, tableIdSources, checkFieldss, killSources, importTypes, strMacroBefores, strMacroAfters);
    self.users = usersInfo.users; // {} users
  }
  
  this.setSources = function(tableIds, userTableIdss, updates)
  {
    var sourcesInfo = new importSources(tableIds, userTableIdss, updates);
    self.sources = sourcesInfo.sources; // [] sources   
  }
  
  this.setFieldTypes = function(fieldTypes)
  {
    self.fieldTypes = fieldTypes;
  }
  
  
  this.run = function()
  {
   
   // do for each source
   for (var i = 0, l = self.sources.length; i < l; i++)
   {
    var source = self.sources[i];
    if (source.update == 1)
    {
       // get dataFrom
      var sourceTable = self.tables[source.tableId];
      var dataRange = sourceTable.getDataRange();
      if (dataRange != undefined) // do not import empty range
      {
        var dataFrom = dataRange.getValues();
        
        // do for each user      
        var userTableIds = source.userTableIds;
        for (var j = 0, k = userTableIds.length; j < k; j++)
        {
          
          // user info
          var userId = source.id + userTableIds[j];
          var user = self.users[userId];
          var userTable = self.tables[userTableIds[j]];        
          // macro before
          var macroName = user.strMacroBefore;
          if (macroName != '' && macroName != undefined && macroName != -1) runFunctionByName(macroName); 
          
          // get data for import
          var checkFields = user.checkFields;
          var data = [];
          // 1 - (default) check field list from source and user tables, ubdate only matched fields
          // 0 -           import all fields        
          if (checkFields == 1)
          {
            var paster = new Paster(sourceTable.headerCols, userTable.headerCols);  
            var columns = paster.island.from;
            var data = extrectColumnsByIdsFill(dataFrom, columns); // make strucrure of dataFrom same as dataTo 
          }
          else if (checkFields == 0)
          {
            data = dataFrom;        
          }
          
          
          // do import
          var sheetTo = userTable.sheet;
          var importType = user.importType         
          // 1 - (default) insert data into the end of user sheet
          // 2 -           replace existing data from user table with source data
          // 3 -           replace data only when Ids from user match Ids from source table     
          if (importType == 1)
          {
            var lastRow = userTable.getLastRow(); 
            var pasteRange = sheetTo.getRange(lastRow + 1, 1, data.length, data[0].length);
            pasteRange.setValues(data);          
          }
          else if (importType == 2)
          {
            var rowStart = userTable.firstDataRow;
            var pasteRange = sheetTo.getRange(rowStart, 1, data.length, data[0].length);
            pasteRange.setValues(data);          
          }
          else if (importType == 3)
          {
            // for data with unmerged fields
            if (checkFields != 1) 
            {
              columns = sourceTable.headerCols; // get columns
              if (sourceTable.idColumn != userTable.idColumn) 
                throw new Error( "Id violation: trying to insert data with different field structure" ); // exit with error: Id violation
            }
            // get merged by ids data
            var dataToRange = userTable.getDataRange();
            var fieldTypes = getFieldTypes(self.fieldTypes, userTable.headerCols);
            var dataMerged =  merge2dArrays(data, dataToRange.getValues(), userTable.idColumn, fieldTypes, columns);
            
            var rowStart = userTable.firstDataRow;
            var pasteRange = sheetTo.getRange(rowStart, 1, dataMerged.length, dataMerged[0].length);
            pasteRange.setValues(dataMerged);           
          }         
          
          // macro after
          var macroName = user.strMacroAfter;
          if (macroName != '' && macroName != undefined && macroName != -1) runFunctionByName(macroName); 
          
          
          // delete source after import
          // 0 - (default) do nothing
          // 1 -           delete data from source table after the import
          if (user.killSource == 1)
          {
            var originTable = sourceTable.originTable;
            if (originTable == 0) originTable = sourceTable;
            var originRange = originTable.getDataRange();
            originRange.clearContent();
          }
          
        }
      
      }
      
    }     
   }
    

    
    
  }
  
  
}

// helper functon to run funcitons
function runFunctionByName(name)
{  
 this[name](); 
}


/*
---------------------------------------

  __  _____  __ __ _____  ____ _____ 
 ((  ((   )) || || ||_// ((    ||==  
\_))  \\_//  \\_// || \\  \\__ ||___ 

---------------------------------------
*/

function importSources(tableIds, userTableIdss, updates)
{
  var source = {};
  var sources = [];
  var tableId = '';
  for (var i = 0, l = tableIds.length; i < l; i++)
  {
    tableId = tableIds[i];
    source = new importSource(tableId, userTableIdss[i], updates[i]);
    sources.push(source);
  }
   
  this.sources = sources;
  
  return 0;
  
}


/*
   Fields 
   
   ------------------------------------------------------------------------------------------------------------------
   Required
   
   tableId.............fileId + sheetId
   userTableIds........[fileId1 + sheetId1, fileId1 + sheetId2..]
   
   Optional
   update
    1 - (default) yes
    0 -           no

*/
function importSource(tableId, userTableIds, update)
{
  this.id = tableId;
  this.tableId = tableId;
  this.userTableIds = userTableIds;
  this.update = update;
  
  var self = this;
  
  this.setUpdate = function(update)
  {
    self.update = update;
  }
    
}



/*
---------------------------------------

__ __   __ _____ _____ 
|| ||  ((  ||==  ||_// 
\\_// \_)) ||___ || \\ 

---------------------------------------
*/


function test_importUsers()
{
  tableIds = ['1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD80', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD80'];
  tableIdSources = ['1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD81222556', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD80']; 
  checkFieldss = [2, 1]; 
  killSources = [0, 1]; 
  importTypes = [1, 3];
  strMacroBefores = ['', 'start'];
  strMacroAfters = ['end', ''];
  var users = new importUsers(tableIds, tableIdSources, checkFieldss, killSources, importTypes, strMacroBefores, strMacroAfters);
  Logger.log(JSON.stringify(users.users));
  
}

function importUsers(tableIds, tableIdSources, checkFieldss, killSources, importTypes, strMacroBefores, strMacroAfters)
{
  var users = {};
  var user = {};
  for (var i = 0, l = tableIds.length; i < l; i++)
  {
    user = new importUser(tableIds[i], tableIdSources[i], checkFieldss[i], killSources[i], importTypes[i], strMacroBefores[i], strMacroAfters[i]);
    users[user.id] = user;
  }
  
  this.users = users;
  
  return 0;
  
}

/*
   Fields 
   
   ------------------------------------------------------------------------------------------------------------------
   Required
   
   tableId..................fileId + SheetId: 1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8990535806
   tableIdSource............fileId + SheetId of source table
   
   Optional
   
   checkFields
     1 - (default) check field list from source and user tables, ubdate only matched fields
     0 -           import all fields
   killSource
     0 - (default) do nothing
     1 -           delete data from source table after the import

   importType 
     1 - (default) insert data into the end of user sheet
     2 -           replace existing data from user table with source data
     3 -           replace data only when Ids from user match Ids from source table
    
    strMacroBefore.......... string, the name of function to run before import
    strMacroAfter........... string, the name of function to run after import
    ------------------------------------------------------------------------------------------------------------------
        
    
    Rules:
    
    Id =  tableIdSource + tableId
          ^ from          ^ to
    

*/
function importUser(tableId, tableIdSource, checkFields, killSource, importType, strMacroBefore, strMacroAfter)
{
  this.tableId = tableId;
  this.tableIdSource = tableIdSource;
  this.id = tableIdSource + tableId;
  
  if (checkFields == 0)
  {
    this.checkFields = checkFields; 
  }
  else
  {
    this.checkFields = 1;  // default
  }

  if (killSource == 1)
  {
    this.killSource = killSource; 
  }
  else
  {
    this.killSource = 0;  // default
  }

  if (importType == 2 || importType == 3)
  {
    this.importType = importType; 
  }
  else
  {
    this.importType = 1;  // default
  }
  
  this.strMacroBefore = strMacroBefore;
  this.strMacroAfter = strMacroAfter;

  
}


function test_importUser()
{
  var user = new importUser('1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD80', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8990535806', 1, 0, 5, 'before', 'after')
  
  Logger.log(JSON.stringify(user));
  
}


/*
---------------------------------------

_____  ___  ____  __    _____ 
 ||   ||=|| ||=)  ||    ||==  
 ||   || || ||_)) ||__| ||___ 

---------------------------------------
*/


/*
  fileIds..................['MLiuno1GTRxeO...', 'MLiuno1GTRxeO...', ...]
  sheetNames...............['Sheet1', 'main', 'new tasks', 'import']
  [firstDataRows]..........[2, 6, 7, 6]
  [idColumns]..............[23, 1, 15, 42]
  [headerCols].............[[1,2,3,4,5,12,23,44,8,....],[1,2,3,4,5,12,23,44,8,....], ...]
  [originSheetNames].......['', '', '', 'importMain']
  
  rule: 1 sheet = 1 table
  table.id = file.id + sheet.id
  originTable = table from sheet from same book as table.
  if originTable = self => originTable = 0
*/
function test_TablesInfo()
{
  // test book
  // https://docs.google.com/spreadsheets/d/1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8/edit#gid=0
  var fileIds = ['1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8', '1wTEo0fat1y5dh_JwGHqaVCPNSjaodD6OrVdbglM8WD8'];
  var sheetNames = [0, 910354054, 990535806]; // Sheet1, Sheet2, Main
  var firstDataRows = [-1, 3, 4]; // -1 = set first data row to default
  var idColumns = [2, 5, 4];
  var headerCols = [[1,2,3,4,5,6], [5,4,3,1,2,15],[5,4,3,1,2,15]];
  var originSheetIds = [-1, 990535806, -1]; // -1 = set origin sheet = 0 (self)
  
  var tablesInfo = new TablesInfo(fileIds, sheetNames, firstDataRows, idColumns, headerCols, originSheetIds);
  
  Logger.log(JSON.stringify(tablesInfo.tables));

}

function TablesInfo(fileIds, sheetIds, firstDataRows, idColumns, headerCols, originSheetIds)
{
  var tables = {};
  var table = {};
  var tableId = '';
  var fileId = '';
  var sheetId = '';
  var tableIds = [];
  for (var i = 0, l = fileIds.length; i < l; i++)
  {
  
// Logger.log(i);
    fileId = fileIds[i];
    sheetId = sheetIds[i];
    table = new TableInfo(fileId, sheetId);
    if (firstDataRows) table.setFirstDataRow(firstDataRows[i]);
    if (idColumns) table.setIdColumn(idColumns[i]);
    if (headerCols) table.setHeaderCols(headerCols[i]);
    tableId = table.id;
    tableIds.push(tableId); // add table id into array, so it may be accessed later
    // add new table into tables object
    // could by found by [fileId + sheetId] in future 
    tables[tableId] = table;    
  }
  
  var originSheetId = '';
  var originTable = {};
  var tableIndex = -1;  
  // loop for originTables
  if (originSheetIds)
  {
    for (var i = 0, l = headerCols.length; i < l; i++)
    {
      originSheetId = originSheetIds[i];
      if (originSheetId == -1)
      {
        originTable = 0; // origin = self  
      }
      else
      {
        // check orogon table is in list
        tableIndex = sheetIds.indexOf(originSheetId)
        if (tableIndex == i)
        {
          originTable = 0; // origin = self
        }
        else if (tableIndex > 0)
        {
           originTable = tables[tableIds[tableIndex]];                                
        }
        else 
        {
          originTable = new TableInfo(fileIds[i], originSheetId);
        }
      }
      // set origin table
      tables[tableIds[i]].setOriginTable(originTable);        
    }  
           
  }
  
  this.tables = tables;
  
  return 0;
  
}

function TableInfo(fileId, sheetId)
{

  this.fileId = fileId;
  if (fileId)
  {
    var file = SpreadsheetApp.openById(fileId);
  }
  else
  {
    file = SpreadsheetApp.getActiveSpreadsheet();
  }  
  this.file = file;
  var sheet = getSheetById(fileId, sheetId);
  var sheetId = sheet.getSheetId();
  this.sheetId = sheetId;
  this.sheetName = sheet.getName();
  this.lastRow = sheet.getLastRow();
  this.lastColumn = sheet.getLastColumn();  
  
  this.sheet = sheet;
  
  
  this.id = fileId + sheetId;
  
  var self = this;
  this.firstDataRow = 2; // by default data starts at 2-nd row
  

  // S-E-T-T-E-R-S
  this.setFirstDataRow = function(numRow)
  {
    if (numRow > 0) self.firstDataRow = numRow;
  }
  
  this.setIdColumn = function(numColumn)
  {
    self.idColumn = numColumn;
  }  
  
  // array with ids of columns: [3,4,5,1,15]
  this.setHeaderCols = function(ids)
  {
    self.headerCols = ids;
  }
  
  this.setOriginTable = function(table)
  {
    self.originTable = table;
  }
  
  // G-E-T-E-R-S
  this.getDataRange = function()
  {
    var sheet = self.sheet;
    var firstRow = self.firstDataRow;
    var lastRow = self.lastRow;
    var lastCol = self.lastColumn;
    var rows = lastRow - firstRow + 1
    if(rows < 1) return undefined;
    var dataRange = sheet.getRange(firstRow, 1, rows, lastCol);
    return dataRange;
  }
  this.getLastRow = function()
  {
    var sheet = self.sheet;    
    var lastRow = sheet.getLastRow();
    return lastRow;
  }
  
}


/*
---------------------------------------

___  __ _____ _____  ____  _____ _____ 
|| \/ | ||==  ||_// (( ___ ||==  ||_// 
||    | ||___ || \\  \\_|| ||___ || \\ 

---------------------------------------
*/

  
/*
  arrFrom          -- data From with same fields order
  arrTo            -- data To
  numIdColTo       -- number of volumns of user with Ids
                      Note!
                      We need user column with Id because
                      user data and source data in this step
                      are merged by fields order = have same field nums
  
  
  fieldTypes       -- user field types:
                         1 - static field, stores as value
                         2 - dynamic field, populated with arrayFormula
  
  columns          -- matched columns from user to source
  
  
*/

function merge2dArrays(arrFrom, arrTo, numIdColTo, fieldTypes, columns)
{

  // get the row of IDs from
  var idsFrom = {}; 
  for (var i = 0, l = arrFrom.length; i < l; i++)
  {
     idsFrom[arrFrom[i][numIdColTo - 1]] = i;    
  }
  
  var result = [];
  
  // loop arrTo row by row
  var id = -1;
  var row = [];
  var numRowFrom = -1;
  var cols = arrTo[0].length;
  var rowResult = [];
  var rowFrom = [];
  var fieldType;
  for (var numRow = 0, rows = arrTo.length; numRow < rows; numRow++)
  {
    row = arrTo[numRow]; 
//if (numRow < 2) Logger.log(row);
    id = row[numIdColTo - 1];
    numRowFrom = idsFrom[id];
    rowResult = [];
    var numColFrom = -1;
    // loop columns
    var numCol;
    for (numCol = 0; numCol < cols; numCol++)
    {
       fieldType = fieldTypes[numCol];
       if (fieldType == 2 || fieldType == -1)
       {
         // column with formuls or empty col
         rowResult.push('');  
       }
       else if (fieldType == 1)
       {
         // column with static data
         rowResult.push(row[numCol]);   
       }
      else
      {
        // Logger.log('FieldId ' + fieldTypes[numCol] + ' = ' + fieldType);
      }
    }
    
    if (numRowFrom != undefined)
    {
      // id was found, loop columns again
      rowFrom = arrFrom[numRowFrom];
      for (numCol = 0; numCol < cols; numCol++)
      {
        numColFrom = columns[numCol];
        if (numColFrom > -1)
        {
          rowResult[numCol] = rowFrom[numCol];
        }
      }
      
    }
    
    result.push(rowResult);
    
  }
  
  return result;
  
}

/*
---------------------------------------

_____ __ _____ __    _____ _____ _  _ _____ _____   __ 
||==  || ||==  ||    ||  )  ||   \\// ||_// ||==   ((  
||    || ||___ ||__| ||_//  ||    //  ||    ||___ \_)) 

---------------------------------------
*/
function getFieldTypes(FieldTypes, colIds)
{
   var result = [];
  
   for (var i = 0, l = colIds.length; i < l; i++)
   {
     if (colIds[i] == "") 
     {
       result.push(-1)
     }
     else
     {
       result.push(FieldTypes['' + colIds[i]]); 
     }
   }
  return result;  
  
}

/*
---------------------------------------

_____  ___    __ _____ _____ _____ 
||_// ||=||  ((   ||   ||==  ||_// 
||    || || \_))  ||   ||___ || \\ 

---------------------------------------
*/
function Paster(idsFrom, idsTo)
{
  var self = this;
  this.idsFrom = idsFrom; // [1, 3, 5, 2]
  this.idsTo = idsTo; // [12, 15, 1, 5, 6, 2]
  this.data = [];
  
  function getIsland()
  {
    var island = {};
    var numFrom = -1;
    var from = [];
    var to = [];
    
    for (var i = 0, l = idsTo.length; i < l; i++)
    {
       var numFrom = idsFrom.indexOf(idsTo[i]);
       if (numFrom > -1) // found new match
       {
          // add matches
          from.push(numFrom);
          to.push(i);          
       }
       else
       {          
           from.push(-1);
           to.push(-1);
       }
           
    } 
    
    island = new Island(from, to);
    return island;  
  }
  
  this.island = getIsland();
  
 }
  
function Island(From, To)
{
  this.from = From;
  this.to = To;
}

function test_PasteInfo()
{
  var from = [1, 3, 5, 2];
  var to = [12, 15, 1, 5, 6, 2];
  var info = new Paster(from, to)
  
  Logger.log(info.island);

}
