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