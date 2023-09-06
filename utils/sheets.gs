/**
 * @typedef {Object} SheetsInfo
 * @property {Number} id
 * @property {String} name
 * @property {String} color
 * @property {Boolean} is_protected
 */
 
/**
 * @param {SpreadsheetApp.Sheet} sheet
 * @returns {SheetsInfo}
 */
function getSheetInfo_(sheet) {
  var info = {
    id: sheet.getSheetId(),
    name: sheet.getName(),
    color: getSheetTabHexColor_(sheet),
    is_protected: isSheetProtected_(sheet)
  }
  return info;
}

/**
 * @param {SpreadsheetApp.Sheet} sheet 
 * @returns {String}
 */
function getSheetTabHexColor_(sheet) {
  var colorObject = sheet.getTabColorObject();
  // https://developers.google.com/apps-script/reference/base/color-type
  var colorTypeEnum = colorObject.getColorType().toString();
  switch (colorTypeEnum) {
    case 'UNSUPPORTED':
      return '';
    case 'RGB':
      return colorObject.asRgbColor().asHexString()
    case 'THEME':
      return colorObject.asRgbColor().asThemeColor().getThemeColorType().toString();
    default:
      return 'Unknown';
  }
}


/**
 * @param {SpreadsheetApp.Sheet} sheet 
 * @returns {Boolean} 
 */
function isSheetProtected_(sheet) {
  var protection = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
  if (protection) { return true; }
  return false;
}
