/**
 * @typedef {Object} FileInfo
 * @property {String} id
 * @property {String} name
 * @property {String} mime_type
 * @property {Integer} size
 * 
 */

/**
 * @param {String} folderId
 * 
 * @returns {Array<FileInfo>} files
 */
function getFolderFiles_(folderId) {
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var file, result = [];
  /** @type  FileInfo*/
  var info;
  while (files.hasNext()) {
    file = files.next();
    info = {
      id: file.getId(),
      name: file.getName(),
      mime_type: file.getMimeType(),
      size: file.getSize()
    }
    result.push(info);
  }
  return result;
}


/**
 * @typedef {Object} OptionsGetFolder
 * @property {String} [root_folder_id]
 * @property {String} [folder_name]
 * @property {String} [folder_id]
 * @property {Boolean} [create_if_not_found]
 * @property {Boolean} [do_not_throw_error]
 */

/**
 * @param {OptionsGetFolder} options
 * @returns {DriveApp.Folder}
 */
function getFolder_(options) {
  options = options || {};

  var badEnd_ = function(msg) {
    msg = '😖' + msg;
    if (options.do_not_throw_error) {
      console.log(msg);
      return null;
    }
    throw msg;
  }

  var folder;
  if (options.folder_id) {
    try {
      folder = DriveApp.getFolderById(options.folder_id);
    } catch (err) {
      return badEnd_('could not find folder or you do not have access to: ' + options.folder_id);
    }
    return folder;
  }

  if (!options.folder_name) {
    return badEnd_('required field is missing: `folder_id` OR `folder_name`.')
  }

  var root;
  if (options.root_folder_id) {
    try {
      root = DriveApp.getFolderById(options.root_folder_id); 
    } catch(err) {
      return badEnd_('could not find root folder or you do not have access to: ' + options.root_folder_id);
    }
  } else {
    root = DriveApp.getRootFolder();
  }

  var folders = root.getFolders();
  var subFolder;
  while (folders.hasNext()) {
    subFolder = folders.next();
    if (subFolder.getName() === options.folder_name) {
      return subFolder;
    }
  }

  if (options.create_if_not_found) {
    folder = root.createFolder(options.folder_name);
    return folder;
  }

  return badEnd_('could not find folder "' + options.folder_name + '" in folder "' + root.getName() + '"');
}
