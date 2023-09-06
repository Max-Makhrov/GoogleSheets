/**
 * @param {String} [ssId]
 * @param {SpreadsheetApp.Spreadsheet} [ss]
 * 
 * @returns {SpreadsheetApp.Spreadsheet}
 */
function getSpreadsheetSafely_(ssId, ss) {
  if (ss) return ss;
  try {
    if (!ssId) return SpreadsheetApp.getActive();
    ss = SpreadsheetApp.openById(ssId);
  } catch(err) {
    console.log(err, {ssId: ssId} );
  }
  return ss;
}

/**
 * @typedef {Object} Permissions
 * @property {Array<string>} editors
 * @property {Array<string>} viewers
 * @property {String} privacy
 * @property {String} owner
 */

 /**
 * @param {String} ssId
 * 
 * @returns {Permissions}
 */
function getSpreadsheetPermissions_(ssId) {
  var ss = SpreadsheetApp.openById(ssId);

  var result = {
    editors: ss.getEditors().map((e) => e.getEmail()),
    viwers: ss.getViewers().map((e) => e.getEmail()),
    privacy: getFilePrivacy_(ssId),
    owner: ss.getOwner().getEmail()
  }

  return result;
}

/**
 * @param {String} id
 * @returns {String}
 */
function getFilePrivacy_(id) {
  var file = DriveApp.getFileById(id);
  var access = file.getSharingAccess();
  var permission = file.getSharingPermission();

  var view = [];
  var edit = [];
  var privacy = '';

  switch (access) {
    case DriveApp.Access.PRIVATE:
      privacy = 'Private';
      break;
    case DriveApp.Access.ANYONE:
      privacy = 'Anyone';
      break;
    case DriveApp.Access.ANYONE_WITH_LINK:
      privacy = 'Anyone with a link';
      break;
    case DriveApp.Access.DOMAIN:
      privacy = 'Anyone inside domain';
      break;
    case DriveApp.Access.DOMAIN_WITH_LINK:
      privacy = 'Anyone inside domain who has the link';
      break;
    default:
      privacy = 'Unknown';
  }

  switch (permission) {
    case DriveApp.Permission.COMMENT:
      permission = 'can comment';
      break;
    case DriveApp.Permission.VIEW:
      permission = 'can view';
      break;
    case DriveApp.Permission.EDIT:
      permission = 'can edit';
      break;
    default:
      permission = '';
  }

  view = view.join(', ');

  edit = edit.join(', ');

  privacy +=
    (permission === '' ? '' : ' ' + permission) +
    (edit === '' ? '' : ', ' + edit + ' can edit') +
    (view === '' ? '' : ', ' + view + ' can view');

  return privacy;
}


/**
 * @typedef {Object} OptionsAppendValues2Sheet
 * @property {SpreadsheetApp.Spreadsheet} [ss]
 * @property {String} [ss_id]
 * @property {SpreadsheetApp.Sheet} [sheet]
 * @property {String} [sheet_name]
 * @property {Number|String} [sheet_id]
 * @property {Number} [row_from]
 * @property {Number} [column_from]
 * @property {Boolean} [clear_contents]
 * @property {Boolean} [not_throw_errors]
 * @property {Boolean} [put_to_first_free_row]
 */

/**
 * @param {Array<Array>} values
 * @param {OptionsAppendValues2Sheet} [options]
 */
function appendValues2Sheet_(values, options) {
  options = options || {};
  var msg;
  var badEnd_ = function(msg) {
    msg = '😖' + msg;
    if (options.not_throw_errors) {
      console.log(msg);
      return;
    } else {
      throw msg;
    }
  }
  if (!isValidRangeArray_(values)) {
    msg = 'given values to paste is not valid rectangle';
    return badEnd_(msg);
  }
  var ss = getSpreadsheetSafely_(options.ss_id, options.ss);
  if (!ss) {
    msg = 'could not get spreadsheet: ' + options.ss_id;
    return badEnd_(msg);
  }

  /**
   * @param {Array[[]]} array
   * @returns {Boolean}
   */
  function isValidRangeArray_(array) {
    if (!array) return false;
    if (!Array.isArray(array) || array.length < 1 || !Array.isArray(array[0])) {
      return false; // Array must be two-dimensional.
    }
    var numRows = array.length;
    var numCols = array[0].length;
    for (var i = 1; i < numRows; i++) {
      if (array[i].length !== numCols) {
        return false; // All rows must have the same length.
      }
    }
    return true; // Array is valid for range.
  }

  /** @type Spreadsheet.Sheet */
  var sheet;
  if (options.sheet) {
    sheet = options.sheet;
  } else if (options.sheet_name) {
    sheet = ss.getSheetByName(options.sheet_name);
  } else if (options.sheet_id) {
    sheet = getSheetById_(ss, options.sheet_id);
    if (!sheet) {
      msg = 'could not get sheet with id = ' + options.sheet_id;
      return badEnd_(msg);
    }
  } else {
    sheet = ss.getSheets()[0];
  }
  if (!sheet) {
    msg = 'sheet was not found';
    return badEnd_(msg);
  }

  var row1 = options.row_from || 1;
  var col1 = options.column_from || 1;
  if (options.put_to_first_free_row) {
    row1 = sheet.getLastRow() + 1;
  }
  var range = sheet.getRange(
    row1,
    col1,
    values.length,
    values[0].length
  );

  if (options.clear_contents && !options.put_to_first_free_row) {
    var rowsOffset = sheet.getMaxRows() - row1 + 1;
    var rangeDelete = range.offset(0,0,rowsOffset);
    rangeDelete.clearContent();
  }

  range.setValues(values);

  /**
   * @param {SpreadsheetApp.Spreadsheet} ss
   * @param {Number | String} sheetId
   * 
   * @returns {SpreadsheetApp.Sheet}
   */
  function getSheetById_(ss, sheetId) {
    var sheets = ss.getSheets();
    for(var i = 0; i < sheets.length; i++) {
      if(sheets[i].getSheetId() == sheetId) {
        return sheets[i];
      }
    }
    return null;
  }
}


/**
 * @param {String} [ssIdFrom]
 * @param {String} sheetNameFrom
 * @param {String} [ssIdTo]
 * @param {String} sheetNameTo
 */
function copyDataValuesBetweenSpreadsheets_(ssIdFrom, sheetNameFrom, ssIdTo, sheetNameTo) {
  var ssTo = getSpreadsheetSafely_(ssIdTo);
  var sheetTo = ssTo.getSheetByName(sheetNameTo);
  var dataFrom = getDataBySpreadsheetIdSheetName_(ssIdFrom, sheetNameFrom);

  sheetTo.clearContents();
  var rangeTo = sheetTo.getRange(1,1,dataFrom.length, dataFrom[0].length);
  rangeTo.setValues(dataFrom);

  return 0;
}


/**
 * @param {String} [ssId]
 * @param {String} sheetName
 * 
 * @returns {Array<Array>} data
 */
function getDataBySpreadsheetIdSheetName_(ssId, sheetName) {
  var ss = getSpreadsheetSafely_(ssId);
  var s = ss.getSheetByName(sheetName);
  var r = s.getDataRange();
  var d = r.getValues();
  return d;
}
