/*
  The code here uses http://alasql.org library:
  
  Downlaad it from here:
    https://raw.githubusercontent.com/agershun/alasql/develop/dist/alasql.min.js
  or here (not tested)
    https://cdn.jsdelivr.net/npm/alasql
    
    My sample sheet is here:
    https://docs.google.com/spreadsheets/d/1V0kHvuS0QfzgYTvkut9UkwcgK_51KV2oHDxKE6dMX7A/copy
*/

function test_AlaSqlQuery()
{
  
  var file = SpreadsheetApp.getActive();
  var sheet1 = file.getSheetByName('East');
  var range1 = sheet1.getDataRange();
  var data1 = range1.getValues();
  
  var sheet2 = file.getSheetByName('Reps');
  var range2 = sheet2.getDataRange();   
  var data2 = range2.getValues();
  
  var sql = "select a.Col1, a.Col3, reps.Col2, a.Col7 from ? a left join ? reps on reps.Col1 = a.Col3";
  var data = getAlaSql(sql, data1, data2);
  
  Logger.log(data);  

}

function getAlaSql(sql)
{
  var tables = Array.prototype.slice.call(arguments, 1);  
  var request = convertToAlaSql_(sql);
  var res = alasql(request, tables);
  //return JSON.stringify(res);
  return convertAlaSqlResultToArray_(res);
}



function test_AlaSqlSelect()
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName('East');
  var range = sheet.getDataRange();
  var data = range.getValues();
  
  var sql = "select * from ? where Col5 > 50 and Col3 = 'Jones'"
  Logger.log(convertAlaSqlResultToArray_(getAlaSqlSelect_(data, sql)));
  /*
  [  
     [  
        Sun Jan 07 12:38:56      GMT+02:00      2018,
        East,
        Jones,
        Binder,
        60.0,
        4.99,
        299.40000000000003                                            // error: precision =(
     ],
     [  
        Tue Jan 02 17:13:24      GMT+02:00      2018,
        East,
        Jones,
        Binder,
        60.0,
        8.99,
        539.4
     ],
     [  
        Fri Dec 29 23:59:13      GMT+02:00      2017,
        East,
        Jones,
        Pen,
        64.0,
        8.99,
        575.36
     ],
     [  
        Thu Dec 21 06:45:36      GMT+02:00      2017,
        East,
        Jones,
        Pen Set,
        62.0,
        4.99,
        309.38
     ]
  ]
  
  */

}


function getAlaSqlSelect_(data, sql)
{
  var request = convertToAlaSql_(sql);
  var res = alasql(request, [data]);
  // [{0=2016.0, 1=a, 2=1.0}, {0=2016.0, 1=a, 2=2.0}, {0=2018.0, 1=a, 2=4.0}, {0=2019.0, 1=a, 2=5.0}]
  return convertAlaSqlResultToArray_(res);
}



function convertToAlaSql_(string)
{
  var result = string.replace(/(Col)(\d+)/g, "[$2]");
  result = result.replace(/\[(\d+)\]/g, function(a,n){ return "["+ (+n-1) +"]"; });
  return result;
}




function convertAlaSqlResultToArray_(res)
{
  var result = [];
  var row = [];
  res.forEach
  (
  function (elt)
  {
    row = [];
    for (var key in elt) { row.push(elt[key]); }
    result.push(row);
  }  
  );
  return result;
}

