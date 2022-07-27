/** Copy Sheets Usage */
function test_copySheets() {
  var tasks =  [{
      "success_message": "📗copied sheet [📜 logs] and named it [📜 logs copy1]",
      "fileid_from": "1HwUaZk86BtrPdQ1RYILwTcRwJUUClgqtAPEpMAsX0y8",
      "sheet_name": "📜 logs",
      "fileid_to": "1kdXQf79iZrId3DRuqc1bKs7-AGA_5jQG1jyspBNKCnQ",
      "sheet_new_name": "📜 logs copy1",
      "replace_existing": true,
      "hide_sheet": false
    }]

  /** 1️⃣ copy sheets */
  var memory = {};
  for (var i = 0; i < tasks.length; i++) {
    console.log(copySheets_(tasks[i], memory));
  };

  /** 2️⃣ final call adjust formulas and ranges */
  console.log(copySheets_({postfunction: true}, memory));

  return 0;
}




/**
 * copy multiple sheets by settings
 * 
 * this function uses memory to do
 * some useful staff after all tasks are done
 * 
 * @param {object} sets
 * @param {object} memory => empty object for the final work
 */
function copySheets_(task, memory) { 

  /** let memory know we need to return last time */
  memory.require_postfunction = true;
  if (task.postfunction) {
    return doPostCopySheetsWork_(task, memory);  
  }

  /** do a regular task */
  var result = copySingleSheet_(task, memory);

  /** done! */
  return result;
}


/** 
 * copy a sheet by settings
 * 
 * @param {object} sets - task
 */
function copySingleSheet_(sets, memory) {

  /** pre-sets - end with exit message */
  var endBad_ = function(msg) {
    console.log(msg);
    return msg;
  }
  /** pre-sets - delete sheet correctly */
  var deleteSheetAndNamedRanges_ = function(sheet) {  
    // remember named ranges
    var namedRanges = sheet.getNamedRanges();
    // delete sheet
    sheet.getParent().deleteSheet(sheet);
    var delete_ = function(elt) { elt.remove(); }
    namedRanges.forEach(delete_);  
    return 0;     
  }
  /** pre-sets - get named ranges from file */
  var getUsedNames_ = function (file) {
    var usedNamedRanges = file.getNamedRanges();
    var getNames_ = function (namedRange) { 
      return namedRange.getName(); }  
    return usedNamedRanges.map(getNames_);  
  }
  /** pre-sets - recreate named ranges if broken  */
  var recreateNamedRanges_ = function(sheetTo, sheetFrom, usedNames) {
    var namedRangesSheetNew = sheetTo.getNamedRanges();
    var namedRangesSheet = sheetFrom.getNamedRanges();  
    var fileTo = sheetTo.getParent();
    // read named ranges from sheet1
    var oNamedRanges = {};
    namedRangesSheet.forEach
    (function(elt, index) {
      var name = elt.getName();
      if (usedNames.indexOf(name) === -1) {
        var namedRangeNew = namedRangesSheetNew[index];
        if (!namedRangeNew) { return -1; } // smth went wrong =(
        // remember
        oNamedRanges[name] = {};
        oNamedRanges[name].place = namedRangeNew.getRange().getA1Notation();
        oNamedRanges[name].range = namedRangeNew;
      }    
    }); 
    // delete and recreate
    for (var name in oNamedRanges) {
      oNamedRanges[name].range.remove();
      fileTo.setNamedRange(name, sheetTo.getRange(oNamedRanges[name].place));    
    }  
    return 0;  
  }
  /** pre-sets - restore sheet protections */
  var copySheetProtection_ = function (sheetFrom, sheetTo) { 
    //  getProtections(SHEET) 
    var sheetProtections = sheetFrom
      .getProtections(SpreadsheetApp.ProtectionType.SHEET)
    var l = sheetProtections.length;
    for (var i = 0; i < l; i++) {
      var sheetProtection = sheetProtections[i];
      var description = sheetProtection.getDescription();
      var editors = sheetProtection.getEditors();
      var isWarningOnly = sheetProtection.isWarningOnly();
      var unprotectedRanges = sheetProtection.getUnprotectedRanges();    
      // add new sheet protection
      var protection = sheetTo.protect().setDescription(description);    
      if (isWarningOnly) {
        protection.setWarningOnly(true);      
      } else {
        var me = Session.getEffectiveUser();
        protection.addEditor(me);
        protection.removeEditors(protection.getEditors());
        if (protection.canDomainEdit()) {
          protection.setDomainEdit(false);    
        }    
        protection.addEditors(editors);               
      }
      protection.setUnprotectedRanges(unprotectedRanges);        
    }
    //  getProtections(RANGE) 
    var rangeProtections = sheetFrom
      .getProtections(SpreadsheetApp.ProtectionType.RANGE)
    var l = rangeProtections.length;
    for (var i = 0; i < l; i++) {
      var rangeProtection = rangeProtections[i];
      var description = rangeProtection.getDescription();
      var editors = rangeProtection.getEditors();
      var isWarningOnly = rangeProtection.isWarningOnly();  
      var range = sheetTo.getRange(rangeProtection.getRange().getA1Notation());
      // add new sheet protection
      var protection = range.protect().setDescription(description);        
      if (isWarningOnly) {
        protection.setWarningOnly(true);      
      }
      else {
        var me = Session.getEffectiveUser();
        protection.addEditor(me);
        protection.removeEditors(protection.getEditors());
        if (protection.canDomainEdit()) {
          protection.setDomainEdit(false);    
        }    
        protection.addEditors(editors);               
      }        
    }  
    return 0;
  }



  /** check same files */
  if (sets.fileid_from === sets.fileid_to) {
    return endBad_('Will not copy to the same file.');
  }
  /** check file from */
  try {
    var fileFrom = SpreadsheetApp.openById(sets.fileid_from)
  } catch (err) {
    return endBad_('No file with id  = ' + sets.fileid_from);
  }
  if (!fileFrom) {
    return endBad_('No file with id  = ' + sets.fileid_from);
  }
  /** check file to */
  try {
    var fileTo = SpreadsheetApp.openById(sets.fileid_to)
  } catch (err) {
    return endBad_('No file with id  = ' + sets.fileid_to);
  }
  if (!fileTo) {
    return endBad_('No file with id  = ' + sets.fileid_to);
  }
  /** add pair to memory
   * do it befor check same sheet to remember sheet in memory
   */
  var copyName = sets.sheet_new_name;
  if (!copyName || copyName === '') {
    copyName = sets.sheet_name;
  }
  if (!('pairs' in memory)) {
    memory.pairs = {}
  }
  var pairkey = sets.fileid_from + '|' + sets.fileid_to;
  if (!(pairkey in memory.pairs)) {
    memory.pairs[pairkey] = {
      sheets: [[sets.sheet_name, copyName]]
    }
  } else {
    memory.pairs[pairkey].sheets.push([sets.sheet_name, copyName]);
  }
  /** check if sheet was already there */
  var sheetCurrent = fileTo.getSheetByName(copyName);
  if (sheetCurrent && sets.replace_existing) {
    console.log('⚠️ will have to delete existing ' + copyName);
    deleteSheetAndNamedRanges_(sheetCurrent);
  } else if (sheetCurrent) {
    return endBad_('sheet ' + copyName + ' already exits and we do nothing')
  }

  /** remember used named ranges for destination file */
  var usedNames = getUsedNames_(fileTo);

  /** copy sheet */
  var sheetFrom = fileFrom.getSheetByName(sets.sheet_name);
  if (!sheetFrom) {
    return endBad_('no sheet ' + sets.sheet_name);
  }
  // copy
  var newSheet = sheetFrom.copyTo(fileTo);
  // rename
  newSheet.setName(copyName);
  // hidden
  if (sets.hide_sheet)  {
    console.log('👀 hidden sheet ' + copyName);
    newSheet.hideSheet();
  } else {
    // unhide new created sheet so user can see the result
    newSheet.showSheet(); 
  }
  // recreate named ranges
  recreateNamedRanges_(newSheet, sheetFrom, usedNames); 
  // protected sheet, ranges
  copySheetProtection_(sheetFrom, newSheet);



  // notes are copied automatically  
  // comments are not supported (2019/04)
  //   https://stackoverflow.com/questions/57683221
  sets.msg = 'created new sheet ' + copyName + ' in ' + fileTo.getUrl();
  return sets.success_message;
}

