%{
	/* Note for future hackers */
	/* Jison by default gets the first matched item, working top down
	 * This is NOT the same as lex, which matches longest
	 * Adding the %option flex to the file will make jison work like lex
	 * but, this is not heavily tested
	 *
	 * The safest thing to do is have more important rules before less
	 * important rules, which is why . is last
	 */
%}
int  "-"?([0-9]|[1-9][0-9]+)
exp  [eE][-+]?[0-9]+
frac  "."[0-9]+

%x json singleQuoteString dblQuoteString
%flex
%%

[^{,][^,]+      return 'LITERAL';
"{"        {
	saver.currText = "{";
	this.begin('json');
}
"," {
	// do nothing we don't want commas
}
<<EOF>>    return 'EOF';

<json>"}"  {
	saver.currText = saver.currText + yytext;
	if (saver.braceCount == 0) {
		yytext = saver.currText;
		saver.currText = "";
		this.popState();
		return 'JSON';
	}
	else {
		saver.braceCount -= 1;
	}
}
<json>"{" {
	saver.currText = saver.currText + yytext;
	saver.braceCount += 1;
}
<json><<EOF>> {
		yytext = saver.currText;
		saver.currText = "";
		this.popState();
		return 'EOF';
}
<json>\s+  { saver.currText = saver.currText + yytext; }
<json>"'"  { saver.currText = saver.currText + yytext; this.begin('singleQuoteString'); }
<json>\"   { saver.currText = saver.currText + yytext; this.begin('dblQuoteString'); }
<json>"//" { this.begin('singleLineComment'); }
<json>"/*" { this.begin('multiLineComment'); }
<json>.    { saver.currText = saver.currText + yytext; }

<singleQuoteString>"\'"  { saver.currText = saver.currText + yytext; }
<singleQuoteString>"'"  { saver.currText = saver.currText + yytext; this.popState(); }
<singleQuoteString>.  { saver.currText = saver.currText + yytext; }

<dblQuoteString>"\\\""  { saver.currText = saver.currText + yytext; }
<dblQuoteString>\"  { saver.currText = saver.currText + yytext; this.popState(); }
<dblQuoteString>.  { saver.currText = saver.currText + yytext; }

%%

var saver = { currText: "", braceCount:0 }
