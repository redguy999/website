function pTheorm(a, b) {//a & b are the lengths of the sides.
    return Math.sqrt((a ** 2) + (b ** 2));//returns c.
}
function calcHypo(aCorrd, bCorrd) {//both are corrdinate strings.
    let aCor = aCorrd.split(",")
    let bCor = bCorrd.split(",")
    let temp = [Math.abs(aCor[0] - bCor[0]), Math.abs(aCor[1] - bCor[1])];//gets the side lengths
    temp = pTheorm(...temp);
    return temp;
}
function ActualpathToTarget(tar) {
    let playerTemp = playerLoc.split(",");
    let tarTemp = tar.split(",");
    //directional check start
    function a(corrdinate) {//this is in case a direction is in line with the starting tile.
        return corrdinate
    }
    var moveArr = [a, a]//sceond is up/down first is left/right
    if (playerTemp[0] > tarTemp[0]) {//is the target to the left of the player?
        moveArr[0] = function (corrd) { //target is left.
            return switchMovement(corrd, 37);
        }
        //console.log("left");
    } else {
        moveArr[0] = function (corrd) { //target is right.
            return switchMovement(corrd, 39)
        }
        //console.log("right");
    }
    if (playerTemp[1] < tarTemp[1]) {//is the target below the player?
        //console.log("below");
        moveArr[1] = function (corrd) {//target is below.
            return switchMovement(corrd, 40);
        }
    } else {
        //console.log("above");
        moveArr[1] = function (corrd) {//target is above.
            return switchMovement(corrd, 38);
        }
    }
    //directional check end
    let tempCorrd = playerLoc;
    while (true) {
        if (tempCorrd == tar) {
            //console.log("reached target.");
            return true;
        }
        let temp = [];
        for (x of moveArr) {
            temp.push(x(tempCorrd));
        }
        let hold = [calcHypo(temp[0], tar), calcHypo(temp[1], tar)];
        if (hold[0] < hold[1]) {
            tempCorrd = temp[0];
        } else {
            tempCorrd = temp[1];
        }
        if (walls.indexOf(tempCorrd) != -1) {//is it in a wall?
            //console.log("hit a wall.");
            return false;
        }
        //setBGColor(tempCorrd,"blue");
    }
}
//below is for making the betterConstructors findable into just a single array. I'll move this to equipConstructors later.
const itemConstructing = {
    start: {//for when to add an item to allItems

    },
    end: {//for when to remove an item from allItems

    },
    info: {//other information.

    },
}
function setConstructing(name, arr) {//name is a string, arr is the an array
    //findable format: [rarity,maxAmount,start,end] last 2 are optional.
    if (arr[2]) {//this will be false if it is undefinied, and also 0, which is important if you want it to always be findable until a certain floor.
        itemConstructing.start[name] = arr[2]
    } else {//by default an item can be found on the first floor.
        itemConstructing.info[name] = arr.splice(0, 2);//this will be an array
    }
    if (arr[3]) {
        itemConstructing.end[name] = arr[3]
    }
}
function updateConstructors() {
    let temp = itemConstructing.start
    var hold=[,];
    for (x in temp) {//for setting allItems property values.
        if(temp[x]<=level){
            let ack = everySingleItem[x].findable//grabs the information
            itemConstructing.info[x]=ack.splice(0,2)//adds it to the info subobject.
            delete temp[x]; 
            //get rid of the start information since we no longer need that, also cause it would cause errors if we kept it.
        }
    }
    temp = itemConstructing.end
    for (x in temp) {//for setting allItems property values.
        if (temp[x] <= level) {//
            console.log()
            delete temp[x];//get rid of the end information since we no longer need it.
            delete AllItems[x];//remove it from possible treasure object
            delete itemConstructing.info[x];//remove it from info, since we no longer need that info.
        }
    }
    temp = itemConstructing.info
    for (x in temp) {//for setting allItems property values.
        if (typeof (temp[x][1]) == "function") {//for amount
            hold[1] = temp[x][1]();
        } else {
            hold[1] = temp[x][1];
        }
        if (typeof (temp[x][0]) == "function") {//for rarity
            hold[0] = temp[x][0]();//if its a function, get it to return the value.
        } else {
            hold[0] = temp[x][0];
        }
        AllItems[x] = hold;
        //empty hold:
        hold = [, ]
    }
}