/**
 * get keys safely
 * if not exist, return null
 * 
 * @param {Object} obj
 * @param {Array []} keys
 */
// function test_getObjectsValueSafe() {
//   var obj = {
//     "version": "0.1.20221214",
//     "status_code": 20000,
//     "status_message": "Ok.",
//     "time": "0 sec.",
//     "cost": 0,
//     "tasks_count": 1,
//     "tasks_error": 1,
//     "tasks": [
//         {
//             "id": "02070909-3083-0351-0000-8c1441ac9577",
//             "status_code": 40204,
//             "status_message": "Access denied. Visit: https:\/\/app.dataforseo.com\/users\/getrows .",
//             "time": "0 sec.",
//             "result": null
//         }
//     ]
//   };
//   var keys = []
//   keys = ["tasks", 0, "status_code"];
//   console.log(getObjectsValueSafe_(obj, keys));
//   keys = ["tasks", 0, "status_message"];
//   console.log(getObjectsValueSafe_(obj, keys));
//   keys = ["tasks", 0, "foo"];
//   console.log(getObjectsValueSafe_(obj, keys));
// }
var getObjectsValueSafe_ = function(obj, keys) {
  if (!obj) {
    return null;
  }
  var node = obj, key;
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    if (!(key in node)) {
      return null;
    }
    node = node[key];
  }
  return node;
}
