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
