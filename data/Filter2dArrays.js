/*

  ______ _ _ _            
 |  ____(_) | |           
 | |__   _| | |_ ___ _ __ 
 |  __| | | | __/ _ \ '__|
 | |    | | | ||  __/ |   
 |_|    |_|_|\__\___|_|   
                          
                          

*/


/*

  input:
    
    * array                   [[1, 'Jo',  500],
                               [2, 'Mo',  200],
                               [3, 'Lo', 1000],
                               [4, 'Lo', 2000],
                               [5, 'Lo', 1000]]
    
    * formula*:
                              "(Col2 = 'Lo')*(Col3 <=1000)"
                              
                              
      * Note:
      ___________________________________________________
      Use Col1, Col1, ColN notation.      
      For row [1, 'Jo',  500]:
        Col1 = 1
        Col2 = 'Jo'
        COl3 = 500
        
      Use math operations: 
        +     for OR logic
        *     for AND logic
        
      TODO: make the formula syntax understand more:
        1. contains          in('Jo', 'Mo')
        2. regex             regexmatch('Jo|Mo')
        3. dates             date '2017-02-15' 
      Throw error when bad tokens are entered:
        1. col != Col
      ---------------------------------------------------
      
   
  output:
  
    * array                   [[3, 'Lo', 1000],
                               [5, 'Lo', 1000]]

*/


function TESTfilter2dArray() {
  
  // from array
  var array = [[1, 'Jo',  500],
               [2, 'Mo',  200],
               [3, 'Lo', 1000],
               [4, 'Lo', 2000],
               [5, 'Lo', 1000]];
  
  var result = filter2dArray(array, "(Col2 = 'Lo')*(Col3 <=1000)");
  
  Logger.log(result); // [[3.0, Lo, 1000.0], [5.0, Lo, 1000.0]]
  
  
  
  // from sheet
  var file = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = file.getSheetByName('test1');
  var range = sheet.getDataRange();
  var array = range.getValues();
  
  var formula = "(Col2 = 'water')*(Col3>1)";
  
  result = filter2dArray(array, formula);
  
  Logger.log(result);
  

}


function filter2dArray(array, formula) {
  var result = [];
  result = array.filter(filterLab(formula));
  return result;
  
  // function for filtering operation
  function filterLab(formula) {    
    return function(row) {
      var formulizer = getFormulizer(formula);
      var matches = formulizer.calculate(row);
      if (matches) { return row; }    
    }  
  }
}


/*
   _____      _     ______                         _ _              
  / ____|    | |   |  ____|                       | (_)             
 | |  __  ___| |_  | |__ ___  _ __ _ __ ___  _   _| |_ _______ _ __ 
 | | |_ |/ _ \ __| |  __/ _ \| '__| '_ ` _ \| | | | | |_  / _ \ '__|
 | |__| |  __/ |_  | | | (_) | |  | | | | | | |_| | | |/ /  __/ |   
  \_____|\___|\__| |_|  \___/|_|  |_| |_| |_|\__,_|_|_/___\___|_|   
                                                                    
                                                                    
*/



/*

input:
  formula             '(a + b) * c'

Step 1
------
use Tokenizer to get array:
  arr
  (a + b) * c
  ^^^^^^^^^^^

Step 2
------
→ Trim
  (a+b)*c
  ^^^^^^^

 
Step 3
------
→ Tree search: (a*b) — a*b – (a+b) – a+b — (a>b) — a>b  
  round1
    (a+b) → (A*c)
  round2
    (a*b) → A
  end

Logic
-----
  Basic rule: find first matching operetion class.
    [operation]:
    ['multiplication', 'addition', 'comparison']
  Then find two free values from both sides:
    [value][operation][value]
  If found, make new node. Add indexes to replacement Array.
  Then try match surrounding parentheses:
    [l_paren][value][operation][value][r_paren]
  If found, add their indexes to replacement Array.
  Replace all found values with new node.

------------------------
  Classes
    *    multiplication
    a    value
    +    addition
    (    l_paren
    )    r_paren
    >    comparison
         whitespace
------------------------


*/

