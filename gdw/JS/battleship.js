var sink = false;
var guesses = 0;
var hits = 0;
var guess;
var loc = [3,4,5];
function set(){
	guess = 0;
	sink = false;
	hits = 0;
	let temp = Math.floor(Math.random() * 5);
	loc = [temp, temp + 1, temp + 2];
	console.log(loc);
}
function sinkCheck(){
	set();
	while(sink==false){
guess = prompt("Select your target! (enter a number from 0-6)");
	if(guess=="killGame"){
		alert("Notice: game has been cut short by admin user.");
		break;
	}
	guess = parseFloat(guess);
	if(guess < 0 || guess > 6){//vaildity check
	alert("That guess is invaild");
	//go to start of loop
	} else {
	guesses = guesses + 1;
		for(let i = 0; i < loc.length; i++){
		if(loc[i]==guess){//location check
			hits = hits + 1;
			alert("hit.");
			i = 5;
		} else if(i==2){
			alert("miss.");
		}
		}
		if(hits==3){
			sink = true;
		}
		}//end of else
	}//end of loop
alert("you sunk my battleship!");
alert("It took " + guesses + " guesses to sink the battleship. ");
alert("Your accuracy was " + 3/guess);
}//end of sink check
