const dGrid = document.getElementById("displayGrid")
const aGrid = document.getElementById("actionGrid")
const gridObj = {}//While this could be an array, the 0th index would mess everything up.
//might remove gridObj
const rows = 9// y corrdinate
const columns = 8// x cordinate
function mkGrid() {//!!VERY IMPORTANT
    aGrid.innerHTML = ""
    dGrid.innerHTML = ""//clears the grids, in case theres anything in them.
    let rowing = 100 / rows
    let coling = 100 / columns
    for (let y = 1; y <= rows; y++) {//creates all the divs.
        aGrid.style.gridTemplateRows += rowing + "% "
        dGrid.style.gridTemplateRows += rowing + "% "//also sets the grid templates correctly
        for (let x = 1; x <= columns; x++) {
            if (y == 1) {
                aGrid.style.gridTemplateColumns += coling + "% "
                dGrid.style.gridTemplateColumns += coling + "% "
            }
            dGrid.innerHTML += `<div id='d${x},${y}'></div>`
            aGrid.innerHTML += `<div id='${x},${y}'></div>`
        }
    }
    for (let i = 1; i <= columns; i++) {//the colums and rows have to be created in the reverse order, so we can't do this while making the divs.
        gridObj[i] = {}
    }
    for (x in gridObj) {//creates the rest of the javascript objects
        for (let i = 1; i <= rows; i++) {
            gridObj[x][i] = {
                "dis": document.getElementById(`d${x},${i}`),
                'act': document.getElementById(`${x},${i}`),
                'content': "",//should either be a string or an enemy object or an item object
                'loc': `${x},${i}`,//so that the corrdinate is easily accessible
            }
        }
    }
}
function getTile(cord) {//returns the JS object for a specifc tile.
    var Arr
    if (typeof (cord) == "string") {
        Arr = strToArr(cord)
    } else {
        Arr = cord
    }
    return gridObj[Arr[0]][Arr[1]]
}
//gridObject interface end

//start function
function start() {
    mkGrid()
    mkWalls()
    placeStart()
    mkEnd()
}

//functions that put stuff on the grid (start)
function mkWalls() {
    var walls = []
    for (let i = 0; i < getIntegerInRange(rows*columns,1); i++) {
        walls.push(getRandomCord())
    }
    walls.forEach(function(cordin){
        getTile(cordin).content="Wall"
        setBGColor(cordin,"black")
    })
}

function placeStart(){//makes the start tile and places the player on it.
    var startTile
    do{
        startTile=getRandomCord()
    }
    while(getTile(startTile).content)//this is true if there is something in the tile.
    setBGColor(startTile,"LightGreen")
    setPlayerLoc(startTile,playerLoc)//playerLoc is only important when going to the next level.
}
function mkEnd(){//makes the exit tile.
    var exitTile
    do{
        exitTile=getRandomCord()
    }
    while(getTile(exitTile).content)//this is true if there is something in the tile.
    setBGColor(exitTile,"red")
}
function setBGColor(tiles, color) {//sets the background color of a tile
    //color must be a string, tiles must be a string or an array of cordinate strings.
    if (typeof (color) == "undefined") {//default to white
        color = "white"
    } else if (typeof (color) != "string") {
        throw "invalid input for parameter: color";
        return;
    }
    if (typeof (tiles) == "object") {//arrays are objects
        for (let tile of tiles) {//assumes that all entries are strings.
            getTile(tile).dis.style.backgroundColor = color
        }
    } else if (typeof (tiles) == "string") {
        getTile(tiles).dis.style.backgroundColor = color
    } else {
        throw "invalid input for parameter: tile(s)";
        return;
    }
}
//functions that put stuff on the grid (end)

//random functions start
function getIntegerInRange(max, min = 0) {//returns an integer between max & min (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomCord(){
    let X = getIntegerInRange(columns,1)
    let Y = getIntegerInRange(rows,1);
    return `${X},${Y}`
}
//random functions end

//cordinate conversion start
function strToArr(cord) {//turns a cordinate string into an array.
    return cord.split(",")
}
function arrToStr(cord) {//turns a cordinate string into an array.
    return cord.join()
}
//cordinate conversion end

//player stuff start
function setPlayerLoc(newTile,old){//sets the player icon to the correct location
    //old is an optional argument, but both must be strings if given.
    if(old){//true if something is given for old
        let oldLoc = getTile(old)
        oldLoc.act.innerHTML=""
        oldLoc.content = ""
       }
    let newLoc = getTile(newTile)
    newLoc.act.innerHTML="X"
    newLoc.content = "Player"//Not sure if this is needed this.
    playerLoc=newTile
}
var playerLoc = "1,1"
const playerStats = {

}
const inventory = {

}
//player stuff end
//movement functions start
function isTileEmpty(cord){//returns true if the tile is empty.
    if(getTile(cord).content){
        return false
    }
    return true
}
function doesTileExist(cord){//returns false if the tile does not exist/is out of bounds
    //cord can either be a string or a cordinate array.
    var tile = cord
    if(typeof(cord)!="object"){
        tile = cord.split(",")
    }
    if(tile[0]>columns || tile[1]>rows || tile[0]<1 || tile[1]<1){
        return false;
    }
    return true;
}
function keyPress(){
    key = window.event.keyCode;
    if (key == 32) {//32 is the space bar
        interact();
        return;//we don't need to do math on the location.
    }
    var newTile=moveByKey(key,playerLoc)
    if(!doesTileExist(newTile)){
        return//can't move to a nonexistant tile.
    }
    if(!isTileEmpty(newTile)){//an error will accord if the 2 if statements are combined.
        //TODO: check if the the newTile has an enemy, attack if if it does.
        return //Even if we attack an enemy, we don't move.
    }
    setPlayerLoc(newTile,playerLoc)
}
function moveByKey(code,tile){
    let temp;//incase the result becomes invalid, we need to be able to return the original value.
    if (typeof (tile) == "string") {
        temp = tile.split(",");
    } else if (typeof (tile) != "object") {//this else if is mostly for debugging purposes.
        throw "invalid parameter for Corrd.";
        return null;//invalid input.
    } else {//neither "if" will be true if corrd is a string or an array.
        temp = tile;
    }
    switch (code) {//!!DO NOT EDIT, THIS WORKS CORRECTLY; copying the equations is recommended, however.
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
            return tile.toString();//return orginial corrdinate
        //just have it return corrd so it doesn't break.
    }
    return temp.toString();;//returns corrdinate as string
}
//movement functions end