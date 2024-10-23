/**
 * @param {Object[]} objects
 * 
 * @returns {String[][]}
 */
function tabulize_(objects) {
  var flatArr = [];
  var headers = [];
  function addHeader(header) {
    if (headers.indexOf(header) === -1) {
      headers.push(header);
    }
  }
  objects.forEach(o => {
    const f = flatten_(o);
    const keys = Object.keys(f);
    keys.forEach(addHeader);
    flatArr.push(f);
  });
  var res = [headers];
  flatArr.forEach(f => {
    const row = [];
    headers.forEach(h => {
      var v = f[h] || "";
      row.push(v);
    })
    res.push(row);
  })
  return res;
}



/**
 * @param {Object} obj
 * 
 * @returns {Object}
 */
function flatten_(obj, parent = '', res = {}) {
  for (let key in obj) {
    let propName = parent ? `${parent}_${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flatten_(obj[key], propName, res);
    } else {
      res[propName] = "" + obj[key];
    }
  }
  return res;
}
