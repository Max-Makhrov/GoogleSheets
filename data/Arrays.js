/*
   _____                                                                       
  / ____|                                       /\                             
 | |     ___  _ __ ___  _ __   __ _ _ __ ___   /  \   _ __ _ __ __ _ _   _ ___ 
 | |    / _ \| '_ ` _ \| '_ \ / _` | '__/ _ \ / /\ \ | '__| '__/ _` | | | / __|
 | |___| (_) | | | | | | |_) | (_| | | |  __// ____ \| |  | | | (_| | |_| \__ \
  \_____\___/|_| |_| |_| .__/ \__,_|_|  \___/_/    \_\_|  |_|  \__,_|\__, |___/
                       | |                                            __/ |    
                       |_|                                           |___/     
*/


/*
┌─┐┌─┐ ┬ ┬┌─┐┬  ┌─┐
├┤ │─┼┐│ │├─┤│  └─┐
└─┘└─┘└└─┘┴ ┴┴─┘└─┘
*/

function TESTarrayCompare() {

  var arr1 = [1, 2];
  var arr2 = [1, 2];
  
  var arr3 = ['m', 'l'];
  var arr4 = ['m', 'l'];
  
  Logger.log(arr1 === arr2);                                  // false: [1, 2] != [1, 2] 
  Logger.log(get2ArraysEquals(arr1, arr2));                   // true:  [1, 2] =  [1, 2]
  Logger.log(false || get2ArraysEquals(arr4, arr3));          // true
}


function get2ArraysEquals(arr1, arr2) {
    
    //For the first loop, we only check for types
    for (propName in arr1) {
        //Check for inherited methods and properties - like .equals itself
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
        //Return false if the return value is different
        if (arr1.hasOwnProperty(propName) != arr2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof arr1[propName] != typeof arr2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    //Now a deeper check using other objects property names
    for(propName in arr2) {
        //We must check instances anyway, there may be a property that only exists in object2
            //I wonder, if remembering the checked values from the first loop would be faster or not 
        if (arr1.hasOwnProperty(propName) != arr2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof arr1[propName] != typeof arr2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if(!arr1.hasOwnProperty(propName))
          continue;

        //Now the detail check and recursion

        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (arr1[propName] instanceof Array && arr2[propName] instanceof Array) {
                   // recurse into the nested arrays
           if (!arr1[propName].equals(arr2[propName]))
                        return false;
        }
        else if (arr1[propName] instanceof Object && arr2[propName] instanceof Object) {
                   // recurse into another objects
                   //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
           if (!arr1[propName].equals(object2[propName]))
                        return false;
        }
        //Normal value comparison for strings and numbers
        else if(arr1[propName] != arr2[propName]) {
           return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}



/*
┌─┐┬ ┬ ┌┬┐┌─┐┬─┐  ┌┐ ┬ ┬  ┬┌─┌─┐┬ ┬
├┤ │ │  │ ├┤ ├┬┘  ├┴┐└┬┘  ├┴┐├┤ └┬┘
└  ┴ ┴─┘┴ └─┘┴└─  └─┘ ┴   ┴ ┴└─┘ ┴ 
*/

function test_filterArraysByKeyArray()
{
  var key = [1, 0, 1];
  var value = 1;
  var arrays = [
    ['M', 'not M', 'L'],
    ['Star Wars', 'booo', 'Stat Trek']
  ];

  filterArraysByKeyArray(key, value, arrays);

  Logger.log(arrays[0]);
  Logger.log(arrays[1]);
}
function filterArraysByKeyArray(key, value, arrays)
{
  function check(elt, i) { return value === key[i]; }    
  for (var i = 0, l = arrays.length; i < l; ++i)
  { 
    arrays[i] = arrays[i].filter(check); 
  }
  return 0;
}


/*
┬ ┌┐┌┌┬┐┌─┐┬─┐┌─┐┌─┐┌─┐┌┬┐
│ │││ │ ├┤ ├┬┘└─┐├┤ │   │ 
┴ ┘└┘ ┴ └─┘┴└─└─┘└─┘└─┘ ┴ 
*/

// https://stackoverflow.com/a/1887494/5372400
function test_intersection()
{
Logger.log(arrayIntersection( [1, 2, 3, "a"], [1, "a", 2], ["a", 1] )); // Gives [1, "a"]; 

}
var arrayContains = Array.prototype.indexOf ?
    function(arr, val) {
        return arr.indexOf(val) > -1;
    } :
    function(arr, val) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    };
function arrayIntersection() {
    var val, arrayCount, firstArray, i, j, intersection = [], missing;
    var arrays = Array.prototype.slice.call(arguments); // Convert arguments into a real array

    // Search for common values
    firstArray = arrays.pop();
    if (firstArray) {
        j = firstArray.length;
        arrayCount = arrays.length;
        while (j--) {
            val = firstArray[j];
            missing = false;

            // Check val is present in each remaining array 
            i = arrayCount;
            while (!missing && i--) {
                if ( !arrayContains(arrays[i], val) ) {
                    missing = true;
                }
            }
            if (!missing) {
                intersection.push(val);
            }
        }
    }
    return intersection;
}


/*

   _____                            _             
  / ____|                          | |            
 | |  __  ___ _ __   __ _ _ __ __ _| |_ ___  _ __ 
 | | |_ |/ _ \ '_ \ / _` | '__/ _` | __/ _ \| '__|
 | |__| |  __/ | | | (_| | | | (_| | || (_) | |   
  \_____|\___|_| |_|\__,_|_|  \__,_|\__\___/|_|   
                                                                                                    

*/

/*
  generate array with n elements
  fill it with random numbers
  
  Math.random();        // ~ 0.07438184694369299

*/
function getRandomArray(n) {

  var arr = [];

  for (var i = 0; i < n; i++) {
    arr[i] = Math.random();    
  }
  
  return arr;

}
function TESTgetRandomArray() {
  var n = 50;
  
  Logger.log(getRandomArray(n));

}

/*
  generate array with n elements
  fill it with random integer numbers
  
  Math.floor(Math.random() * 500) + 1;        // ~ 268

*/
function getRandomArrayOfIntegers(n, min, max) {
  max = max || 1;
  min = min || 0;
  var arr = [];

  for (var i = 0; i < n; i++) {
    arr[i] = Math.floor(Math.random() * max) + min;    
  }
  
  return arr;


}

function TESTgetRandomArrayOfIntegers() {
  var n = 50;
  var min = 1;
  var max = 500
  
  Logger.log(getRandomArrayOfIntegers(n, min, max));

}



function test_getFilled2DArray()
{
  var value = 'max';
  Logger.log(getFilled2DArray(value, 3, 4));
  // [[max, max, max], [max, max, max], [max, max, max], [max, max, max]]
}
function getFilled2DArray(value, w, h)
{
  var result = [];
  var row = [];
  for (var i = 0; i < h; i++)
  {
    row = [];
    for (var ii = 0; ii < w; ii++) { row.push(value); }
    result.push(row);
  }
  return result;

}