function TESTgetFormulizer() {
  
// test #1  
//  var formula = "(Col3 = 'ok')*(Col2 > 500) + (Col1 <= 'may')";
//
//  var formulizer = getFormulizer(formula);
//
//  Logger.log(formulizer.calculate(['may',650,'ok',4,5]));  // 2
//  Logger.log(formulizer.calculate(['may',400,'ok']));      // 1
//  Logger.log(formulizer.calculate(['xxx',400,'ok']));      // 0
  
// test #2  
  var row = [3.0, 'Lo', 1000.0];
  formula = "(Col2 = 'Lo')*(Col3 <=1000)";
  formulizer = getFormulizer(formula);
  Logger.log(formulizer.calculate(row));
  Logger.log(formulizer.nodes);
  var nodes = formulizer.nodes;
// get all nodes and tokens:
  for (var i = 0; i < nodes.length; i++) {
    token = nodes[i]['token1'];
    Logger.log(token['data']);
    Logger.log(token['name']);
    Logger.log(formulizer.returnTokenValue(token, row));
    token = nodes[i]['token2'];
    Logger.log(token['data']);
    Logger.log(token['name']);
    Logger.log(formulizer.returnTokenValue(token, row));    
  }  
  

//  var result = formulizer.calculate(row);
//  var row = ['may',650,'ok',4,5];
//  
//  Logger.log(formulizer.nodes);
//  
//  var token;
//  
//  var nodes = formulizer.nodes;

//// get all nodes and tokens:
//  for (var i = 0; i < nodes.length; i++) {
//    token = nodes[i]['token1'];
//    Logger.log(token['data']);
//    Logger.log(token['name']);
//    Logger.log(formulizer.returnTokenValue(token, row));
//    token = nodes[i]['token2'];
//    Logger.log(token['data']);
//    Logger.log(token['name']);
//    Logger.log(formulizer.returnTokenValue(token, row));    
//  }
 
// get last node
//var index = nodes.length - 1;
//var lastNode = nodes[index];
//var result = formulizer.returnNodeValue(lastNode, row);
//
//Logger.log(result);





}

function getFormulizer(formula) {
//Logger.log('out');  
  // data installation
  var formulaTokenizer = getFormulaTokenizer();
  var tokens = formulaTokenizer.tokenize(formula).tokens;
  var operations = ['multiplication', 'addition', 'comparison'];
    
  // trim
  tokens = tokens.filter(function(token) { if (token.name != 'whitespace') return token; });
//Logger.log(tokens);
  
  // classes
  var classes = tokens.map(function(token) { return token.class; } );
//Logger.log(classes);
  
  
  // write nodes
  var numReplaceRange = 0; 
  var numOperation = -1; 
  var i = 0;
  var numOprs = operations.length;
  var numClasses = classes.length;
  var numNodes = 0;
  var token1, token2, operation;
  
//Logger.log(classes);
//Logger.log(classes[2] == operations[1]);

while (numClasses > 1) { 
    i = 0;
    numOperation = -1;
    numReplaceRange = 0;
    while (i < numOprs && numOperation < 0) {
      numOperation = classes.indexOf(operations[i]);
      // check classes from both sides are values
      if (numOperation > 0) {
        if (classes[numOperation-1] != 'value' || classes[numOperation+1] != 'value') { numOperation = -1; }
      }      
      i++;
    }
//Logger.log(tokens[numOperation]);    
    
    // add value to replace operation with token
    numReplaceRange = 1;
    
    // when formula is incorrect
    if (numOperation == -1 && classes != []) { 
      return 'Formula parce error'; 
    }

    
    // check if node is inside parentheses
    if (classes[numOperation-2] == 'l_paren' || classes[numOperation+2] == 'r_paren') { numReplaceRange = 2; }    
    
    function filterClasses(value, index) {
      if (index < numOperation - numReplaceRange ||  index > numOperation + numReplaceRange || index == numOperation) { return value; }     
    }
    
    // makeNewNode!
    if (numNodes == 0) { var formalizer = new Formulizer(); } 
    token1 = tokens[numOperation-1]; 
    // copy to prevent overwriting
    operation = JSON.parse(JSON.stringify(tokens[numOperation]));
// Logger.log(operation);
    token2 = tokens[numOperation+1];
    formalizer.add(token1, operation, token2);
    
    
    // reduce tokens and classes
    classes[numOperation] = 'value';
    tokens[numOperation].class = 'value';
    tokens[numOperation].name = 'token';
    tokens[numOperation].data = numNodes;
    
    classes = classes.filter(filterClasses);
    tokens = tokens.filter(filterClasses);
        
//Logger.log(classes);
//Logger.log(tokens);    
  
  // add values for proper loop
  numNodes ++;
  numClasses = classes.length;
}

return formalizer;
  
}

