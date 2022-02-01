const dGrid=document.getElementById("displayGrid")
const aGrid=document.getElementById("actionGrid")
const gridObj={}//While this could be an array, the 0th index would mess everything up.
//might remove gridObj
const rows=9
const columns=8
var playerLoc="1,1"
start()
function start(){
    mkGrid();
    mkWalls();
    setStart();
    setExit();
    resetLocDisplay()
}
function nextLevel(){
    clearGrid()
    mkWalls();
    setStart();
    setExit();
    resetLocDisplay();
}
function clearGrid(){
    for(let x in gridObj){
        for(let y in gridObj[x]){
            gridObj[x][y].dis.style.backgroundColor="";//clears the background color
            gridObj[x][y].content=""
            //act isn't really used by the code currently.
            //loc is effectively a constant, setting it WILL break the code.
        }
    }
}
function mkGrid(){//!!VERY IMPORTANT
    aGrid.innerHTML=""
    dGrid.innerHTML=""//clears the grids, in case theres anything in them.
    let rowing = 100/rows
    let coling = 100/columns
    for(let y=1;y<=rows;y++){//creates all the divs.
        aGrid.style.gridTemplateRows+=rowing+"% "
        dGrid.style.gridTemplateRows+=rowing+"% "//also sets the grid templates correctly
        for(let x=1;x<=columns;x++){
            if(y==1){
                aGrid.style.gridTemplateColumns+=coling+"% "
                dGrid.style.gridTemplateColumns+=coling+"% "
            }
            dGrid.innerHTML+="<div id='d"+x+","+y+"'></div>"
            aGrid.innerHTML+="<div id='"+x+","+y+"'></div>"
        }
    }
    for(let i=1;i<=columns;i++){//the colums and rows have to be created in the reverse order, so we can't do this while making the divs.
        gridObj[i]={}
    }
    for(x in gridObj){
        for(let i=1;i<=rows;i++){
            gridObj[x][i]={
                "dis":document.getElementById("d"+x+","+i),
                'act':document.getElementById(x+","+i),
                'content':"",//should either be a string or an enemy object or an item object
                'loc':x+","+i,//so that the corrdinate is easily accessible
            }
        }
    }
}
function setStart(){
    do{
        var href=getCorrdHref(ranArrCorrd())
    }while(href.content)//causes the do statement to repeat if the tile has something on it already.
    href.dis.style.backgroundColor="green";
    playerLoc=href.loc;
}
function setExit(){
do{
    var href = getCorrdHref(ranArrCorrd())
}while(href.dis.style.backgroundColor||cardAdj(playerLoc).indexOf(href.loc)!=-1)//TODO: get rid of the latter part of this and have the pathfinder make sure they aren't too close.
//href.dis.style will be false if nothing is there, which should accord if the background color isn't set.
//playerLoc is being used as a standin for the start point, since they should be the same at this time
    href.dis.style.backgroundColor="red";
}
function cardAdj(corra) {//gets corrdinates that are cardinally adjecent to a given point.
var temp = [];
for (let i = 37; i <= 40; i++) {//use this for state to get all corrdinates cardinally adjecent to a point.
    temp.push(switchMovement(corra, i));
    //console.log(temp);
}
return temp;//returns array
}
function getCorrdHref(cor){
    if(typeof(cor)=="string"){//we were given a string corrdinate, but need an array to do this properly.
        cor=cor.split(",");
    }
    return gridObj[cor[0]][cor[1]];//this line can error if the player attempts to move out of bounds, which is fine.
}
function interact(){
    var href = getCorrdHref(playerLoc);
    //code for getting treasure goes here.
    if(href.dis.style.backgroundColor=="red"){//is the background of the current tile red? (AKA, is it the exit?)
        nextLevel()
    }
}
function keyPress() {
    key = window.event.keyCode;
    if (key == 32) {
        interact();
        return;//we don't need to do math on the location.
    }
    try{
    var href = getCorrdHref(switchMovement(playerLoc, key))//this line errors if the player attempts to move to a location outside of the grid, which is fine.
    }catch(err){
        if(err=TypeError){
            throw "Player likely attempted to move to an out of bounds location, if that is the case such this error is intentional."
        } else {
            throw err.message
        }
    }
    while(href.content) {
        if(href.content.health){//does the tile contain an enemy?
            //yes it does
            //INSERT ATTACKING ENEMY HERE.
        } else if(typeof(href.content)=="object"){//if its not an enemy, but it is an object it must be a(n) item/treasure.
            break;//exits the while loop so we can still move.
        }
        //if the tile contains something, but it isn't either an enemy or an item
        return;//can't move to that tile
    }
    playerLoc = href.loc;
    resetLocDisplay()
}
function clearLocDisplay(){
    for (y = 1; y <= rows; y++) {
        for (x = 1; x <= columns; x++) {
            document.getElementById(x + "," + y).innerHTML = "";
        }
    }
}
function resetLocDisplay() {
    //drawVisCircle();
    clearLocDisplay()
    document.getElementById(playerLoc).innerHTML = "X";
}
function switchMovement(Corrd, key) {//movement function, returns a string
let temp;//incase the result becomes invalid, we need to return the orginial input.
if (typeof (Corrd) == "string") {
    Corrd = Corrd.split(",");
} else if (typeof (Corrd) != "object") {//this else if is mostly for debugging purposes.
    throw "invalid parameter for Corrd.";
}
    temp = Corrd;
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
        return Corrd//return orginial corrdinate
    //just have it return corrd so it doesn't break.
}
    return temp//returns new corrdinate as array
}
//mk start, end, and walls functions, also the random corrdinate function.
function ranArrCorrd(){//returns array,
    return [Math.floor(Math.random()*columns)+1,Math.floor(Math.random()*rows)+1]
}
function ranStrCorrd(){
    return Math.floor(Math.random()*columns)+1+","+Math.floor(Math.random()*rows)+1;
}
function mkWalls(){
    var hold=[];
    do{
        let temp=ranArrCorrd();//its an array for now.
        if(hold.indexOf(temp)!=-1){
            continue;
        } else {
            hold.push(temp);
        }
    }
    while(hold.length<10)
        for(corrd of hold){
            let href=gridObj[corrd[0]][corrd[1]]
            href.dis.style.backgroundColor="black"
            href.content="wall";
        }
    console.log(hold);
}