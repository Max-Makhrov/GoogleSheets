/*

 This file uses functions from file:
 https://github.com/Max-Makhrov/GoogleSheets/edit/master/Sheets.js

*/

/*
  _      _     _            __   ______ _ _           
 | |    (_)   | |          / _| |  ____(_) |          
 | |     _ ___| |_    ___ | |_  | |__   _| | ___  ___ 
 | |    | / __| __|  / _ \|  _| |  __| | | |/ _ \/ __|
 | |____| \__ \ |_  | (_) | |   | |    | | |  __/\__ \
 |______|_|___/\__|  \___/|_|   |_|    |_|_|\___||___/
                                                      
                                                      


*/
function TESTlistFilesInFolder() {
  listFilesInFolder("0B79ClRnKS87QUzFPamVCN0Rhakk", "Files Report");
  //                 ^^^^^^^^ folder ID ^^^^^^^^^    ^sheet Name^

}

/*
  create new sheet if not exists and make the report with
  list of files in folder:
  
  * id              '0B79ClRnKS87QUzFPamVCN0Rhakk'
  * sheetName       name of sheet with report

*/

// original script: http://stackoverflow.com/a/25730522/5372400
function listFilesInFolder(id, sheetName) {

  sheetName = sheetName || id;
  var sheet = createSheetIfNotExists(sheetName);

  var folder = DriveApp.getFolderById(id);
  var contents = folder.getFiles();

  sheet.clear();
  sheet.appendRow(["Name", "CreatedDate", "Last Updated", "Id", "Url", "Editors", "Viewers", "Owner", "Access", "Permission", "Size"]);
  
  var data = [];
  var file;
  var info = [];

  while(contents.hasNext()) {
    data = [];
    file = contents.next();
    data.push(file.getName());
    data.push(file.getDateCreated());
    data.push(file.getLastUpdated());
    data.push(file.getId());
    data.push(file.getUrl());
    // convert to string: http://www.w3schools.com/jsref/jsref_join.asp
    data.push(getEmails(file.getEditors()).join());
    data.push(getEmails(file.getViewers()).join());
    data.push(getEmails(file.getOwner()).join());
    data.push(file.getSharingAccess());
    data.push(file.getSharingPermission());
    data.push(file.getSize());
    
    Logger.log(file.getOwner().getEmail());
    
    info.push(data);
  }
  
  var rows = info.length;
  var cols = info[0].length;
  
  var range = sheet.getRange(2,1,rows,cols);
  
  range.setValues(info);
   
};
// users: https://developers.google.com/apps-script/reference/base/user
function getEmails(users) {
  var emails = [];
  var user;
  
  if (!Array.isArray(users)) { users = [users]; }
  
  for (var i = 0; i < users.length; i++) {
    user = users[i];
    emails.push(user.getEmail());  
  }
  
  return emails;

}

/*
  ______ _ _      _____        __        _             _____    _ 
 |  ____(_) |    |_   _|      / _|      | |           |_   _|  | |
 | |__   _| | ___  | |  _ __ | |_ ___   | |__  _   _    | |  __| |
 |  __| | | |/ _ \ | | | '_ \|  _/ _ \  | '_ \| | | |   | | / _` |
 | |    | | |  __/_| |_| | | | || (_) | | |_) | |_| |  _| || (_| |
 |_|    |_|_|\___|_____|_| |_|_| \___/  |_.__/ \__, | |_____\__,_|
                                                __/ |             
                                               |___/              

*/
function TESTgetFileName() {
  Logger.log(getFileName('0B4ptELk-D3USVi1NZ3ZGbkhqYXc'));
  //                      ^^^^^^^^^^ file ID ^^^^^^^^^
  //Logger.log(getFileName('0B79ClRnKS87QTnBDSFRYb3lUeDA'));
}
/*
  get file description by file id
*/
function getFileName(id) {
  var file = DriveApp.getFileById(id);
  var fileName = file.getName();    
  var strFolders = getFolders(file); 
  return strFolders + '/' + fileName;  
}

function getFolders(object) {
  
  var folders = object.getParents();
  if (!folders.hasNext()) { return 'My Drive'; } 
  var folder = folders.next();
  
  var folderNames = [];
  
  while (folder.getParents().hasNext()) {        
    var folderName = folder.getName();
    folderNames.unshift(folderName);
    folder = folder.getParents().next();
  }
  
  return folderNames.join('/');

}
