These files generate the Parser.js found in the main source of this repo. The parser was generated using a tool called jison which can be found <a href="https://github.com/zaach/jison">here<a>.  Currently the primary purpose of the parser is to add the ability to parse json arguments to the drag and drop callbacks.

##Changing the parser.

If you need to make changes to the parser you can update the parser.lex and the parser.y files then use jison to generate the Parser.js file.The command should look like this: 

node_modules/.bin/jison lexersrc/parser.y lexersrc/parser.lex --outfile src/Parser.js

This will generate a javascript parsing engine in the src/Parser.js file, based on your two grammar files. 

