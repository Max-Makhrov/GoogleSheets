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
