/**
 * @param {String} ssId
 * 
 * @returns {Array<String>} urlFetchAppResult
 */
function openAllImportrangeFormulasAccess_(ssId) {
  var targetIds = getAllImportRangeSourceIds_(ssId);
  var requests = [], request;
  for (var i = 0; i < targetIds.length; i++) {
    request = getAllowImportrangeRequest_(ssId, targetIds[i]);
    requests.push(request);
  }
  var responses = UrlFetchApp.fetchAll(requests);
  var result = [];
  for (var i = 0; i < responses.length; i++) {
    result.push(responses[i].getContentText());
  }
  return result;
}

/**
 * @param {String} url
 * @returns {String} id
 */
function extractSpreadsheetID_(url) {
  // Regular expression to match Google Sheets URLs
  var regex = /\/spreadsheets\/d\/([\w-]+)\//;
  var match = url.match(regex);
  
  if (match && match.length > 1) {
    // The ID is captured in the first capture group
    return match[1];
  } else {
    // Return null if no match is found
    return url.replace(/"/g, '');;
  }
}


/**
 * @param {String} formula
 * 
 * @returns {Array<String>} source
 */
function importrangeFormulaToSourceParts_(formula) {
  const regex = /IMPORTRANGE[\s\n]*\([\s\n]*([^,;]+)[\s\n]*[,;]/isg;

  const matches = [];
  let match;

  while ((match = regex.exec(formula)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}


function getImportRangeSourceTypes_() {
  return {
    formula: 'formula', // TODO
    text: 'text',
    range: 'range'
  }
}

/**
 * @param {String} formula
 * @param {String} sheetName
 * 
 * @returns {Array<ImportRangeFormulaSource>}
 */
function getImportRangeSourceParts_(formula, sheetName) {
  var parts = importrangeFormulaToSourceParts_(formula);
  var res = [];
  for (var i = 0; i < parts.length; i++) {
    res.push(importrange2Sources_(parts[i], sheetName))
  }
  return res;
}

/**
 * @typedef {Object} ImportRangeFormulaSource
 * @property {String} key
 * @property {String} source
 * @property {String} type
 * @property {SpreadsheetApp.Sheet} [sheet]
 */
/**
 * @param {String} sourcePart
 * @returns {ImportRangeFormulaSource} 
 */
function importrange2Sources_(sourcePart, sheetName) {
  var types = getImportRangeSourceTypes_();
  /** @type ImportRangeFormulaSource */
  var result = { source: sourcePart };
  if (/!/.test(sourcePart)) {
    result.type = types.range;
    result.key = sourcePart;
    return result;
  }
  if (/^"[^"]*"$/.test(sourcePart)) {
    result.type = types.text;
    result.key = sourcePart;
    return result;
  }
  if (/^\$?[a-z]+\$?\d+/i.test(sourcePart)) {
    result.type = types.range;
    result.key = getSheetAsRangePrefix_(sheetName) + sourcePart;
    return result;
  }
  throw 'unexpected type by IMPORTRANGE part ' + sourcePart;
}

/**
 * @param {String} sheetName
 * 
 * @returns {String}
 */
function getSheetAsRangePrefix_(sheetName) {
  var quote = "";
  if (/\s/.test(sheetName)) {
    // TODO => make clever  
    quote = "'";
  }
  return quote + sheetName + quote + "!";
}

/**
 * @param {String} ssId
 * 
 * @returns {Array<String>} ssIds
 */
function getAllImportRangeSourceIds_(ssId) {
  var ss = SpreadsheetApp.openById(ssId);
  var importrangeSearch = ss.createTextFinder('IMPORTRANGE')
    .matchCase(false)
    .matchFormulaText(true)
    .findAll();
  
  var donorObjects = {}, sheet, sourceObjects = [];
  var addSource_ = function(sourceObject) {
    /** @type ImportRangeFormulaSource */
    var o = sourceObject;
    donorObjects[o.key] = o;
  }
  for (var i = 0; i < importrangeSearch.length; i++) {
    foundRange = importrangeSearch[i];
    sheet = foundRange.getSheet();
    sourceObjects = getImportRangeSourceParts_(
      foundRange.getFormula(), 
      sheet.getName()
      );
    sourceObjects.forEach(addSource_); 
  }

  var result = [];
  /** @type ImportRangeFormulaSource */
  var sourcePart;
  var types = getImportRangeSourceTypes_()
  for (var key in donorObjects) {
    sourcePart = donorObjects[key];
    switch (sourcePart.type) {
      case types.text:
        result.push(extractSpreadsheetID_(sourcePart.source));
        break;
      case types.range:
        result.push(extractSpreadsheetID_(ss.getRange(sourcePart.source).getValue()));
        break;
      default:
        throw 'did not expect type ' + sourcePart.type;
    }
  }

  return result;
}



/**
 * https://stackoverflow.com/questions/28038768
 * @param {string} fileId - id of the spreadsheet to add permission to import
 * @param {string} donorId - donor or source spreadsheet id, you should get it somewhere
 */
function getAllowImportrangeRequest_(fileId, donorId) {
  // adding permission by fetching this url
  var url = 'https://docs.google.com/spreadsheets/d/' +
    fileId +
    '/externaldata/addimportrangepermissions?donorDocId=' +
    donorId;
  var token = ScriptApp.getOAuthToken();
  var params = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true,
    url: url
  };
  return params;
}
