// function test_sendMail() {
//   var set = {
//     do: true,
//     to: 'makhrov.max+spam@gmail.com',
//     subject: 'Test #1. ⚔️💀 Kill me',
//     body: 
//       "<p><b>This text is bold</b></p>" +
//       "<p><i>This text is italic</i></p>" +
//       "<p>This is<sub> subscript</sub> and <sup>superscript</sup></p>"
//   };
//   var res = sendMail_(set);
//   console.log(res);
// }

function sendMail_(set) {
  // ##1. Checks
  if (!set.do) {
    console.log('task was set: not to do');
    return -1;
  }
  if (!set.subject || set.subject==='') {
    console.log('subject is empty');
    return -2;
  }
  if (!set.body || set.body==='') {
    console.log('body is empty');
    return -3;
  }
  if (!set.to || set.to==='') {
    console.log('to is empty');
    return -4;
  }

  // ##2. Send
  MailApp.sendEmail(
    set.to,
    set.subject,
    '',
    {htmlBody: set.body}
  );
  console.log('sent email');
  return 0;
}

function getRemainingDailyMailQuota() {
  var quota = MailApp.getRemainingDailyQuota();
  console.log(quota);
  return quota;
}
