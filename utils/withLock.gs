/**
 * @param {Function} func - functon to run with lock
 * @param {Number} [pauseMs]
 * @param {Function} [onFailure]
 */
function withLock_(onSuccess, pauseMs, onFailure) {
  if (!onFailure) {
    onFailure = function(err) {
      console.error("Could not acquire lock, already running at " + new Date().toISOString())
      console.error(err.message);
    }
  }
  pauseMs = pauseMs || 30000;
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(pauseMs); // Wait for up to 5 seconds to acquire the lock
    try {
      // Critical section of your code here
      // This is where you perform operations that should not run concurrently
      return onSuccess();
    } finally {
      // Lock will be released automatically when function is finished
      lock.releaseLock(); 
    }
  } catch (e) {
    // Handle the error if the lock couldn't be acquired within the timeout
    onFailure(e);
  }
}