function getFormulaTokenizer() {

/*
         _
        [ ]
       (   )
        |>|
     __/===\__
    //| o=o |\\
  <]  | o=o |  [>
      \=====/
     / / | \ \
    <_________>  Educate me...

*/
  var tokenizer = new Tokenizer(); 
  tokenizer.addToken('string', "'.*'", 'value');  
  tokenizer.addToken('whitespace', '\\s+', 'whitespace');
  tokenizer.addToken('l_paren', '\\(', 'l_paren');
  tokenizer.addToken('r_paren', '\\)', 'r_paren');
  tokenizer.addToken('float', '[0-9]+\\.[0-9]+', 'value');
  tokenizer.addToken('col', 'Col[0-9]+', 'value');
  tokenizer.addToken('int', '[0-9]+', 'value');
  tokenizer.addToken('mul', '\\*', 'multiplication');
  tokenizer.addToken('add', '\\+', 'addition');
  tokenizer.addToken('eqv', '\\=', 'comparison');
  tokenizer.addToken('less_eqv', '\\<=', 'comparison');
  tokenizer.addToken('more_eqv', '\\>=', 'comparison');
  tokenizer.addToken('less', '\\<', 'comparison');
  tokenizer.addToken('more', '\\>', 'comparison');
  
  return tokenizer;
}



/*


  ______                         _ _              
 |  ____|                       | (_)             
 | |__ ___  _ __ _ __ ___  _   _| |_ _______ _ __ 
 |  __/ _ \| '__| '_ ` _ \| | | | | |_  / _ \ '__|
 | | | (_) | |  | | | | | | |_| | | |/ /  __/ |   
 |_|  \___/|_|  |_| |_| |_|\__,_|_|_/___\___|_|   
                                                  
                                                  

*/

/*
  add functions
    * calculateNodes(row)
      parse data sintax: Col#
      * row
      get row of data: array ['Max', 500, true, '2017-02-28']
      * parser                  ^     ^     ^      ^
                               Col1  Col2  Col3   Col4
      
      calculateNodes → calculateNode(main_node, data)
    
    leads to more basic function:
    * calculateNode(node, row)
      
      node consists of three basic parts:
        * token1
        * token2
        * operation
        
      the aim is to get сonsistently:
        1. getArg1 = calculate token1
        2. getArg2 = calculate token2
        3. calculate operation(arg1, arg2)
        
    leads to more basic function:
    * getToken(token, row)
      token is object with variables:
      * data = tiken info to parse: 0, 'Col1'
      * name = type of token
      * klass = must be 'value' for this tokens
      
      Possible names and data vakues:
      ______________________________________________________________________
      data     | name      | class     | operation needed
      ---------|-----------|-----------|------------------------------------
      0        | int       | value     | return
      0.5      | float     | value     | return
      'foo'    | string    | value     | return
      Col3     | col       | value     | return row[3 - 1]
      0        | token     | value     | return calculateNodes(node[0], row)
      ----------------------------------------------------------------------
      Returning tokens make recursive function.
      It will end up when all tokens will be calculated
      The result will be just to the point.

*/
function Formulizer() {
  
  // add basic info
  var self = this;
  this.nodes = [];  
  this.add = function(token1, operation, token2) {
    var newToken = {
      token1: token1,
      operation: operation,
      token2: token2    
    };    
    this.nodes.push(newToken);
  }

  
  // calculate token
  function getToken(token, row) {
    // Logger.log(formulizer.nodes[0]['token2']['data']);  
    var data = token['data'];
    var name = token['name'];

/*

                 _______
               _/       \_
              / |       | \
             /  |__   __|  \
            |__/((o| |o))\__|
            |      | |      |
            |\     |_|     /|
            | \           / |
             \| /  ___  \ |/
              \ | / _ \ | /   -- Me want to know more...
               \_________/
                _|_____|_
           ____|_________|____
          /                   \  


*/

    switch(name) {
        case 'int':
            return data;
        case 'float':
            return data;          
        case 'string':
          return data.slice(1, data.length - 1);
        case 'col':
          var index = +data.replace('Col', '') - 1;
          return row[index];
        case 'token':
          var node = self.nodes[data];
          return getNode(node, row);
        default:
          return false;    
    }  
    
  }
  // for tests only
  this.returnTokenValue = function(token, row) {
    return getToken(token, row);
  }
  
  
  function getNode(node, row) {
    var token1 = node['token1'];
    var arg1 = getToken(token1, row);
    var token2 = node['token2'];
    var arg2 = getToken(token2, row);  
    
    var operation = node['operation']['name'];   
    switch(operation) {
    
/*
     \      oo
      \____|\mm
      //_//\ \_\
     /K-9/  \/_/
    /___/_____\
    -----------     
    
    
    -- More input!
                 ↓
                 ↓
                 ↓

*/
    
        case 'add':      
          return add(arg1, arg2);
        case 'mul':      
          return multiply(arg1, arg2);         
        case 'eqv':       
          return checkEqual(arg1, arg2);
        case 'less_eqv':     
          return checkLessEqual(arg1, arg2);
        case 'more_eqv':     
          return checkMoreEqual(arg1, arg2);       
        case 'more':      
          return checkMore(arg1, arg2);
        case 'less':     
          return checkLess(arg1, arg2);        
        default:       
          return undefined;    
    }    
  
  }

  // for tests only
  this.returnNodeValue = function(node, row) {
    return getNode(node, row);
  }
  
  // calculate Formulazer !!!
  this.calculate = function(row) {
    var index = self.nodes.length - 1;
    var lastNode = self.nodes[index];
    return getNode(lastNode, row)
  
  }
    
}


