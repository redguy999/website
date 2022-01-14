const dGrid=document.getElementById("displayGrid")
const aGrid=document.getElementById("actionGrid")
const gridObj={}//While this could be an array, the 0th index would mess everything up.
//might remove gridObj
rows=7
columns=8
playerLoc="1,1"
start()
function start(){
    mkGrid();
    console.log(gridObj);
    mkWalls();
    setStart();
    setExit();
}
function setStart(){
    let temp=ranArrCorrd();
    console.log(temp);
    let href = gridObj[temp[0]][temp[1]]
    while(href.content){//Does the tile already have something on it?
        //if so, reroll start.
        temp=ranArrCorrd();
        href = gridObj[temp[0]][temp[1]];
    }
    href.dis.style.backgroundColor="green";
    playerLoc=temp[0]+","+temp[1];
}
function setExit(){
do{
    var temp=ranArrCorrd()
    var href = gridObj[temp[0]][temp[1]]
}while(href.content||cardAdj(playerLoc).indexOf(temp.toString())!=-1)//TODO: get rid of the latter part of this and have the pathfinder make sure they aren't too close.
//playerLoc is being used as a standin for the start point, since they should be the same at this time
    href.dis.style.backgroundColor="red";
}
function cardAdj(corra) {//gets corrdinates that are cardinally adjecent to a given point.
let temp = [];
for (let i = 37; i <= 40; i++) {//use this for state to get all corrdinates cardinally adjecent to a point.
    temp.push(switchMovement(corra, i));
    //console.log(temp);
}
return temp;//returns array
}
function keyPress() {
    key = window.event.keyCode;
    if (key == 32) {
        interact();
        return;//we don't need to do math on the location.
    }
    let temp = switchMovement(playerLoc, key);
    let href = gridObj[temp[0]][temp[1]]
    while(href.content) {//
        if(href.content.health){//does the tile contain an enemy?
            //yes it does
            //INSERT ATTACKING ENEMY HERE.
        } else if(typeof(href.content)=="object"){//if its not an enemy, but it is an object the only  thing it could be is an item/treasure.
            break;//exits the while loop so we can still move.
        }
        return;//can't move to that tile
    }
    playerLoc = temp;
    resetLocDisplay()
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
function switchMovement(Corrd, key) {//movement function, returns a string
let temp;//incase the result becomes invalid, we need to return the orginial input.
if (typeof (Corrd) == "string") {
    temp = Corrd.split(",");
} else if (typeof (Corrd) != "object") {//this else if is mostly for debugging purposes.
    throw "invalid parameter for Corrd.";
} else {//neither "if" will be true if corrd is an array, which is good.
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
        return temp//return orginial corrdinate
    //just have it return corrd so it doesn't break.
}
    return temp//returns new corrdinate as array
}
function mkGrid(){
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
                'content':""
            }
        }
    }
}//ids for divs in the display grid are "X-Y" while the action grid divs are "X,Y"
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
        document.getElementById(corrd).style.backgroundColor="black"
        gridObj[corrd[0]][corrd[1]].content="wall";
    }
    console.log(hold);
}