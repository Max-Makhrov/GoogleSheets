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
