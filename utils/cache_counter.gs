/** @class */
function CacheCounter(key) {
  const self = this;
  _setKey();
  function _setKey() {
    self.key = key;
    self.c = CacheService.getScriptCache();
    self.ttl = 21600;
  }

  /**
   * @method
   * @param {Number}
   */
  self.set = function(number) {
    self.c.put(self.key, number, self.ttl);
  }

  /**
   * @method
   * @returns {Number}
   */
  self.get = function() {
    let v = self.c.get(self.key);
    if (!v) v = 0;
    v = parseInt(v);
    return v;
  }

  /**
   * @method
   * @param {Number} number
   * @returns {Number}
   */
  self.increment = function(number) {
    let m = self.get();
    m += number;
    self.set(m);
    return m;
  }

  /**
   * @method
   */
  self.remove = function() {
    self.c.remove(self.key);
  }
}
