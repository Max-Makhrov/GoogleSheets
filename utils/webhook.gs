// start your webhook journey here
// 1. Deploy this as Web App
// 2. Copy Web App URL
// 3. Go to your application and set up a new WebHook, use WebApp URL there.
// https://github.com/Max-Makhrov/GoogleSheets
// happy coding!

const webhookKeys = {
  hookdata: 'hookdata',
  error: 'error'
}

// read data from memory after webhook runs
function readHookFromCahce() {
  console.log(getFromMemory_(webhookKeys.hookdata));
  console.log(getFromMemory_(webhookKeys.error));
}

// trigger functions
function doGet(e) {
  return doPost(e);

}
function doPost(e) {
  try {
    writeHook2Cache_(e);
  } catch (err) {
    set2Memory_(webhookKeys.error, err);
  }
}

// helpers
function writeHook2Cache_(e) {
  let data = {};
  for (let k in e) {
    data[k] = e[k];
  }
  set2Memory_(webhookKeys.hookdata, JSON.stringify(data, null, 2));
}
function set2Memory_(key, value) {
  var mem = getMemory_();
  mem.put(key, value);
}
function getFromMemory_(key) {
  var mem = getMemory_();
  return mem.get(key);
}
function getMemory_() {
  return CacheService.getScriptCache();
}
