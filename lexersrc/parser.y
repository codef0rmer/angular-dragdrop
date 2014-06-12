%start parsedargs

%{

%}

%%

parsedargs
	: EOF 
	{
		$$ = [undefined];
		return $$
	}
	| arguments EOF
		{ 
			$$ = $1;
			return $$; 
		}
	;
arguments
	: stringarg
		{ 
			$$ = [$1]; 
		}
	| JSON 
		{
			$$ = [$1];
		}
	| arguments stringarg
		{ 
			$1.push($2);
			$$ = $1;
		}
	| arguments JSON
		{
			$1.push($2)
			$$ = $1;
		}
	;

stringarg
	: LITERAL
		{ 
			$$ = $1; 
		}
	| LITERAL stringarg
		{ 
			$$ = $1 + $2; 
		}
	;

%%
