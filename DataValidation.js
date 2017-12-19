function makeDvFromList(range, list, note)
{
/* 
  range
    [range]                 the range to make data validation

  list
    [Earth, Tatooine]
  
  note
    "some text"
*/  

  // make a rule
  var dv = SpreadsheetApp.newDataValidation()
  dv.requireValueInList(list, true);
  if (note !== '') { dv.setHelpText(note); } // if note = '' => dv.getHelpText() === null
  dv.setAllowInvalid(false);
  range.setDataValidation(dv); 

}
