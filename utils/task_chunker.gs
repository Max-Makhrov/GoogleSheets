/**
 * TaskChunker_ constructor.
 *
 * This constructor is used for creating a TaskChunker_ instance which is useful for chunking
 * tasks into smaller groups.
 *
 * @param {Number} [numChunks=20] - The number of chunks each task should be divided into.
 * @constructor
 */
function TaskChunker_(numChunks) {
  var self = this;
  var num_chunks = typeof numChunks !== 'undefined' ? numChunks : 20;

  /**
   * getChunks method.
   *
   * Splits an array of task options into smaller arrays (chunks) and merges each task option 
   * with a basic object.
   *
   * @param {Array<Object>} taskOptions - The array of task options to be chunked.
   * @param {Object} [basicObject={}] - An optional basic object that will be merged into each task.
   * @returns {Array<Array<Object>>} - An array containing arrays of chunked task options.
   */
  self.getChunks = function (taskOptions, basicObject) {
    if (!taskOptions) return [];
    if (!taskOptions.length) return [];
  
    basicObject = basicObject || {};
  
    var result = [];
    var subCollection = [];
  
    for (var i = 0; i < taskOptions.length; i++) {
      subCollection.push(mergeObjects(basicObject, taskOptions[i]));
      if ((i + 1) % num_chunks === 0) {
        result.push(subCollection);
        subCollection = [];
      }
    }
    if (subCollection.length) result.push(subCollection);
  
    return result;
  };

  /**
   * Utility function to merge two objects.
   *
   * @param {Object} obj1 - The first object.
   * @param {Object} obj2 - The second object.
   * @returns {Object} - A new object containing properties from both obj1 and obj2.
   */
  function mergeObjects(obj1, obj2) {
    var merged = {};
    for (var key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        merged[key] = obj1[key];
      }
    }
    for (var key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        merged[key] = obj2[key];
      }
    }
    return merged;
  }
}
