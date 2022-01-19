var sink = false;
var guesses = 0;
var hits = 0;
var guess;
var Vloc;
var Hloc;
var d;
function set(){
	guess = 0;
	sink = false;
	hits = 0;
	let temp = Math.floor(Math.random() * 5);
	d = Math.floor(Math.random() * 2);
	if(d==0){
		console.log("ship is vertical");
		Vloc = [temp, temp + 1, temp + 2];
		Hloc = Math.floor(Math.random() * 7);
	} else {
		console.log("ship is horizontal");
		Hloc = [temp, temp + 1, temp + 2];
		Vloc = Math.floor(Math.random() * 7);
	}
	console.log(Vloc);
	console.log(Hloc);
}
function sinkCheck(){
	let temp1 = 0;
	set();
	while(sink==false){
guess = prompt("Select your target! (format: #-#)");
	if(guess=="killGame"){//kill command, so that the game can end early
		alert("Notice: game has been cut short by admin user.");
		break;
	}
	guess = guess.split("-");
	for(let i=0; i < guess.length; i++){
		guess[i] = parseFloat(guess[i]);
	}
	console.log(guess);
	//guess is now set for the following checks
	if(guess[0]>6 || guess[1]>6){
		alert("invalid guess");
	} else {
	if(d==0){
	vCheck();
	} else {
	hCheck();
	}
	}

	}//end of loop
alert("you sunk my battleship!");
alert("It took " + guesses + " guesses to sink the battleship. ");
alert("Your accuracy was " + 3/guess);
}//end of sink check
function vCheck(){
	if(guess[1]==Hloc){
		for(let i=0; i<3; i++){
			if(guess[0]==Vloc[i]){
			i==5;
			hit();
			}
			if(i!=5 && i>3){
			miss();
			}
		}
	} else{
	miss();
	}
}
function hCheck(){
	if(guess[0]==Vloc){
		
	} else {
	miss();
	}
}
