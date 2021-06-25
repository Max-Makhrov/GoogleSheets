var C_OBJECT_FIELD_DELIMETER = ' > ';
var C_DEFALUT = '';


function getObjectFields_(obj, keyprefix) {
  var fields = []; 
  if (typeof keyprefix === "undefined") { keyprefix = ''; }
  var type = '';
  for (var key in obj)
  {
    type = typeof obj[key];
    if (Array.isArray(obj[key]))
    {
      // if array lenght is 1 and first element is object      
      if (obj[key].length === 1 && typeof obj[key][0] === 'object')
      {
        fields = fields.concat(getObjectFields_(obj[key][0], keyprefix + key + C_OBJECT_FIELD_DELIMETER));          
      }
      else
      {
       fields.push(keyprefix + key); 
      }
    }
    else if (type === 'object')
    {
      fields = fields.concat(getObjectFields_(obj[key], keyprefix + key + C_OBJECT_FIELD_DELIMETER));
    }
    else
    {
      fields.push(keyprefix + key);
    }            
  }
  return fields;  
}


function getObjectAsRow_(obj, fields)
{
  fields = fields || getObjectFields_(obj); 
  var row = [];  
  for (var i = 0, l = fields.length; i < l; i++)
  {
    var keys = fields[i].split(C_OBJECT_FIELD_DELIMETER);
    row.push(getObjectField_(obj, keys));    
  }  
  return row;    
}


function getObjectField_(obj, keys)
{
  var node = obj;
  var key = '';
  
  for (var i = 0, l = keys.length; i < l; i++)
  {
    key = keys[i]
    
    if (Array.isArray(node)) 
    { 
      if (node.length === 1 && typeof node[0] === 'object')
      {
        node = node[0][key];         
      }
      else if (node.length === 1)
      {
        node = '';       
      }
      else
      {
        if (node.length === 1) { node = node[0]; }
        else { node = JSON.stringify(node); }
      }
    }
    else if (node === null)
    {
      return C_DEFALUT;
    }
    else if (typeof node === 'object')
    {
      if (key in node)
      {
        node = node[key];  
      } 
      else
      {
        return C_DEFALUT; 
      }           
    }
    else
    {
      return node;       
    }
  }  
  if (Array.isArray(node)) 
  {    
    if (node.length === 1) { node = node[0]; }
    else if (node.length === 0) { return ''; }
    else { return JSON.stringify(node); }   
  }
  node = getDateFromText_(node);  // return date if possible 
  

  // check node is string > 50000 chars
  if (typeof node === 'string')
  {
    if (node.length > 50000) { node = node.substring(0, 50000); }         
  }
  
  // check node is date and convert it to "Google date" = spreadhseet format
  if (node instanceof Date) { node = getGoogleDate_(node); }

  return node;  
}


function getGoogleDate_( JSdate ) { 
   var D = new Date(JSdate) ;
   var Null = new Date(Date.UTC(1899,11,30,0,0,0,0)) ; // the starting value for Google
   return ((D.getTime()  - Null.getTime())/60000 - D.getTimezoneOffset()) / 1440 ;
}


function getJsonArrayAsTable(jsonArray)
{
  json = JSON.parse(jsonArray);
  return  getObjectsAsTable_(json)
}

function getObjectsAsTable_(objArray, fields, hideHeaders)
{
  fields = fields || getObjectFields_(objArray[0]);     
  var result = [];
  if (!hideHeaders) { result.push(fields); }
  
  var addObjRow_ = function(obj) { result.push(getObjectAsRow_(obj, fields)); }
  objArray.forEach(addObjRow_);
  
  return result;
  
}


function test_getDateFromText()
{
  Logger.log(getDateFromText_('2018-06-19T20:50:50.767+0500'));  // Tue Jun 19 18:50:50 GMT+03:00 2018
  Logger.log(getDateFromText_('tadadada'));                      // tadadada
  Logger.log(getDateFromText_(null));                            // null
  Logger.log(getDateFromText_(undefined));                       // undefined
  Logger.log(getDateFromText_(new Date()));                      // Sat Jun 23 13:13:58 GMT+03:00 2018
  Logger.log(getDateFromText_(true));                            // true  
  Logger.log(getDateFromText_(100500));                          // 100500.0
  Logger.log(getDateFromText_(100.55));                          // 100.55  
  Logger.log(getDateFromText_([1,2,3]));                         // [1.0, 2.0, 3.0]
  Logger.log(getDateFromText_({"a":"b"}));                       // {"a":"b"}
  
}

function getDateFromText_(text)
{
  if (text instanceof Date && !isNaN(text.valueOf())) return text;  
  var t = new Date(text);
  if (!t.getFullYear() || t.getFullYear() === 1970) { return text; }

  return t
    
}


/**
  get JSON value parced by array of keys
  
  JsonText (string) =  
  "{
    "error": [],
    "result": {
        "XXBTZUSD": {
            "a": ["6828.90000", "1", "1.000"],
            "b": ["6822.40000", "3", "3.000"],
            "c": ["6828.30000", "0.45700000"],
            "v": ["8345.28377914", "11241.98107284"],
            "p": ["7079.63828", "7171.18596"],
            "t": [22419, 30041],
            "l": ["6751.00000", "6751.00000"],
            "h": ["7432.70000", "7529.70000"],
            "o": "7410.10000"
        }
    }
  }"
  
  valuesArray (array) = ["result", "XXBTZUSD", "a"]
  
  getTextAsJson (array) = ["6828.90000", "1", "1.000"]
  

*/
function getTextAsJson(JsonText, valuesArray)
{
  var node = JSON.parse(JsonText);  
  for (var i = 0, l = valuesArray.length; i < l; i++)
  {
    node = node[valuesArray[i]];     
  }    
  return node;    
}
