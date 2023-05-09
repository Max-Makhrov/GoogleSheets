function getTimeEllapse_(t) {
  var dif = new Date() - t;
  if (dif < 1000) { return dif + ' ms.'; }  
  var mm = parseInt(dif/1000), respo = '';
  if (mm < 60)
  {
     respo = mm + ' sec.';
  }
  else
  {
    var min = parseInt(mm / 60);
    var sec = mm - min *60;
    respo = min + ' min. ' + sec + ' sec.';
  }
  return respo;  
}
