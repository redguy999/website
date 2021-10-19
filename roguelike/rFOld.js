//begin file
const Mogrid = document.getElementById("movementGrid"); //shouldn't change
var invals = []; //would declare a constant, but we need to be able to easily clear it at times.
var start = "" //must be a string.
var exit = "" //same as start
var player = ""//same as start
let wT = 8//number of columns of tiles
let hT = 8//number of rows of tiles.
//!!NOTICE!! make sure that the total number of tiles are greater than 16
const inventory = {

}//might need to be cleared at times, but shouldn't need completely overhauled very often.
const stats = {

}//shouldn't need to be cleared
function startGame(){
    makeGrid();
    mkStart();
    mkNotPositions();
    mkEndPoint()
}
function mkStart(){
    start = "";
    let temp = Math.floor(Math.random()*(wT-2))+2;
    let temp2 = Math.floor(Math.random()*(hT-2))+2;//modified these so that it can't be place next to the edge.
    start = String(temp)+","+String(temp2);
    setBGColor(start,"lightgreen");
    player=start;
    resetLocDisplay()
}
function mkNotPositions(){
    //gives an array of corrdinates, the corrdinates are corrdinates of which movement to should be inpossible.
    //corrdinate format is the same as the ids for the grid tiles.
    let maxInvals = Math.floor(Math.random()*((wT*hT)))+3; //max number of invalid tiles
    invals = [];//need to clear it.
    for(let i=0;i<maxInvals;i++){
        invals[i]=getCorrdInGrid();
    }
    let temp = new Set(invals);
    invals = Array.from(temp);//this little mess is for removing repeating corrdinates.
    while(invals.length<=10){//adds more walls if theres too few walls.
        invals.push(getCorrdInGrid())//should add the item to the end of the list.
    }
    temp = 0;//already declared.
    for(let i=0;i<invals.length;i++){//check if it is impossible to move from the start. temp = 0 is a part of this.
        if((typeof(invals[i])!="string")||invals[i]==start){//if the item is empty or the same as the start, this will be true
            invals.splice(i,1)//the one is so that it only removes the invalid item
        }
        if(!cardAdjStart(invals[i])){//this check only sometimes works strangely.
            temp++;
            console.log(temp)
        }
        if(temp>=4){
            console.log("ERROR: start is completely blocked.");
            mkNotPositions();
            return;
        }
    }
    //console.log("final walls:")
    //console.log(invals)
    
    //check for pathfinding here.

    setBGColor(invals,"black")
}//end of making the walls.
function getCorrdInGrid(){//gets you a string that is a corrdinate on the grid.
    let temp = Math.floor(Math.random()*wT)+1;
    let temp2 = Math.floor(Math.random()*hT)+1;
    return String(temp)+","+String(temp2);
}

function mkEndPoint(){
    exit = "";	
    while(true==true){
        let temp=getCorrdInGrid();
        if(CVM(temp)){
            if(adjStart(temp)){//made this a function so its less difficult to read this part.
                //console.log("exit = " + temp);
                exit=temp;
                break;
            }
        }
    }
    setBGColor(exit,"red")
}
function cardAdjStart(corrd){
    //adjcent to start, but only the cardinal directions, doesn't check the start point itself.
    let attcorrd = corrd.split(",");
    attcorrd[0]=Number(attcorrd[0]);
    attcorrd[1]=Number(attcorrd[1]);//need to make sure these are numebrs.
    for(let i=-1;i<=1;i=i+2){
        for(let t=-1;t<=1;t=t+2){
            let temp = [attcorrd[0]+i,attcorrd[1]+t];
            temp=temp[0]+","+temp[1];
            if(temp==start){
                //console.log(false);
                return false;//is adjecent
            }
        }
    }
    return true;//not adjecent.
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
                return false;//is adjecent
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
function setBGColor(tiles,color){//sets background colors; color must be a string, tiles must be a string or an array.
    if(typeof(color)=="undefined"){
        color = "white"//i hope this works.
    }else if(typeof(color)!="string"){
        console.error("invalid input for parameter: color")
        return;
    }
    if(typeof(tiles)=="object"){//arrays are objects
        for(let i=0;i<tiles.length;i++){//assumes that all entries are strings.
            document.getElementById(tiles[i]).style.backgroundColor = color;
        }
    } else if(typeof(tiles)=="string"){
        document.getElementById(tiles).style.backgroundColor = color;
    } else {
        console.error("invalid input for parameter: tile(s)");
        return;
    }
}
//below is the stuff for actually making the character move and interact.
function keyPress(){
key = window.event.keyCode;
if(key==32){
    interact();
    return;//we don't need to do math on the location.
}
let temp = player.split(",");
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
    default:
    //some random key was pressed.
    return;
}
temp=temp.toString();
if(CVM(temp)!=true){
    //console.log("invalid movement.")
    return;//needs to return so player doesn't get inproperly set.
}
player=temp;
resetLocDisplay();
}

function interact(){
    //have it check if the player's position is equal to some item or something on the field.
if(player==exit){
    alert("you go down the stairs to the next floor.")
    nextLevel()
}
}
//functions that make the display look correct
function nextLevel(){
clearGrid();
//grid doesn't need remade
mkStart();
mkNotPositions();
mkEndPoint()
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
function clearGrid(){
setBGColor(invals);
//console.log("invals complete");
setBGColor(start);
setBGColor(exit);
//invals gets cleared when the walls are remade.
}
function resetLocDisplay(){
for(i=1;i<=wT;i++){//row one already exists, no need to make the first row again
        for(t=1;t<=hT;t++){//'t' is columns, 'i' is rows
            document.getElementById(i+","+t).innerHTML = "";
        }
    }
document.getElementById(player).innerHTML = "X";
}
//test variable
function checkIfPosible(){//credit to sirius for this.
//checks if the level is posible

var playerCoords = player.split(",")

var openSquaresX = [playerCoords[0]]
var openSquaresY = [playerCoords[1]]

for (i = 0; i < wT * hT; i++) {
for (j=0; j<openSquaresX.length; j++){
  //don't know the code for checking valid so is using a place holder: isValid()
  if (isValid(openSquaresX[j]+1, openSquaresY[j]+1)){
    openSquaresX.append(openSquaresX[j]+1);
    openSquaresY.append(openSquaresY[j]+1);
  }
  if (isValid(openSquaresX[j]+1, openSquaresY[j]-1)){
    openSquaresX.append(openSquaresX[j]+1);
    openSquaresY.append(openSquaresY[j]-1);
  }
  if (isValid(openSquaresX[j]-1, openSquaresY[j]+1)){
    openSquaresX.append(openSquaresX[j]-1);
    openSquaresY.append(openSquaresY[j]+1);
  }
  if (isValid(openSquaresX[j]-1, openSquaresY[j]-1)){
    openSquaresX.append(openSquaresX[j]-1);
    openSquaresY.append(openSquaresY[j]-1);
  }
  //place holder
  if (isExit(openSquaresX[j], openSquaresY[j])){
    return true
  }
}
}
return false; //is not posible
}