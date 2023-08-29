/**
 * @param {String} body
 * @param {String} [title]
 * @param {Object} [options]
 */
function showMessage_(body='', title="Message", options) {
  options = options || {
    show_close_button: true,
    close_button_text: 'Close'
  }


  var prefix = `<!DOCTYPE html>
<html>
<head>
  <title>Roboto Font with Pico CSS</title>
  <link rel="stylesheet" href="https://picocss.com/css/pico.min.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
    }
  </style>
</head>
<body>
  <div>`;

  var postfix = `  <div>
</body>
</html>`;

if (options.show_close_button) {
  var close = getMessageCloseButton_(options.close_button_text);
  body += close;
}


  var ui = SpreadsheetApp.getUi();
  // '<b>The time is &lt;?= new Date() ?&gt;</b>'
  var html = HtmlService.createTemplate(prefix + body + postfix).evaluate();
  ui.showModalDialog(html, title);

}


/**
 * @param {String} buttonText
 * 
 * @returns {String} html
 */
function getMessageCloseButton_(buttonText="Close") {
  var html = `<input type="button" class="outline" style="position:absolute; bottom:0; left: 0" value="${buttonText}"
  onclick="google.script.host.close()" />`;
  return html;
}

/**
 * @param {String} url
 * @param {String} label
 * 
 * @returns {String} link
 */
function getHtmlExternalLink_(url, label) {
  var html = `<a href="${url}" target="_blank">${label}</a>
`;
  return html;
}

/**
 * @param {String} contents
 * 
 * @returns {String} paragraph
 */
function getHtmlParagraph_(contents) {
  return `<p>${contents}</p>`
}
