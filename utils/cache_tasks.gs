/*
  // Usage:

  // common
  const tasksList = new CacheTaskManager();
  const taskGroup = "Self care";

  // set a task
  const task = {
    todo: "clean teeth",
    id: 12535
  }
  tasksList.set(taskGroup, 12535, task);

  // read tasks and delete them from cache - as they are done
  const tasks = tasksList.get(taskGroup, true);
  console.log(tasks);
  // do all tasks as they are deleted from cache
*/

/**
 * @param {Number} [expiration] -  21,600 seconds or 6 hours
 */
function CacheTaskManager(expiration = 6 * 60 * 60) {
  const self = this;
  const c = _getCache();

  /**
   * @param {String} 
   * @param {String|Number} taskId
   * @param {Object} task
   */
  self.set = function(key, taskId, task) {  
    const _set = () => {
      const txt = c.get(key);
      const dt = JSON.parse(txt) || {};
      dt['' + taskId] = task;
      const out = JSON.stringify(dt);
      c.put(key, out, expiration);
      return out;
    }
    _useLock(_set);
  }

  self.setTasks = function(key, tasks) {
    const _setTasks = () => {
      txt = JSON.stringify(tasks);
      c.put(key, txt, expiration);
      return tasks;
    }
    return _useLock(_setTasks);
  }

  /**
   * @param {String} key
   * @param {Boolean} [toDeleteTasks]
   */
  self.get = function(key, toDeleteTasks = false) {
    const _get = () => {
      const txt = c.get(key);
      const dt = JSON.parse(txt);
      if (toDeleteTasks) {
        c.remove(key);
      }
      return dt;
    }
    return _useLock(_get);
  }

  /** @returns {CacheService.Cache} */
  function _getCache() {
    const cache = CacheService.getScriptCache();
    return cache;
  }
  /** @param {Function} func */
  function _useLock(func) {
    const lock = LockService.getScriptLock();
    const waitTime = 30;
    try {
      lock.waitLock(waitTime * 1000);
    } catch(err) {
      console.log(`Could not obtain lock after ${waitTime} seconds.`);
      throw err;
    }
    const result = func();
    lock.releaseLock();
    return result;
  }

}
