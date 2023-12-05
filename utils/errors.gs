/**
  * use: var stack = new Error().stack
  * @param {Error.stack} stack
 **/
function stack2lines_(stack) {
  var re1 = new RegExp('at (.*) .*\\:(\\d+)\:\\d*\\)$', 'gm');
  var re2 = new RegExp('\\{.*\\}', 'gm');
  var res1 = stack.replace(re1, '{"$1": $2}');
  var res2 = res1.replace(re1, '{"$1": $2}');
  var res3 = res2.match(re2);
  var result = res3.map(function(elt) {
        return JSON.parse(elt)
      });
  return result;
}
