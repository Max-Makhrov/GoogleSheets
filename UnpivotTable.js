/*
  
  Note: this code use
    https://github.com/Max-Makhrov/GoogleSheets/blob/master/2dArray.js
*/


/*
  table on sheet 'Wide_Table_Sample2'
    
       A    B       C   D       E   F 
       ________________________________
   1                Plan		Fact	
   2   Id	Name	m1	m2	    m1	m2
       --------------------------------
   3   3	a3	   200	210	   220	230
   4   4	a4	   200	210	   220	230
   5   5	a5	   200	210	   220	230
   6   6	a6	   200	210	   220	230
   7   7	a7	   200	210	   220	230
   8   8	a8	   200	210	   220	230
   9   9	a9	   200	210	   220	230
  10   10	a10	   200	210	   220	230
  11   11	a11	   200	210	   220	230    
       --------------------------------
    
  input:
    
    * file            =     file object, 
                            default: ActiveSpreadsheet
    * strHead1        =     "'Wide_Table_Sample2'!A2:B2";
    * strHead2Start   =     "'Wide_Table_Sample2'!C1:C2";
    * strLabels       =     'PlanFact,Metric,Volume'; 
                            default: 'Label1,Label2,Label3...'
    
  result:
    array
      [[Id, Name, PlanFact, Metric, Volume], 
       [3.0, a3, Plan, m1, 200], 
       [3.0, a3, Plan, m2, 210], 
       [3.0, a3, Fact, m1, 220], 
       [3.0, a3, Fact, m2, 230], 
       [4.0, a4, Plan, m1, 200], 
       [4.0, a4, Plan, m2, 210], 
       [4.0, a4, Fact, m1, 220], 
       [4.0, a4, Fact, m2, 230], 
       [5.0, a5, Plan, m1, 200], 
       [5.0, a5, Plan, m2, 210], 
       [5.0, a5, Fact, m1, 220], 
       [5.0, a5, Fact, m2, 230], 
       [6.0, a6, Plan, m1, 200], 
       [6.0, a6, Plan, m2, 210], 
       [6.0, a6, Fact, m1, 220], 
       [6.0, a6, Fact, m2, 230], 
       [7.0, a7, Plan, m1, 200], 
       [7.0, a7, Plan, m2, 210], 
       [7.0, a7, Fact, m1, 220], 
       [7.0, a7, Fact, m2, 230], 
       [8.0, a8, Plan, m1, 200], 
       [8.0, a8, Plan, m2, 210], 
       [8.0, a8, Fact, m1, 220], 
       [8.0, a8, Fact, m2, 230], 
       [9.0, a9, Plan, m1, 200], 
       [9.0, a9, Plan, m2, 210], 
       [9.0, a9, Fact, m1, 220], 
       [9.0, a9, Fact, m2, 230], 
       [10.0, a10, Plan, m1, 200], 
       [10.0, a10, Plan, m2, 210], 
       [10.0, a10, Fact, m1, 220], 
       [10.0, a10, Fact, m2, 230], 
       [11.0, a11, Plan, m1, 200], 
       [11.0, a11, Plan, m2, 210], 
       [11.0, a11, Fact, m1, 220], 
       [11.0, a11, Fact, m2, 230]]

*/
function unpivotTable(file, strHead1, strHead2Start, strLabels) {
  // file
  var file = file || SpreadsheetApp.getActiveSpreadsheet();
  
  // head1 + data1
  var rHead1 = file.getRange(strHead1);
  var sheet = rHead1.getSheet();
  var lastRow = sheet.getLastRow();
  var numColumns1 = rHead1.getWidth();
  var column1 = rHead1.getColumn();
  var row = rHead1.getRow() + 1;
  var numRows = lastRow - row + 1;
  var rData1 = sheet.getRange(row, column1, numRows, numColumns1);
  var head1 = rHead1.getValues();
  var data1 = rData1.getValues();
  
  // head2 + data2
  var rHead2Start = file.getRange(strHead2Start)
  var lastColumn = sheet.getLastColumn();
  if (rHead2Start.getWidth() > 1)
  {
    lastColumn = rHead2Start.getLastColumn();   
  }
  var column2 = rHead2Start.getColumn();
  var numColumns2 = lastColumn - column2 + 1;
  var numRows2 = rHead2Start.getHeight();
  var row2 = rHead2Start.getRow();
  var rHead2 = sheet.getRange(row2, column2, numRows2, numColumns2);
  var rData2 = sheet.getRange(row, column2, numRows, numColumns2);
  var head2 = rHead2.getValues();
  var data2 = rData2.getValues();

  // labels
  var labels = [];  
  if (!strLabels) {
    for (var i = 0; i <= numRows2; i++) { labels[i] = 'Label' + i; }
  }
  else {
    labels = strLabels.split(',');
  }
  
  // result
  var result = unpivot(head1, data1, head2, data2, labels);  
  return result

}


function TESTunpivotTable() {
    var file            =     false; // use default
    var strHead1        =     "'Wide_Table_Sample2'!A2:B2";
    var strHead2Start   =     "'Wide_Table_Sample2'!C1:C2";
    var strLabels       =     'PlanFact,Metric,Volume';
    
    var result = unpivotTable(file, strHead1, strHead2Start, strLabels);
    
    Logger.log(result);

}
