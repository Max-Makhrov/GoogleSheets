//  Represents the options for an HTTP request.
//  https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#getrequesturl,-params
/**
 * @typedef {Object} UrlFetchRequest
 * @property {string} url
 * @property {string} contentType - The content type, e.g., 'application/xml; charset=utf-8'.
 * @property {Object.<string, string>} headers - JavaScript key/value map of HTTP headers.
 * @property {string} method - HTTP method: get, delete, patch, post, put.
 * @property {string | number[] | Blob | Object.<string, (string | Blob)>} payload - The POST body; string, blob, or object.
 * @property {boolean} validateHttpsCertificates - If false, ignores invalid certificates.
 * @property {boolean} followRedirects - If false, doesn't auto-follow HTTP redirects.
 * @property {boolean} muteHttpExceptions - If true, doesn't throw on failure.
 * @property {boolean} escaping - If false, no URL character escaping. 
 */

// triggers
/**
 * onEdit
 * 
 * Trigger event for Google Sheets
 * https://developers.google.com/apps-script/guides/triggers/events
 * 
 * @typedef {Object} OnEditEvent
 * @property {SpreadsheetApp.Range} range
 * @property {SpreadsheetApp.Spreadsheet} source
 */
/**
 * onFormSubmit from Spreadsheet
 *
 * https://developers.google.com/apps-script/guides/triggers/events
 * 
 * @typedef {Object} OnFormSubmitSrpeadsheetTriggerEvent
 * @property {SpreadsheetApp.Range} range
 * @property {Array} values
 * @property {Object} namedValues - the question names and values from the form submission
 * @property {String} triggerUid
 */

// Sheets API
  /**
   * Sheets.Spreadsheets.Values.batchUpdate(batchresource, clientId);
   * 
   * @typedef {Object} sheetsApiBatchUpdateResource
   * @property {Array<SheetsApiBatchUpdateValuesTask>} data
   * @property {String} valueInputOption - USER_ENTERED
   */
  /** 
   * @typedef {Object} SheetsApiBatchUpdateValuesTask 
   * @property {String} range - 'Sheet1'!Z4:AI4
   * @property {String} majorDimension - ROWS
   * @property {Array<Array>} values
  */