/*
  TODO
  
  Make code more flexible:
  to add new functions easier
  
  * Implement function like this:
  
  function getComparisonFunction(operator) {  
    switch(operator) { 
      case '>':  return checkMore;
      case '>=': return checkMoreEqual;
      case '<':  return checkLess;
      case '<=': return checkLessEqual;
      case '=':  return checkEqual;
      default: return checkEqual;
    }    
  }
  
  educate new functions in single place:
  
  make new function-object FUNCTIONATOR? to hold all function strings?
    
    Summary
    ________________________________________________________________________
    Count on fly                   | Count with function-object
    -------------------------------|----------------------------------------
    + use less memory              |   use extra memory to hold object
      take time to count cases     | + get funtion immediately from hash
      hard to add new functions    | + adding new functions in single place
    ------------------------------------------------------------------------
    I count on fly: use cases...
    
*/

/*

   _____                 _ _                  
  / ____|               | | |                 
 | (___  _ __ ___   __ _| | |                 
  \___ \| '_ ` _ \ / _` | | |                 
  ____) | | | | | | (_| | | |                 
 |_____/|_| |_| |_|\__,_|_|_|                 
 |  ____|              | | (_)                
 | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                              
                                                                                                                                                                                             
                                                                           
*/


/*

              .andAHHAbnn.
           .aAHHHAAUUAAHHHAn.
          dHP^~"        "~^THb.
    .   .AHF                YHA.   .
    |  .AHHb.              .dHHA.  |
    |  HHAUAAHAbn      adAHAAUAHA  |
    I  HF~"_____        ____ ]HHH  I
   HHI HAPK""~^YUHb  dAHHHHHHHHHH IHH
   HHI HHHD> .andHH  HHUUP^~YHHHH IHH
   YUI ]HHP     "~Y  P~"     THH[ IUP
    "  `HK                   ]HH'  "
        THAn.  .d.aAAn.b.  .dHHP
        ]HHHHAAUP" ~~ "YUAAHHHH[
        `HHP^~"  .annn.  "~^YHH'
         YHb    ~" "" "~    dHF
          "YAb..abdHHbndbndAP"
           THHAAb.  .adAHHF
            "UHHHHHHHHHHU"
              ]HHUUHHHHHH[
            .adHHb "HHHHHbn.
     ..andAAHHHHHHb.AHHHHHHHAAbnn..
.ndAAHHHHHHUUHHHHHHHHHHUP^~"~^YUHHHAAbn.
  "~^YUHHP"   "~^YUHHUP"        "^YUP^"
       ""         "~~"

-- ADD NEW FUNCTIONS


*/

// comparison
function checkMore(arg1, arg2) { return arg1 > arg2; }
function checkMoreEqual(arg1, arg2) { return arg1 >= arg2; }
function checkLess(arg1, arg2) { return arg1 < arg2; }
function checkLessEqual(arg1, arg2) { return arg1 <= arg2; }
function checkEqual(arg1, arg2) { return arg1 == arg2; }