/**
 *  recreate broken formulas after copy
 */
function doPostCopySheetsWork_(sets, memory) {
  //  memory.pairs: {
  //   "1HwUaZk86BtrPdQ1RYILwTcRwJUUClgqtAPEpMAsX0y8|1kdXQf79iZrId3DRuqc1bKs7-AGA_5jQG1jyspBNKCnQ": {
  //     "sheets": [
  //       ["Sheet from", "sheet to"],
  //          ...
  //     ]

  /** loop all file pairs & restore formulas */
  var fileFrom, fileTo, ids;
  var sheetFrom, sheet, ls;
  var range, formulas, newRange, newFormulas, values;
  var value, formula, replaceFormula;
  var start_row, start_column;
  for (var key in memory.pairs) {
    var pair = memory.pairs[key];
    ids = key.split('|');
    fileFrom = SpreadsheetApp.openById(ids[0]);
    fileTo = SpreadsheetApp.openById(ids[1]);
    ls = pair.sheets.length;

      // loop sheets
      for (var i = 0; i < ls; i++) {
        sheetFrom = fileFrom.getSheetByName(pair.sheets[i][0]);
        sheet = fileTo.getSheetByName(pair.sheets[i][1]);
        
        range = sheetFrom.getDataRange(); 
        start_row = range.getRow()-1;
        start_column = range.getColumn()-1;     
        formulas = range.getFormulas();   
        newRange = sheet.getDataRange();
        newFormulas = newRange.getFormulas(); 
        values = newRange.getValues();
        
        var ll = values[0].length;
        // loop range values and formulas
        for (var r = start_row, l = values.length; r < l; r++) {
          for (var c = start_column; c < ll; c++) {
            value = values[r][c];
            formula = newFormulas[r][c];
            replaceFormula = formulas[r][c];
            // duck type bad formula
            if (formula !== ''    && 
                (value == '#N/A'  || 
                  value == '#REF!' ||
                  value == ''))  { 
              sheet.getRange(r + 1, c + 1)
                .setFormula(replaceFormula + ' '); 
                } // resets the formula          
          } // cells of sheet    
        } // cells of sheet            
      } // sheet pairs        
  } // file pairs



  // console.log('this is a final function. Lets work with memory now')
  var result = 'final tasks are also done! Thank you!';
  return result;
}
