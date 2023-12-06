/**
 * Class representing a chunky cache.
 */
class ChunkyCache {
  /**
   * Creates a new instance of ChunkyCache.
   * @param {CacheService.Cache} cache - The cache to use.
   */
  constructor(cache) {
    this.zzzCache = cache;
  }

  /**
   * Stores data in the cache in chunks.
   * @param {String} key - The cache key.
   * @param {Object} value - The data to store.
   * @param {Number} [expirationInSeconds] - Maximum expiration time in seconds (max 21600 seconds or 6 hours).
   */
  put(key, value, expirationInSeconds = 21600) {
    const json = JSON.stringify(value);
    const chunkSize = 1024 * 90;
    /**
     * Gets a reliable chunk size.
     * The reliable chunk size is a half, under discussion
     */
    const cSize = Math.floor(chunkSize / 2);
    const length = json.length;
    const iterations = Math.ceil(length / cSize);
    if (iterations > 1000) {
      /**
       * Checks if cache size exceeds the limit.
       */
      throw 'Cannot store data, size exceeds the limit. TODO: implement zipping algorithm.';
    }
    let chunks = [];
    let index = 0;
    let part;
    while (index < length) {
      const cKey = key + "_" + index;
      chunks.push(cKey);
      part = json.substring(index, index + cSize);
      this.zzzCache.put(cKey, part, expirationInSeconds);
      index += cSize;
    }
    const superBlk = {
      chunkSize: cSize,
      chunks: chunks,
      length
    };
    this.zzzCache.put(key, JSON.stringify(superBlk), expirationInSeconds);
  }

  /**
   * Retrieves data from the cache.
   * @param {String} key - The cache key.
   * @returns {Object|null} - The retrieved data or null if not found.
   */
  get(key) {
    const superBlkCache = this.zzzCache.get(key);
    if (superBlkCache == null) {
      return null;
    }
    const superBlk = JSON.parse(superBlkCache);

    if (!superBlk.chunks) {
      return null;
    }
    const chunks = superBlk.chunks.map(cKey => this.zzzCache.get(cKey));
    if (chunks.every(c => c != null)) {
      return JSON.parse(chunks.join(''));
    }
    return null;
  }

  /**
   * Removes data from the cache.
   * @param {String} key - The cache key.
   */
  remove(key) {
    const superBlkCache = this.zzzCache.get(key);
    if (superBlkCache != null) {
      const superBlk = JSON.parse(superBlkCache);
      superBlk.chunks.forEach(cKey => this.zzzCache.remove(cKey));
    }
  }

}
