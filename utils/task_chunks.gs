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
   * @param {Array} taskOptions
   * @returns {Array<Array>}
   */
  self.getChunks = function(taskOptions) {
    if (!taskOptions) return [];
    if (!taskOptions.length) return [];
    let result = [];
    let subCollection = [];
    for (let i = 0; i < taskOptions.length; i++) {
      subCollection.push(taskOptions[i]);
      if ( ( (i + 1) % num_chunks) === 0) {
        result.push(subCollection);
        subCollection = [];
      }
    }
    if (subCollection.length) result.push(subCollection);
    return result;
  }
  
}
