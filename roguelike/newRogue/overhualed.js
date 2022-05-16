
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
    displayFloor()
    displayStats();
    mkGrid();
    nextLevel();
}
//next Level function
function nextLevel(){
    clearGrid()
    mkWalls()
    placeStart()
    mkEnd()
    if(!pathFinder()){//pathFinder returns true if it found the exit.
        console.log("exit cannot be reached, rerolling...")
        nextLevel()
        return;
    }
    placeTreasure()
}

//grid functions (start)
function mkWalls() {
    var walls = []
    for (let i = 0; i < getIntegerInRange(rows*columns,20); i++) {
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
var endTile = "2,2"//literally only need this for the pathfinder
function mkEnd(){//makes the exit tile.
    var exitTile
    do{
        exitTile=getRandomCord()
    }
    while(getTile(exitTile).content || exitTile==playerLoc)//this is true if there is something in the tile.
    endTile=exitTile
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
function clearGrid(){
    for(x in gridObj){
        for(y in gridObj[x]){
            setBGColor(`${x},${y}`)
            getTile(`${x},${y}`).content = ""
        }
    }
}
//grid functions     (end)

//random functions start
function getIntegerInRange(max, min = 0) {//returns an integer between max & min (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomCord(){
    let X = getIntegerInRange(columns,1)
    let Y = getIntegerInRange(rows,1);
    return `${X},${Y}`
}
function getRandomTile(){
    return getTile(getRandomCord())
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
        //oldLoc.content = ""
       }
    let newLoc = getTile(newTile)
    newLoc.act.innerHTML="X"
    //newLoc.content = "Player"//Causes items to fail.
    playerLoc=newTile
}
var playerLoc = "1,1"
const playerStats={
    maxHealth:100,
    health:100,
    attack:1,
    defense:0
}
function displayStats(){
    for(stat in playerStats){
        document.getElementById(stat).innerHTML=playerStats[stat];
    }
}
const inventory = {

}
function addItemToInventory(item,amount=1){//for when adding an item to the inventory
    if(!inventory[item]){//true if the item is not in the inventory, or if there are zero of the item.
        //In either case, its fine.
        inventory[item]=amount;
    } else {
        inventory[item]+=amount;
    }
    updateInventoryDisplay()
}
function sanitizeInventory(){
    for(item in inventory){
        if(!inventory[item]){//if item value is undefined, zero, or NaN, this is true.
            delete inventory[item];//remove invalid values.
        }
        //do nothing if the item's value is valid
    }
    updateInventoryDisplay()
}
function reduceAmountOfItem(item,amount){//call this for when removing an amount of an item.
    //amount should be positive.
    inventory[item]-=amount;
    if(!inventory[item] ||inventory[item]<0){//remove item if it is invalid or zero.
        delete inventory[item];
    }
    updateInventoryDisplay()
}
const inventoryDisplay=document.getElementById("inventoryDisplay")
function updateInventoryDisplay(){
    inventoryDisplay.innerHTML=""//clear it.
    for(item in inventory){
        if(inventory[item]>1){//plurals
            inventoryDisplay.innerHTML+= `<div>${inventory[item]} ${item}s</div>`;
        } else {
            inventoryDisplay.innerHTML+= `<div>${inventory[item]} ${item}</div>`;
        }
    }
}
var floor = 1
function displayFloor(){
    document.getElementById("floorDisplay").innerHTML=floor
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
    if(newTile==playerLoc){//true if player didn't move
        return
    }
    if(!doesTileExist(newTile)){
        return//can't move to a nonexistant tile.
    }
    if(!isTileEmpty(newTile)){//an error will accord if the 2 if statements are combined.
        //TODO: check if the the newTile has an enemy, attack if if it does.
        if(getTile(newTile).content.amount){//true if the tile contains an item.
            setPlayerLoc(newTile,playerLoc)
        }
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
        case 37://javascript can only do subtraction with numbers
            temp[0] = temp[0] - 1;//left
            break;
        default:
            //invalid input for key
            return tile.toString();//return orginial corrdinate
        //just have it return corrd so it doesn't break.
    }
    return temp.toString();;//returns corrdinate as string
}
function interact(){
    var playertile=getTile(playerLoc)
    if(playertile.dis.style.backgroundColor=="red"){
        floor++
        displayFloor()
        nextLevel()
    } else if(playertile.content.amount){//true if there is an item there.
        openChest(playertile.loc)
    }
}
//movement functions end

//treasure functions start
class chest{
    constructor(content,amount){
        //the chest is placed into the gribObj, so we don't need to have it track its location.
        this.content=content;
        this.amount=amount;
        this.getItem = function(){
            //insert code for telling the player what they got here.
            addItemToInventory(this.content,this.amount)
        }
    }
}

const findableItems={
    sword:1,//number is the max amount that can be found.
    shield:1,//TODO: add rarity back.
    "chest plate":1,
    spear:2
}
function openChest(cord){//cord is a cordinate.
    setBGColor(cord)
    let tile=getTile(cord)
    tile.content.getItem()
    tile.content=""
}
function placeTreasure(){
    var num = getIntegerInRange(3)
    for(let i=0;i<num;i++){
        var tile
        do{
            tile=getRandomTile()
        }
        while(tile.content||tile.loc==playerLoc||tile.dis.style.backgroundColor=="red")//true if the tile contains something already.
        //latter statement is so that we don't place an item on the exit.
        let item = getFindableItem()
        let amount = getIntegerInRange(findableItems[item],1)
        tile.content = new chest(item,amount)
        setBGColor(tile.loc,"yellow")
    }
}
function getFindableItem(){
    let items= Object.keys(findableItems)
    let amount = items.length
    return items[getIntegerInRange(amount-1)]
}
//treasure functions end.

//Enemy functions start

//Enemy functions end

//pathFinder function (so that we know we can reach the exit.)
function pathFinder(){//this works.
    //TODO: make it make unreachable tiles turn into walls; make the end have to be a certain distance away from the start.
    /*
    how this is suppose to work: all cordinates in "oldValidTiles" are checked, and every new valid Tile found after
    that is given to "newValidTiles", once all tiles in "oldValidTiles" are checked, all entries in "oldValidTiles"
    are moved to "allValidTiles" and all tiles in "newValidTiles" are moved to "oldValidTiles"
    if a tile in "newValidTiles" is also in "allValidTiles", remove it from the array.
    */
    var allValidTiles= new Set()
    var oldValidTiles= new Set()
    oldValidTiles.add(playerLoc)
    var newValidTiles = new Set()
    const moves = [37,38,39,40]
    while(true){
        var tileHold = new Set()
        if(oldValidTiles.size===0){//no new tiles to check
            break
        }
        
        for(space of oldValidTiles){
            for(offset of moves){
                tileHold.add(moveByKey(offset,space))
            }
        }//Gets new tiles
        newValidTiles = tileHold
        newValidTiles.forEach(function(cord){
            if(!doesTileExist(cord)||!isTileEmpty(cord)||allValidTiles.has(cord)){
                //the has statement is true if that tile has already been checked.
                newValidTiles.delete(cord)
            }
        })//remove invalid tiles.
        if(newValidTiles.has(endTile)){
            return true;
        }//check if we have reached the exit.
        oldValidTiles.forEach(function(oldCord){
            allValidTiles.add(oldCord)
        })
        oldValidTiles= new Set()
        newValidTiles.forEach(function(cord){
            oldValidTiles.add(cord)
        })
    }
    if(allValidTiles.has(endTile)){
        return true;
    }//double check if we have reached the exit.
    return false
}