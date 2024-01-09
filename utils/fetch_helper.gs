/**
 * @typedef {Object} FetchOptions
 * @param {String} method
 * @param {String} contentType
 * @param {String} muteHttpExceptions
 */

/**
 * Help with fetching data
 */
function FetchHelper() {

  const self = this;
  /** @type FetchOptions */
  self.options_get = {
    method: "get",
    contentType: "application/json",
    muteHttpExceptions: true
  };

  /**
   * @param {Object} obj
   * @param {String} url
   * 
   * @returns {String}
   */
  self.getUrlParametrized = function(obj, url) {
    const params = self.getUrlParameters(obj);
    return url + '?' + params; 
  }

  /**
   * @param {Object} obj
   * 
   * @returns {String}
   */
  self.getUrlParameters = function(obj) {
    let v, vals = [];
    for (let k in obj) {
      v = k + '=' + encodeURIComponent(obj[k]);
      vals.push(v);
    }
    return vals.join('&');;
  }

}
