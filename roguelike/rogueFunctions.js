//begin code for the grid and such.
const Mogrid = document.getElementById("movementGrid"); //shouldn't change
let hT = 9//number of columns of tiles, AKA the max x value.
let wT = 10	//number of rows of tiles, AKA the max y value.
var startPoint = "1,1"
var exitPoint = "2,2"
var cordsAdjStart = [];//array of strings.
var walls = [];
var level = 1;//not player level.
/*
debugger;
//this pauses the website in chrome when "pause on exceptions is active." which can be set in the sources tab.
movement reference:
original point: X,Y
moving up: X,Y-1
moving down: X,Y+1
moving left: X-1,Y
moving right: X+1,Y
//corrdinate as a string "X,Y"; a corrdinate as an array ["X","Y"], array items can be either string or number
//see function keyPress() for how movement works.
corrdinates test:
    for(let i=0;i<10;i++){let temp = getCorrdInGrid();console.log(temp);setBGColor(temp,"blue");}
*/
function startGame() {//start, end, finally walls.
    Mogrid.innerHTML="";//empty the grid, in case theres stuff in there already.
    seteveryItem();
    makeGrid();
    mkStartPoint();
    mkExitPoint();
    //getRows();//run this here.
    mkWalls();
    displayEquipment();//need to run it here so it displays the console correctly
    if (!oldPather()) {
        nextLevel();//exit unreachable, rerolling.
        return;
    }			//addCorrdinates();for grid debugging
    try{
        mkOtherStuff();
    } finally{
        //proceed if it doesn't work.
    }
}
function nextLevel() {//this may be called for reasons other than that the level was completed, so put the level counter in interact.
    clearGrid();
    if(sLevels.indexOf(level)!=-1){//might rework this, but all we need to check is if the level counter is equal to a level we're trying to force a layout for.
        scriptedFloor()
        return;
    }//so that it doesn't random place over our set placement.
    mkStartPoint();
    if(level==1){
        seteveryItem();
    }else{
        updateConstructors();
    }
    //drawVisCircle();
    mkExitPoint();
    mkWalls();
    if (!oldPather()) {
        nextLevel();//exit unreachable, rerolling.
        return;
    }
    try{
        mkOtherStuff();
    } finally{
        //proceed if it doesn't work.
    }
}
function clearGrid() {
    for (y = 1; y <= wT; y++) {
        for (x = 1; x <= hT; x++) {
            setBGColor(x + "," + y);
        }
    }
}
function makeGrid() {//DO NOT TOUCH THIS FUNCTION, OR YOU MIGHT BREAK EVERYTHING.
    let temp = "";//
    let size = 100 / wT;
    for (i = 0; i < wT; i++) {
        temp += size + "% ";//this and the next one is so that none of the tiles change size when the X moves to it.
    }
    document.getElementById("movementGrid").style.gridTemplateRows = temp;
    temp = "";
    size = 100 / hT;
    for (i = 0; i < hT; i++) {
        temp = temp + size + "% ";
    }
    document.getElementById("movementGrid").style.gridTemplateColumns = temp;
    for (y = 1; y <= wT; y++) {
        for (x = 1; x <= hT; x++) {
            Mogrid.innerHTML = Mogrid.innerHTML + ('<div id="' + x + "," + y + '"></div>');
        }
    }
}
/*to loop through every tiles, copy the nested for loops below:
    for(y=1;y<=wT;y++){
        for(x=1;x<=hT;x++){

        }
    }
(x,y)*/
function addCorrdinates() {//was used for debugging, currently useless.
    for (y = 1; y <= wT; y++) {
        for (x = 1; x <= hT; x++) {
            document.getElementById(x + "," + y).innerHTML = "(" + x + "," + y + ")";
        }
    }
}//for making stuff appear on the grid.
function mkStartPoint() {// makes enterance
    startPoint = getCorrdInGrid();
    playerLoc = startPoint;
    resetLocDisplay();
    setBGColor(startPoint, "lightGreen");
    //below paints the points cardinally adjecent to the start, just for testing.
    cordsAdjStart = cardAdj(startPoint);
}
function mkExitPoint() {//makes exit
    let temp = getCorrdInGrid();
    while (temp == startPoint||cordsAdjStart.indexOf(temp)!=-1) {//so that the exit isn't near the start.
        temp = getCorrdInGrid();
    }
    exitPoint = temp;
    setBGColor(exitPoint, "red");
}
function mkWalls() {
    walls = [];
    for (i = 0; i < Math.floor(Math.random()*(wT*hT))+10; i++) {
        walls.push(getCorrdInGrid());
    }
    walls = Array.from(new Set(walls));//removes repeated entries
    while (walls.length <= 20) {//adds more walls if theres too few walls.
        walls.push(getCorrdInGrid())//should add the item to the end of the list.
    }
    //debugger;
    let temp = walls.indexOf(startPoint)//is there a wall cordinate that is the same as the startPoint?
    if(temp!=-1){//if there isn't, temp will be -1
        walls.splice(temp,1);//if there is, remove it.
    }
    temp = walls.indexOf(exitPoint)
    if(temp!=-1){
        walls.splice(temp,1)
    }
    setBGColor(walls, "black")
}
function getCorrdInGrid() {//gets you a string that is a corrdinate on the grid.
    let temp = Math.floor(Math.random() * hT) + 1;
    let temp2 = Math.floor(Math.random() * wT) + 1;
    return String(temp) + "," + String(temp2);
}
function clearLocDisplay(){
    for (y = 1; y <= wT; y++) {
        for (x = 1; x <= hT; x++) {
            document.getElementById(x + "," + y).innerHTML = "";
        }
    }
}
function resetLocDisplay() {
    //drawVisCircle();
    clearLocDisplay()
    document.getElementById(playerLoc).innerHTML = "X";
}
function setBGColor(tiles, color) {//sets background colors; color must be a string, tiles must be a string or an array.
    if (tiles == null) {//early exit in case something goes wrong. was likely only possible because of debugging.
        return;
    }
    if (typeof (color) == "undefined") {
        color = "white"//i hope this works.
    } else if (typeof (color) != "string") {
        throw "invalid input for parameter: color";
        return;
    }
    if (typeof (tiles) == "object") {//arrays are objects
        for (let i = 0; i < tiles.length; i++) {//assumes that all entries are strings.
            document.getElementById(tiles[i]).style.backgroundColor = color;
        }
    } else if (typeof (tiles) == "string") {
        document.getElementById(tiles).style.backgroundColor = color;
    } else {
        throw "invalid input for parameter: tile(s)";
        return;
    }
}
function setBrColor(tiles, color) {//sets border colors, not used.
    if (tiles == null) {//early exit in case something goes wrong. was likely only possible because of debugging.
        return;
    }
    if (typeof (color) == "undefined") {
        color = "white"//i hope this works.
    } else if (typeof (color) != "string") {
        throw "invalid input for parameter: color";
        return;
    }
    if (typeof (tiles) == "object") {//arrays are objects
        for (let i = 0; i < tiles.length; i++) {//assumes that all entries are strings.
            document.getElementById(tiles[i]).style.borderColor = color;
        }
    } else if (typeof (tiles) == "string") {
        document.getElementById(tiles).style.borderColor = color;
    } else {
        throw "invalid input for parameter: tile(s)";
        return;
    }
}
function CVM(corrdin) {//check valid move
    for (let i = 0; i < walls.length; i++) {
        if (walls[i] == corrdin) {
            return true;//invalid move
        }
    }
    if (!checkOoB(corrdin)) {//not sure why i made it a function but it works.
        return true;//invalid move
    }
    return false;//failed to find a valid reason that the move would be invalid.
}
function checkOoB(corrd) {//check Out of Bounds
    let temp = corrd.split(",")
    if (temp[0] < 1 || temp[1] < 1 || temp[0] > hT || temp[1] > wT) {//i had accidentally flipped the max x and max y value, it has now been fixed.
        return false;//outside grid
    }
    return true;//inside grid.
}
function cardAdj(corra) {//gets corrdinates that are cardinally adjecent to a given point.
    let temp = [];
    //debugger;//something here isn't working, for some reason.
    for (let i = 37; i <= 40; i++) {//use this for state to get all corrdinates cardinally adjecent to a point.
        temp.push(switchMovement(corra, i));
        //console.log(temp);
    }
    return temp;//returns array
}
//for the player
var playerLoc = "1,1"//might move this to the player object, but it works here.
function keyPress() {
    key = window.event.keyCode;
    if (key == 32) {
        interact();
        return;//we don't need to do math on the location.
    }
    let temp = switchMovement(playerLoc, key);
    if (CVM(temp)) {
        return;//can't move to that tile
    }
    try{
        for(let i=0;i<eList.length;i++){
            if(eList[i]["location"]==temp){
                eList[i].hurt(player.attack);
                return;//we don't move onto the tile when we attack.
            }
        }
    } catch{
        console.error("check if moving onto enemy failed.");
    }
    playerLoc = temp;
    resetLocDisplay()
}
function interact(){
    if(playerLoc==exitPoint){//if player is on the exit.
        TtC("You found the exit.");
        if(level%10==0){//i believe this should work.
            openShop()
        } else {
            level++;
            nextLevel();
        }
        return;
    }else if(entLocs.indexOf(playerLoc)!=-1){//player is on a tile that is shared by either an enemy or item
        collectOrCombat();
    }
}
function switchMovement(Corrd, key) {//movement function, returns a string
    let temp;//incase the result becomes invalid, we need to return the orginial input.
    if (typeof (Corrd) == "string") {
        temp = Corrd.split(",");
    } else if (typeof (Corrd) != "object") {//this else if is mostly for debugging purposes.
        throw "invalid parameter for Corrd.";
        return null;//invalid input.
    } else {//neither "if" will be true if corrd is a string or an array.
        temp = Corrd;
    }
    switch (key) {//!!DO NOT EDIT, THIS WORKS CORRECTLY; copying the equations is recommended, however.
        case 40:
            temp[1] = Number(temp[1]) + 1;//down
            break;
        case 39://the Number() in the first 2 cases is so that 1+1!=11
            temp[0] = Number(temp[0]) + 1;//right
            break;
        case 38:
            temp[1] = temp[1] - 1;//up
            break;
        case 37://javascript can only do subtraction with numbers, so it will auto cor
            temp[0] = temp[0] - 1;//left
            break;
        default:
            //invalid input for key
            return Corrd.toString();//return orginial corrdinate
        //just have it return corrd so it doesn't break.
    }
    return temp.toString();;//returns corrdinate as string
}
//debugger;//something here isn't working, for some reason.
function oldPather() {//DO NOT TOUCH, i forgot how this works but it seems to work.
    //console.log("pather begins")
    var Reached = false;
    let newCorrds = [];//must be blank.
    var checkCorrds = [startPoint];//start is always valid, since it is the beginning corrdinate.
    const validCorrds = new Set();
    for (let i = 0; i < wT * hT / 2; i++) {
        if (typeof (checkCorrds[0]) == "undefined") {//first entry doesn't exist meaning the array is empty
            break;//no more valid moves, since all possible tiles reachable from the start have been checked for the exit
        }
        for (let t = 0; t < checkCorrds.length; t++) {
            let tempCorrd = checkCorrds[t];
            for (let i = 37; i <= 40; i++) {//use this for state to get all corrdinates cardinally adjecent to a point.
                let holdT = switchMovement(tempCorrd, i);//this is kinda bad but it works.
                if(CVM(holdT)){
                    continue;//move invalid.
                } else {
                    newCorrds.push(holdT);
                }
            }
        }//end of checkcorrds.length for loop
        for (let i = 0; i < newCorrds.length; i++) {
            if (newCorrds[i] == exitPoint) {//if one of the newCorrds is on the exitPoint, then the exit is reachable.
                Reached=true;//exit is reachable from start
            }
        }
        for (let i = 0; i < checkCorrds.length; i++) {//adds all of checkCorrds to valid corrdinates
            validCorrds.add(checkCorrds[i]);//adds them to valid corrdinates	
        }
        checkCorrds = [];//empties checkCorrds
        checkCorrds = Array.from(new Set(newCorrds));//removes duplicates, makes check corrds = new Corrds
        newCorrds = [];//clear it so it doesn't get really big.
        for (let i = 0; i < validCorrds.size; i++) {//so that we don't get duplicate corrds, might be more trouble then its worth, however.
            let temp = checkCorrds.indexOf(validCorrds[i]);
            if (temp != -1) {//if the indexOf function = -1, it couldn't find the input in the array.
                checkCorrds.splice(temp, 1);
            }
        }//this for loop removes any corrds that were already checked.
    }//if it can't find the end point by the end of this, the end point is unreachable.
    if(Reached){//if reached is true, AKA, the end can be reached.
        let allCorrds = [];
        for(y=1;y<=wT;y++){
            for(x=1;x<=hT;x++){
                allCorrds.push(x+","+y);
            }
        }
        for(x of walls){//x = a value in walls not an index of the values.
            allCorrds.splice(allCorrds.indexOf(x),1)//indexOf will always be true since walls is a subset of allCorrds
        }
        for(x of validCorrds){//for in doesn't work with a set, it seems.
            allCorrds.splice(allCorrds.indexOf(x),1)//removes a found space from allCorrds
        }
        for(x of allCorrds){
            walls.push(x);
            setBGColor(x,"black");
        }
    }
    return Reached;
}