/**
 * For Apps Script fetching tasks
 * UrlFetchAll...
 * 
 * @param {Number} numChunks
 */
function TaskChunker(numChunks = 50) {
  const self = this;
  const num_chunks = numChunks;

  /**
   * @param {Array<Object>} taskOptions
   * @param {Object} basicObject
   * 
   * @returns {Array<Array<Object>>}
   */
  self.getChunks = function(taskOptions, basicObject = {}) {
    if (!taskOptions) return [];
    if (!taskOptions.length) return [];
    let result = [];
    let subCollection = [];
    for (let i = 0; i < taskOptions.length; i++) {
      subCollection.push({...basicObject, ...taskOptions[i]});
      if ( ( (i + 1) % num_chunks) === 0) {
        result.push(subCollection);
        subCollection = [];
      }
    }
    if (subCollection.length) result.push(subCollection);
    return result;
  }
  
}
