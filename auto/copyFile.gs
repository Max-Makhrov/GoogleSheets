// // Sample sets:
// var sets = {
//   folder: 'folder_id2',
//   file: 'spreasheet_id2',
//   // date_format: 'yyyy-MM-dd'
//   report_file: 'spreasheet_id for report',
//   report_sheet: 'sheet name to write report'
//   // report_fields: 'folder1_url,folder1_name,...'
// }
function copyFile2Archive_(sets) {
  var fName = 'copyFile2Archive_';
  var res0 = {};
  var default_fields = [
    'time',
    'folder1_url',
    'folder1_name',
    'file1_url',
    'file1_name',
    'folder2_url',
    'folder2_name',
    'file2_url',
    'file2_name',
    'form2_names',
    'form2_urls'];
  var report_fields = sets.report_fields || default_fields.join(',');
  var t = new Date();
  res0.time = t;

  // 0. Checks + Info
  var folder = DriveApp.getFolderById(sets.folder);
  if (!folder) {
    console.log(fName+ ' / no folder');
    return -1;
  }
  res0.folder2_name = folder.getName();
  res0.folder2_url = folder.getUrl();
  var file = DriveApp.getFileById(sets.file);
  if (!file) {
    console.log(fName+ ' / no file');
    return -2;
  }
  // get file1 folder
  var parents1 = file.getParents();
  var folder1;
  if (parents1.hasNext()) {
    folder1 = parents1.next();
    res0.folder1_name = folder1.getName();
    res0.folder1_url = folder1.getUrl();
  }
  // Get linked Form Names
  var formNames = {};
  var isSheet = false;
  var mimeType = file.getMimeType();
  console.log(mimeType);
  console.log(MimeType.GOOGLE_SHEETS)
  if (mimeType === MimeType.GOOGLE_SHEETS) {
    isSheet = true;
  }

  if (isSheet) {
    var s0 = SpreadsheetApp.openById(sets.file);
    var sheets0 = s0.getSheets();
    var form0, formUrl0, sheet0, form0file;
    for (var i = 0; i < sheets0.length; i++) {
      sheet0 = sheets0[i];
      formUrl0 = sheet0.getFormUrl();
      if (formUrl0) {
        form0 = FormApp.openByUrl(formUrl0);
        form0file = DriveApp.getFileById(form0.getId()); 
        formNames[sheet0.getName()] = form0file.getName();
      }
    }
  }


  // 1. create a file copy
  var fileName = file.getName();
  res0.file1_name = fileName;
  res0.file1_url = file.getUrl();
  var copy = file.makeCopy(folder);
  // wait for file copy be processed?
  // Utilities.sleep(500);
  console.log(fName+ ' / Made a copy of ' + fileName);
  console.log(fName+ ' / Folder 2: ' + sets.folder);
  res0.file2_url = copy.getUrl();


  // 2. name a copy
  // default stamp format is current date
  var format = sets.date_format || 'yyyy-MM-dd';
  var d = Utilities.formatDate(
    new Date(),
    Session.getTimeZone(),
    format
  );
  var pre = d + '_';
  var name = pre + fileName;
  copy.setName(name);
  res0.file2_name = name;


  // 3. move/rename linked forms
  var id = copy.getId();
  res0.form2_names = '';
  res0.form2_urls = '';
  form2_names = [];
  form2_urls = [];
  if (!isSheet) {
    console.log(fName+ ' / file is not spreadhseet');
  } else {
    var ss = SpreadsheetApp.openById(id);
    var sheets = ss.getSheets();
    var formUrl, form, formId, formFile;
    var formName, newFormName, sheet;
    for (var i = 0; i < sheets.length; i++) {
      sheet = sheets[i];
      formUrl = sheet.getFormUrl();
      if (formUrl) {
        // form found, copy it
        form = FormApp.openByUrl(formUrl);
        formId = form.getId();
        formFile = DriveApp.getFileById(formId);
        formFile.moveTo(folder);
        formName = formNames[sheet.getName()];
        newFormName = pre + formName;
        formFile.setName(newFormName);
        form2_urls.push(formUrl);
        form2_names.push(newFormName);
      }
    }
    res0.form2_names = form2_names.join(',');
    res0.form2_urls = form2_urls.join(',');
  }

  
  // 4. write result to report sheet
  if (!sets.report_file ||
      !sets.report_sheet
  ) {
    // no write 2 report sheet
    return 0;
  }
  var fiels_out = report_fields.split(',');
  var data_out = [];
  for (var i = 0; i < fiels_out.length; i++) {
    data_out.push(res0[fiels_out[i]]);
  }
  var ss2 = SpreadsheetApp.openById(sets.report_file);
  var s2 = ss2.getSheetByName(sets.report_sheet);
  s2.appendRow(data_out);

  console.log(fName+ ' / completed: ' +getTimeEllapse_(t));
  return 0;
}
