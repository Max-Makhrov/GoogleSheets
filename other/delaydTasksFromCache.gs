//    _____             __ _       
//   / ____|           / _(_)      
//  | |     ___  _ __ | |_ _  __ _ 
//  | |    / _ \| '_ \|  _| |/ _` |
//  | |___| (_) | | | | | | | (_| |
//   \_____\___/|_| |_|_| |_|\__, |
//                            __/ |
//                           |___/ 
function get_delayedTasks_Config_() {
  // set config to your needs:
  //   cache_key: {func: function_name}
  //                    ↑
  //                    function will run
  //                    with passed key
  //                    of task[i]
  var config = {
    "Do some tasks": {
      func: 'runTest_delayedTasks_'
    },
  }
  return config;
}
// action functions
// useful function to delay example
function runTest_delayedTasks_(key, task) {
  console.log(key);
}



//   _    _                      
//  | |  | |                     
//  | |  | |___  __ _  __ _  ___ 
//  | |  | / __|/ _` |/ _` |/ _ \
//  | |__| \__ \ (_| | (_| |  __/
//   \____/|___/\__,_|\__, |\___|
//                     __/ |     
//                    |___/   
/**
 * add some tasks
 *  
 */   
function test1_delayedTasks() {
  save_delayedTasks_("Do some tasks", "hey", {});
  save_delayedTasks_("Do some tasks", "foo", {});
  save_delayedTasks_("Do some tasks", "baz", {});
  save_delayedTasks_("Do some tasks", "bar", {});

  var tasks = get_delayedTasks_("Do some tasks");
  console.log(tasks);
}
/**
 * do all tasks
 */
function test2_delayedTasks() {
  runAll_delayedTasks_("Do some tasks");
}
/**
 * do the first task
 */
function test3_delayedTasks() {
  runFirst_delayedTasks_("Do some tasks")
}




//   _______        _        
//  |__   __|      | |       
//     | | __ _ ___| | _____ 
//     | |/ _` / __| |/ / __|
//     | | (_| \__ \   <\__ \
//     |_|\__,_|___/_|\_\___/
var GoogleAppsScrip = this;
function runAll_delayedTasks_(cache_key) {
  var f = 'runAll_delayedTasks_';
  var t = new Date();
  // var cache_key = "Do some tasks";
  var tasks = get_delayedTasks_(cache_key);
  console.log(f + ' - todo tasks - ' + JSON.stringify(tasks, null, 4));
  var config = get_delayedTasks_Config_();
  var func = config[cache_key].func;
  var key = '';
  for (key in tasks) {
    GoogleAppsScrip[func](key, tasks[key]);
    console.log(f + ' - task - ' + key + ' ✔️');
  }

  // check if new tasks were there!
  var tasks = get_delayedTasks_(cache_key);
  var task = {};
  var newTasks = {};
  for (key in tasks) {
    // dateAdded___
    task = tasks[key];
    var d = task.dateAdded___;
    if (d) {
      if (d > t) {
        newTasks[key] = task;
      }
    }
  }
  // clear tasks if no new were added!
  save_delayedTasks_memory_(cache_key, newTasks);
  tasks = get_delayedTasks_(cache_key);
  console.log(f + ' - undone tasks - ' + JSON.stringify(tasks, null, 4));

  console.log(f + ' - time = ' + (new Date() - t));
}  

function runFirst_delayedTasks_(cache_key) {
  var f = 'runFirst_delayedTasks_';
  var t = new Date();
  // var cache_key = "Do some tasks";
  var tasks = get_delayedTasks_(cache_key);
  console.log(f + ' - todo tasks - ' + JSON.stringify(tasks, null, 4));
  var config = get_delayedTasks_Config_();
  var func = config[cache_key].func;
  var keys = Object.keys(tasks);
  var key0 = keys[0];
  if (key0) {
    GoogleAppsScrip[func](key0, tasks[key0]);
    console.log(f + ' - task - ' + key0 + ' ✔️');
    // check if new tasks were there!
    var tasks = get_delayedTasks_(cache_key);
    var task = {};
    var newTasks = {};
    for (key in tasks) {
      // dateAdded___
      task = tasks[key];
      if (key !== key0) {
        newTasks[key] = task;
      } else {
        var d = task.dateAdded___;
        if (d) {
          if (d > t) {
            newTasks[key] = task;
          }
        }
      }
    }
    // clear tasks if no new were added!
    save_delayedTasks_memory_(cache_key, newTasks);
    tasks = get_delayedTasks_(cache_key);
    console.log(f + ' - undone tasks - ' + JSON.stringify(tasks, null, 4));
  }

  console.log(f + ' - time = ' + (new Date() - t));
} 




//    _____           _          
//   / ____|         | |         
//  | |     __ _  ___| |__   ___ 
//  | |    / _` |/ __| '_ \ / _ \
//  | |___| (_| | (__| | | |  __/
//   \_____\__,_|\___|_| |_|\___|
function get_delayedTasks_cache_() {
  var c = CacheService.getScriptCache();
  return c;
}
function get_delayedTasks_cacheTime_() {
  // max cache time = 21600 sec. = 6 hours
  return 21600;
}
/**
 * get task by key
 * 
 * all tasks are stored in common cache slot
 * 
 * @return {object}
 *          object of named tasks
 *          {
 *            "key1": { ... }
 *            "key1": { ... }
 *            "key1": { ... }
 *          }
 */
function get_delayedTasks_(cache_key) {
  var c = get_delayedTasks_cache_();
  // var c = CacheService.getScriptCache();
  var mem = c.get(cache_key);
  if (!mem) {
    return {};
  }
  var obj = JSON.parse(mem);
  return obj;
}
/**
 * save new task to tasks
 * 
 * @cache_key {string}
 * @task_key  {string}
 * @task      {object}
 */
function save_delayedTasks_(cache_key, task_key, task) {
  var tasks = get_delayedTasks_(cache_key);
  // ↓ rare name to prevent conflicts
  task.dateAdded___ = new Date();
  tasks[task_key] = task;
  save_delayedTasks_memory_(cache_key, tasks)
}
/**
 * delete all or selected tasks
 * 
 * @cache_key {string}
 * @task_key  {string}
 * @task      {object}
 */
function delete_delayedTasks_(cache_key, task_key) {
  if (!task_key) {
    // delete all tasks
    save_delayedTasks_memory_(cache_key, {});
    return 0;
  }
  var tasks = get_delayedTasks_(cache_key);
  var newTasks = {};
  for (var key in tasks) {
    if (key !== task_key) {
      newTasks[key] = tasks[key];
    }
  }
  save_delayedTasks_memory_(cache_key, newTasks);
  return 0;
}
/**
 * save tasks 2 memory
 */
function save_delayedTasks_memory_(cache_key, tasks) {
  var lock = LockService.getScriptLock();
  try {
      // wait 60 seconds for others' 
      // use of the code section and 
      // lock to stop and then proceed
      lock.waitLock(60000); 
  } catch (e) {
      Logger.log('Could not obtain lock after 60 seconds.');
      // In case this a server side code called 
      // asynchronously you return a error code 
      // and display the appropriate message on the client side
      return "Error: Server busy try again later... Sorry :("
  }
  var c = get_delayedTasks_cache_();
  // var c = CacheService.getScriptCache();
  var mem = JSON.stringify(tasks);
  var time = get_delayedTasks_cacheTime_();
  c.put(cache_key, mem, time);
  lock.releaseLock();
}
