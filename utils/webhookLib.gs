// {
//   "postData": {
//     "contents": "body=So%20why%20cannot%20we%20meet%20again%20%3F%29%0A",
//     "length": 54,
//     "name": "postData",
//     "type": "application/x-www-form-urlencoded"
//   },
//   "parameters": {
//     "body": [
//       "So why cannot we meet again ?)\n"
//     ]
//   },
//   "contentLength": 54,
//   "contextPath": "",
//   "parameter": {
//     "body": "So why cannot we meet again ?)\n"
//   },
//   "queryString": ""
// }


/**
 * @typedef {Object} webAppPostEvent
 * @prop {webAppPostData} postData
 * @prop {Object} parameters - any sent data
 * @prop {Number} contentLength
 * @prop {String} contextPath
 * @prop {Object} parameter - any sent data. Use this or `parameters`
 * @prop {String} queryString
 */

/**
 * @typedef {Object} webAppPostData
 * @prop {String} contents
 * @prop {Number} length
 * @prop {'postData'} name
 * @prop {'application/x-www-form-urlencoded' | String} type
 */

/**
 * @param {webAppPostEvent} e
 */
function webAppReturn(e) {
  var parameter = e.parameter;
  return {
    status: 'successful',
    parameter: parameter
  };
}