// math
function add(arg1, arg2) { return +arg1 + arg2; }
function multiply(arg1, arg2) { return +arg1 * +arg2; }

/*
  _______    _              _              
 |__   __|  | |            (_)             
    | | ___ | | _____ _ __  _ _______ _ __ 
    | |/ _ \| |/ / _ \ '_ \| |_  / _ \ '__|
    | | (_) |   <  __/ | | | |/ /  __/ |   
    |_|\___/|_|\_\___|_| |_|_/___\___|_|   
                                           
                                           

*/

// http://stackoverflow.com/a/18472163/5372400

function Tokenizer() {
    this.tokens = {};
    // The regular expression which matches a token per group.
    this.regex = null;
    // Holds the names of the tokens. Index matches group. See buildExpression()
    this.tokenNames = [];
    this.tokenClasses = [];
}

Tokenizer.prototype = {
    addToken: function(name, expression, class) {
        this.tokens[name] = [expression, class];
    },

    tokenize: function(data) {
        this.buildExpression(data);
        var tokens = this.findTokens(data);
        return new TokenStream(tokens);
    },

    buildExpression: function (data) {
        var tokenRegex = [];
        for (var tokenName in this.tokens) {
            var class = this.tokens[tokenName][1];
            this.tokenClasses.push(class);
            this.tokenNames.push(tokenName);
            tokenRegex.push('('+this.tokens[tokenName][0]+')');
        }

        this.regex = new RegExp(tokenRegex.join('|'), 'g');
    },

    findTokens: function(data) {
        var tokens = [];
        var match;

        while ((match = this.regex.exec(data)) !== null) {
            if (match == undefined) {
                continue;
            }

            for (var group = 1; group < match.length; group++) {
                if (!match[group]) continue;

                tokens.push({
                    class: this.tokenClasses[group - 1],
                    name: this.tokenNames[group - 1],
                    data: match[group]
                });
            }
        }

        return tokens;
    }
}


TokenStream = function (tokens) {
    this.cursor = 0;
    this.tokens = tokens;
}
TokenStream.prototype = {
    next: function () {
        return this.tokens[this.cursor++];
    },
    peek: function (direction) {
        if (direction === undefined) {
            direction = 0;
        }

        return this.tokens[this.cursor + direction];
    }
}


function TESTtokenizer() {
var tokenizer = new Tokenizer();

// math

//tokenizer.addToken('whitespace', '\\s+');
//tokenizer.addToken('l_paren', '\\(');
//tokenizer.addToken('r_paren', '\\)');
//tokenizer.addToken('float', '[0-9]+\\.[0-9]+');
//tokenizer.addToken('int', '[0-9]+');
//tokenizer.addToken('div', '\\/');
//tokenizer.addToken('mul', '\\*');
//tokenizer.addToken('add', '\\+');
//tokenizer.addToken('constant', 'pi|PI');
//tokenizer.addToken('id', '[a-zA-Z_][a-zA-Z0-9_]*');
//var result = tokenizer.tokenize('(2 + 2)*2');


tokenizer.addToken('whitespace', '\\s+', 'whitespace');
tokenizer.addToken('l_paren', '\\(', 'l_paren');
tokenizer.addToken('r_paren', '\\)', 'r_paren');
tokenizer.addToken('float', '[0-9]+\\.[0-9]+', 'value');
tokenizer.addToken('col', 'Col[0-9]+', 'value');
tokenizer.addToken('int', '[0-9]+', 'value');
tokenizer.addToken('mul', '\\*', 'multiplication');
tokenizer.addToken('add', '\\+', 'addition');
tokenizer.addToken('id', '[a-zA-Z_][a-zA-Z0-9_]*', 'value');
tokenizer.addToken('eqv', '\\=', 'comparison');
tokenizer.addToken('more', '\\>', 'comparison');
//var result = tokenizer.tokenize("(Col3 = 'ok')*(Col2 > 500) + (Col1 = 'may')");
var result = tokenizer.tokenize("(a + b) * c").tokens;



//Logger.log(result);
Logger.log(result);
//Logger.log(result.peek(0));
//Logger.log(result.cursor);
//Logger.log(result.next());
//Logger.log(result.peek(1));
//Logger.log(result.tokens.length);
//Logger.log(tokenizer.tokenNames);

var trim = result.filter(function(token) { if (token.name != 'whitespace') return token; });

Logger.log(trim);

}
