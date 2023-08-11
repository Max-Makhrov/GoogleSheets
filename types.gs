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

/**
 * onEdit
 * 
 * Trigger event for Google Sheets
 * https://developers.google.com/apps-script/guides/triggers/events
 * 
 * @typedef {Object} Event
 * @property {SpreadsheetApp.Range} range
 * @property {SpreadsheetApp.Spreadsheet} source
 */
