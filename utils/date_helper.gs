/**
 * @typedef {Object} DatesPeriod
 * @prop {String} start_date
 * @prop {String} end_date
 */


function DateHelper() {
  const self = this;
  self.now = new Date();
  let tommorow = new Date()
  tommorow.setDate(self.now.getDate() + 1);
  self.tommorow = tommorow;

  /**
   * @param {Date} date - The date to be formatted.
   * @returns {string} - The formatted date string.
   */
  self.toYYYYMMDD = function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * @param {String} start "2022-01-15"
   * @param {Number} [dayStep]
   * 
   * @returns {Array<DatesPeriod>}
   */
  self.getYYYYMMDDChunks = function(start, dayStep = 1) {
    /** @type TimeChunkOptions */
    const options = {
      start: start,
      step: dayStep
    };
    return _getDayTimeChunks(options);
}

  /**
   * 
   */
  self.getYYYYMMDDHHMMSSChunks = function(start, end, dayStep) {
    /** @type TimeChunkOptions */
    const options = {
      start: start,
      end: end,
      step: dayStep,
      is_time_format: true
    };
    return _getDayTimeChunks(options);
  }

  /**
   * @typedef {Object} TimeChunkOptions
   * @prop {String} start
   * @prop {String} [end]
   * @prop {Number} [step]
   * @prop {Boolean} [is_time_format]
   */
  /**
   * @param {TimeChunkOptions} options
   */
  function _getDayTimeChunks(options) {
    /** @type {Array<DatesPeriod>} */
    const result = [];
    let start = options.start;
    const end = options.end || self.toYYYYMMDD(self.now);
    const dayStep = options.step || 1;
    let dateUTC = new Date(start);

    let toContinue = start <= end;
    let start_date, end_date;

    let increment = 1, timeTail = "";
    if (options.is_time_format) {
      increment = 0;
      timeTail = " 00:00:00";
    }

    while (toContinue) {
      dateUTC.setDate(dateUTC.getDate() + dayStep - 1);
      start_date = start + timeTail;
      end_date = self.toYYYYMMDD(dateUTC) + timeTail;
      if (end_date > end) end_date = end + timeTail;
      result.push({start_date, end_date});
      dateUTC.setDate(dateUTC.getDate() + increment);
      start = self.toYYYYMMDD(dateUTC);
      toContinue = start <= end;
    }
    return result;
  }
}
