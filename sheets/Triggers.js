var C_SOURCE_TRIGGER = 'SPREADSHEETS'; // the source of triger we create: for check if trigger is there

/*
--------------------------------------------------------------------
   _____      _     _______   _                       
  / ____|    | |   |__   __| (_)                      
 | (___   ___| |_     | |_ __ _  __ _  __ _  ___ _ __ 
  \___ \ / _ \ __|    | | '__| |/ _` |/ _` |/ _ \ '__|
  ____) |  __/ |_     | | |  | | (_| | (_| |  __/ |   
 |_____/ \___|\__|    |_|_|  |_|\__, |\__, |\___|_|   
                                 __/ | __/ |          
                                |___/ |___/                     
--------------------------------------------------------------------
*/
function setTriggerOnEdit(nameFunction)
{
  if (checkTriggerExists(nameFunction, C_SOURCE_TRIGGER)) { return -1; } // trigger exists
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger(nameFunction)
    .forSpreadsheet(ss)
    .onEdit()
    .create();

}

/*
  USAGE
  
  var exists = checkTriggerExists('test_getSets', 'SPREADSHEETS')

*/
function checkTriggerExists(nameFunction, triggerSourceType)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};

  
  for (var i = 0; i < triggers.length; i++) {
   trigger = triggers[i];
   if (trigger.getHandlerFunction() == nameFunction && trigger.getTriggerSource() == triggerSourceType) return true;
  }
  
  return false; 

}



// UPD 201810
function setTriggerOnHour_(functionName)
{
  if (isTriggerHere_(functionName, 'CLOCK', 'CLOCK')) { return -1; } // trigger already exists
  var file = SpreadsheetApp.getActive();
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyHours(1)
    .create();
  return 0;
}



function isTriggerHere_(functionName, eventType, triggerSource)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};  
  for (var i = 0; i < triggers.length; i++) {
    trigger = triggers[i];
    if (trigger.getHandlerFunction() == functionName && trigger.getTriggerSource() == triggerSource && trigger.getEventType() == triggerSource) return true;
  }  
  return false;
}



function deleteTriggerOnHour_(functionName)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};  
  for (var i = 0; i < triggers.length; i++) {
    trigger = triggers[i];
    if (trigger.getHandlerFunction() == functionName && trigger.getTriggerSource() == 'CLOCK' && trigger.getEventType() == 'CLOCK')
    {
      ScriptApp.deleteTrigger(trigger);
      return 0;
    }
  }  
  return -1; // trigger is not founf  
}


/**
 * function to create a trigger of selected type
 * 
 * ss    - Spreadsheet id
 * name  - Trigger Function Name
 * type  - Type of trigger
 * 
 * Supported types:
 *       1. edit
 *       2. open
 */
function setSpreadsheetTrigger_(id, name, type) {

  console.log('trigger ' + name +
     ' for new file' +
     id);

  var trigger;
  if (type === 'edit') {
    trigger = ScriptApp
      .newTrigger(name)
      .forSpreadsheet(id)
      .onEdit()
      .create();  
  }
  if (type === 'open') {
    trigger = ScriptApp
      .newTrigger(name)
      .forSpreadsheet(id)
      .onOpen()
      .create();
  } else {
    return -1;
  }

  return trigger.getUniqueId();

}
