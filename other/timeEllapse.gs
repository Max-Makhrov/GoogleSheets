/**
 * returns human-like time elapsed since `t`
 * 
 * @param {Date} t
 * @param {String} message (optional) - set to log results
 */
function getTimeEllapse_(t, message) {
  var dif = new Date() - t;
  var return_ = function(res) {
    if (message) console.log(res, message);
    return res;
  }
  if (dif < 1000) { return return_(dif + ' ms.'); }  
  var mm = parseInt(dif/1000), respo = '';
  if (mm < 60) {
     respo = mm + ' sec.';
  } else {
    var min = parseInt(mm / 60);
    var sec = mm - min *60;
    respo = min + ' min. ' + sec + ' sec.';
  }
  return return_(respo);  
}
