//i have nothing i can put in while using vim but i need to put something.
const Mogrid = document.getElementById("movementGrid"); //shouldn't change
		var invals = []; //would declare a constant, but we need to be able to easily clear it at times.
		var start = "" //can be either a string or a number, but must contain 2 digits.
		var exit = "" //same as start
		var player = ""//same as start
		let wT = 9//number of columns of tiles
		let hT = 9//number of rows of tiles.
		const inventory = {

		}//might need to be cleared at times, but shouldn't need completely overhauled very often.
		const stats = {

		}//shouldn't need to be cleared
		function startGame(){
			makeGrid();
			mkNotPositions();
			mkSnEPoints()
		}
		function makeGrid(){
			let temp="";//
			let size = 100/wT;
			for(i=0;i<wT;i++){
				temp =  temp + size+"% ";
			}
			document.getElementById("movementGrid").style.gridTemplateColumns = temp;
			temp = "";
			size = 100/hT;
			for(i=0;i<hT;i++){
				temp = temp + size+"% ";
			}
			document.getElementById("movementGrid").style.gridTemplateRows = temp;
			for(i=1;i<=wT;i++){//row one already exists, no need to make the first row again
				for(t=1;t<=hT;t++){//'t' is columns, 'i' is rows
					Mogrid.innerHTML = Mogrid.innerHTML + ('<div id="'+t+","+i+'"></div>')
				}
			}
		}
		function mkNotPositions(){
			//gives an array of corrdinates, the corrdinates are corrdinates of which movement to should be inpossible.
			//corrdinate format is the same as the ids for the grid tiles.
			let maxInvals = 40; //max number of invalid tiles
			if(maxInvals>=hT*wT){//debuging edgecase; remove this later.
				maxInvals=2
			}
			invalPositions = [];//need to clear it.
			for(let i=0;i<maxInvals;i++){
				invals[i]=getCorrdInGrid();
			}
			let temp = new Set(invals);
			invals = Array.from(temp);//this little mess is for removing repeating corrdinates.
			console.log(invals)
			for(let i=0;i<invals.length;i++){
				document.getElementById(invals[i]).style.backgroundColor = "black";
			}
		}
		function getCorrdInGrid(){//gets you a string that is a corrdinate on the grid.
			let temp = Math.floor(Math.random()*wT)+1;
			let temp2 = Math.floor(Math.random()*hT)+1;
			return String(temp)+","+String(temp2);
		}
		function mkSnEPoints(){
			//first, make start
			while(true==true){//browsers might not like this
			let temp = getCorrdInGrid();
			if(CVM(temp)==true){
				start=temp;
				break;//this exits the while loop
			}
			}//while end
			document.getElementById(start).style.backgroundColor = "lightgreen";
			player=start;
			resetLocDisplay()
			//start point has been made	
			while(true==true){
				let temp=getCorrdInGrid();
				if(CVM(temp)){
					if(adjStart(temp)){//made this a function so its less difficult to read this part.
						exit=temp;
						break;
					}
				}
			}
			document.getElementById(exit).style.backgroundColor = "red";
		}
		function adjStart(corrd){//checks if corrd is adjecent to the start
			let attcorrd = corrd.split(",");//will need to be changed to accomadate for several digits.
			attcorrd[0]=Number(attcorrd[0]);
			attcorrd[1]=Number(attcorrd[1]);//need to make sure these are numebrs.
			for(let i=-1;i<=1;i++){
				for(let t=-1;t<=1;t++){
					let temp2 = [attcorrd[0]+i,attcorrd[1]+t];
					temp2=temp2[0]+","+temp2[1];
					if(temp2==start){
						return false;
					}
				}
			}
			return true;//is not adjecent
		}
		function CVM(corrd){//CVM: check valid move. checks if corrd is a string.
			if(typeof(corrd)!="string"){
				console.log("ERROR: parameter corrd is invalid type");
				return false;
			}
			for(i=0;i<invals.length;i++){
				//console.log("i= "+i+"; invals[i]= "+invals[i]+";corrd= "+corrd);
				if(invals[i]==corrd){
					return false;//move is invalid.
				}
			}
			let temp = corrd.split(",");
			if((temp[0]<1||temp[0]>wT)||(temp[1]<1||temp[1]>hT)){
				console.log("attempted location was too low or too high");
				return false;
			}
			return true;//move is valid.
		}
	function resetLocDisplay(){
		for(i=1;i<=wT;i++){//row one already exists, no need to make the first row again
				for(t=1;t<=hT;t++){//'t' is columns, 'i' is rows
					document.getElementById(i+","+t).innerHTML = "";
				}
			}
		document.getElementById(player).innerHTML = "X";
	}
	function keyPress(){
		key = window.event.keyCode;
		let hold = player;
		let temp = player.split(",");
		player = hold
		console.log(key);
		temp[0]=Number(temp[0]);
		temp[1]=Number(temp[1]);
		switch(key){
			case 40:
			temp[1]=temp[1]+1;
			break;
			case 39:
			temp[0]=temp[0]+1;
			break;
			case 38:
			temp[1]=temp[1]-1;
			break;
			case 37:
			temp[0]=temp[0]-1;
			break;
			case 32:
			interact()
			return;
			default:
			console.log("invalid input");
			return;
		}
		temp=temp.toString();
		if(CVM(temp)!=true){
			console.log("invalid movement.");
			return;
		}
		player=temp;
		resetLocDisplay();
	}

	function interact(){
			//have it check if the player's position is equal to some item or something on the field.
		if(player==exit){
			alert("you've found the exit.");
		}
	}
    let counter;
    var interv2;
    var interv;
    // function titleMessing(){
    //     document.getElementById("loadFAlert").style.display = "none";
    //     interv = setInterval(changeTitle,500);
    //     interv2 = setInterval(loadBar,70);
    // }
    function loadBar(){
        var eleW = document.getElementById("loadingBar").style;
        let Numr = parseInt(eleW.width);//notice: having to state ".width" every time is intentional
        //it also appears to be required, for some reason.
        if(Numr===100){
            console.log("clearInterv was called");
            clearInterval(interv2);
            clearInterval(interv);
            setInterval(function(){
                setTitleScreen();
            },500);
        } else if(Numr>100){
            eleW.width = "100%";
            loadBar();
        } else {
            Numr++;
            eleW.width = Numr +"%";
            console.log(eleW.width);
        }

    }
    function changeTitle(){
        let tabN = document.title;
        let loadNote = document.getElementById("loadCycle");//this assumes that these are synced
        if(tabN=="Loading."){
            document.title = "Loading..";
            loadNote.innerHTML = "Loading..";
        } else if(tabN=="Loading.."){
            loadNote.innerHTML = "Loading...";
            document.title = "Loading...";
        } else if(tabN=="Loading..."){
            loadNote.innerHTML = "Loading."
            document.title ="Loading.";
        }
    }//end loading Screen...
    //begin title screen
    function setTitleScreen(){
        document.getElementById("loadIt").style.display = "none";
        document.getElementById("titleScreen").style.display = "block";
        document.title = "prototype roguelike";
    }	
    function aNotice(){
        alert("saves aren't avaible yet.")
    }
    function openGame(){
        document.getElementById("titleScreen").style.display = none;
        document.getElementById("movementGrid").style.display = grid;
        startGame();
    }