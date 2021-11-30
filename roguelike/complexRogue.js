//admin functions:
function forceAddItem(item, amount) {//for admin use only
    if (typeof (inventory[item]) == "undefined") {
        inventory[item] = amount;
    } else {
        inventory[item] += amount;
    }
    displayInvent();
}
function forcePlaceEnemy(eName, corrdinate) {//admin function; both parameters are strings.
    let temp = placementInWall(corrdinate)
    if (!temp) { return; }//this works
    for (x in enemies) {
        if (String(x).toLowerCase() == eName.toLowerCase()) {//the if statement works
            temp = enemies[x];
            eList.push(new enemy(x, temp.Mhealth, temp.attack, temp.defense, temp.table))//adds it to the end of the array, which is important for the next part.
            let LI = eList.length - 1;//gets last index of array, which should be the newly added enemy.
            eList[LI]["location"] = corrdinate;//i accidently had this as "==" not "="
            entLocs.push(corrdinate);
            setBGColor(corrdinate, enemies[x].color);
            return;//so that the console error doesn't run.
        }
    }
    console.error("ERROR: enemy name not found in enemy list.")
}
function placementInWall(corrdin) {//should only be called from an admin function
    if (!checkOoB(corrdin)) {//placement check
        console.error("corrdinate out of bounds error, enemy placement impossible, aborting...")
        return false;//enemy can't be validly placed.
    } else if (CVM(corrdin)) {//CVM also check for being out of bounds, but we already checked that so that can't be true.
        while (true) {
            let temp = prompt("corrdinate is in a wall, your options are: to 'remove' the wall or to 'cancel' enemy placement.")
            if (temp == "remove") {
                walls.splice(walls.indexOf(corrdin), 1);//removes the wall on corrdinate, shouldn't error.
                return true;//enemy can now be placed.
            } else if (temp == "cancel") {
                return false;//enemy is no longer being placed.
            } else {
                alert("please answer the prompt correctly.")
            }
        }
    }
    return true;
}
function forcePlaceCustomE() {//admin function; it'll just ask for the values in prompts
    let stats = []
    stats.push(prompt("enemy's name:"));
    stats.push(prompt("enemy's max health:"));
    stats.push(prompt("enemy's attack:"));
    stats.push(prompt("enemy's defense:"));
    for (let i = 1; i <= 3; i++) {//skips the first index, which is intentional
        stats[i] = parseInt(stats[i]);
        if (stats[i] == NaN) {
            alert("ERROR: invalid variable type, expects: INT for all but name.")
            return;
        }
    }
    eList.push(new enemy(stats[0], stats[1], stats[2], stats[3]));
    let LI = eList.length - 1;//gets last index of array, which should be the newly added enemy.
    while (true) {
        let tempc = prompt("input corrdinate to place");
        let temp = placementInWall(tempc)
        if (temp === null) {
            return;//enemy is no longer being placed.
        } else if (temp) {
            eList[LI]["location"] == tempc;
            return;//no need to continue
        }
        alert("invalid corrdinate input")
    }
}
//Code for drag and drop below:
var cParent = null;
var dragged//string, what is being dragged, at least it should be.
var useA = [false, false]//[true,false] means the item is equipable, but not usable; [false,true] is usable, but not equipable.
document.addEventListener("drag", function (event) { }, false);
document.addEventListener("dragover", function (event) { event.preventDefault(); }, false);//!!DO NOT DELETE THIS
document.addEventListener("dragstart", function (event) {
    // store a ref. on the dragged elem
    dragged = event.target.id;
    let temp = event.target.className;
    if (temp == "G") {//i won't need this when i refractor this.
        useA = [true, true];//usable and equipable.
    } else if (temp == "U") {
        useA = [false, true];
    } else if (temp == "E") {
        useA = [true, false];
    } else {
        useA = [false, false];
        console.error("item was dragged without being able to do anything.")
    }
}, false);
document.addEventListener("dragleave", function (event) {//event is the element that was left.
    // reset background of potential drop target when the draggable element leaves it
    if (useA[0]) {
        if (event.target.id == "equipmentArea" && cParent != "equipmentArea") {//this doesn't quite work properly, outline sometimes doesn't disappear when leaving.
            document.getElementById("equipmentArea").style.boxShadow = "none";
        }
    }
    if (useA[1]) {
        if (event.target.id == playerLoc) {
            document.getElementById(event.target.id).style.boxShadow = "none";
            return;
        }
        for (let i = 0; i < eList.length; i++) {
            if (eList[i]["location"] == event.target.id) {
                document.getElementById(event.target.id).style.boxShadow = "none";
                break;
            }
        }
    }
}, false);
document.addEventListener("dragenter", function (event) {//gonna refractor this.
    // highlight potential drop target when the draggable element enters it
    cParent = event.target.parentNode.id;//drag enter runs before drag leave.
    if (useA[0]) {
        if (event.target.id == "equipmentArea" || cParent == "equipmentArea") {
            document.getElementById("equipmentArea").style.boxShadow = "inset 0 0 2px 2px #00F";
        }
    }
    if (useA[1]) {
        if (event.target.id == playerLoc) {
            document.getElementById(event.target.id).style.boxShadow = "inset 0 0 2px 2px #00FF00";
            return;
        }
        for (let i = 0; i < eList.length; i++) {
            if (eList[i]["location"] == event.target.id) {
                document.getElementById(event.target.id).style.boxShadow = "inset 0 0 2px 2px #FFA500";
                break;
            }
        }
    }
}, false);//i don't know what this false thing does but don't touch it.
document.addEventListener("drop", function (event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    let temp;
    if (event.target.id == "") {//if its not a valid id..
        temp = "InfoDisplay"//...force it to a valid id so that...
    } else {
        temp = event.target.id;
    }
    document.getElementById(temp).style.boxShadow = "none";//...this line doesn't error.
    document.getElementById("equipmentArea").style.boxShadow = "none";
    if (useA[0]) {
        if (event.target.id == "equipmentArea" || event.target.parentNode.id == "equipmentArea") {
            equipItem(dragged);
            return;
        }
    }
    if (useA[1]) {
        if (event.target.id == playerLoc) {
            useItem(dragged);
            return;
        }
        for (let i = 0; i < eList.length; i++) {
            if (eList[i]["location"] == event.target.id) {
                if (ActualpathToTarget(event.target.id)) {
                    useItem(dragged, event.target.id);
                } else {
                    TtC("The target is obscured by the walls!")
                }
                break;
            }
        }
    }
}, false);
const slBox = document.getElementById("sellBox")
//other complex stuff
function MPE(enem, locat) {//manually place enemy
    let temp = enemies[enem]//should be the armored goblin
    eList.push(new enemy(enem, temp.Mhealth, temp.attack, temp.defense, temp.table))
    let lI = eList.length - 1;//hopefully this works.
    eList[lI]["location"] = locat//i would have had it find the goblin in the list, but we already cleared this earlier.
    entLocs.push(eList[lI]["location"]);//adds it to this array.
    setBGColor(eList[lI]["location"], temp.color);//colors the tile
}
function MPI(corrd, item, amount) {//manually place item, assumes the item it is placing is the last item in the array
    let lI = iList.length - 1;//hopefully this works.
    iList[lI]["location"] = corrd;
    iList[lI]["contents"] = item;
    iList[lI]["amount"] = amount;
    entLocs.push(iList[lI]["location"]);
    setBGColor(iList[lI]["location"], "gold");
}
function MPS(sg) {//manually place start
    startPoint = sg
    playerLoc = startPoint;
    resetLocDisplay();
    setBGColor(startPoint, "lightGreen")
}
function MPEn(stri) {//manually place end
    exitPoint = stri
    setBGColor(exitPoint, "red");
}
function MPW(arr) {//manually place walls
    walls=walls.concat(arr);
    setBGColor(walls, "black");
}
const sLevels = [10]
function scriptedFloor() {//for floors we want to force a layout for.
    eList.splice(0, eList.length);//clear eList.
    entLocs = [];//clear entLocs
    walls = [];//clear walls
    if (level == 10) {
        MPS("1,10");
        MPEn("9,10")
        //below makes the walls.
        let temp = [];
        for (let i = 1; i < 10; i++) {
            temp.push(i + ",1");
        }
        for (let i = 6; i <= 8; i++) {
            for (let z = 10; z > 4; z--) {
                temp.push(i + "," + z)
            }
        }
        
        for (let i = 3; i <= 10; i++) {
            temp.push("2," + i);
        }
        for (let i = 4; i <= 9; i++) {
            for (let z = 2; z <= 3; z++) {
                temp.push(i + "," + z)
            }
        }
        for (let i = 3; i <= 5; i++) {
            temp.push(i + ",10");
        }
        for (let i = 4; i <= 8; i++) {
            temp.push("4," + i);
        }
        // for(let i=1;i<=10;i++){
        //     temp.push(i+",10");
        // }
        MPW(temp);
        //below is for the item.
        MPI("8,4", "gold coin", 50)
        //and now the enemy
        MPE("Armored goblin", "7,4")
    } else if (level == 5) {
        //golem chases you while you scramble towards the exit,
    } else {
        console.error("scripted floor got called for an unscripted floor")
    }
    //these shall always run, otherwise stuff doesn't display properly
    updateInfo();
}
//shop functions:
//TODO: figure out how the hell this works, cause i'm not sure how this works.
const shopDis = document.getElementById("shopDisplay");
const sInventDis = document.getElementById("shopInvent");//short for shop inventory display
const shopInven = {//what the shop has in stock, and how much of it.

}
const shopItemValues = {//contains the value of how many coins you'll get if you SELL this item to the shop, items are sold to you at a higher price.
    //format = itemName:Value; value is always a number, itemName is a string.
    //values were moved to betterConstructors

}//if an item is not on the list, it can't be sold to the shop.
const prices = {//holds the prices that an item is to be sold to you at.

}
const cartHold = {//what you're trying to buy.

}
function openShop() {//sets the display so that the shop works correctly.
    Mogrid.style.visibility = "hidden";
    shopDis.style.visibility = "visible";
    shopDis.style.zIndex = "20";//bring in front of the grid
    //intinalize the rest of the shop
    shopInven.potion = 10;
    shopInven["chest plate"] = 1;
    shopInven["shield"] = 1;
    shopInven.sword = 1;
    shopInven.spear = 10;
    document.body.onkeydown = function () { };
    //finished giving items to the shop
    var rate = Number.parseFloat((Math.random() * 2.5) + 1).toPrecision(2);//should always yeild a number between 1-4 (excluding 6), that can have a digit in the tenths place.
    console.log(rate);
    for (x in shopInven) {//for every item in the shop inventory
        prices[x] = Math.ceil(shopItemValues[x] * rate);//find its value and multiple it by the rate, then round up.
    }//we don't need to do all of the values since we won't need to do math on them.
    addToShelf()
}
function addToShelf() {//adds the items to the Menu
    sInventDis.innerHTML = ""
    for (x in shopInven) {//adds every item in the shop inventory
        sInventDis.innerHTML += "<div id='" + x + "H' style='display:grid;grid-template-columns:50% 50%;'><span class='onShelf' onClick='addToCart(\"" + x + "\")'>" + x + "</span><span>" + prices[x] + "g</span></div>";//ID is needed for when we need to remove stuff from the menu.
    }
}
const cart = document.getElementById("cart");
function addToCart(val) {//add items to the cart, these items will be sold to the player once they confirm the purchase.
    document.getElementById(val + "H").remove();//this doesn't work on IE but i doubt that anyone who will play this would use that
    cartHold[val] = 1//this is how much is being bought
    cart.innerHTML += "<div class='cartItem' id='" + val + "B'><span style='color:red;font-weight:bold;'onClick='returnToCart(\"" + val + "\")'>X</span><div style='color:white;'>" + val + "</div><span><input type='number' onchange='updatePrice()' min='1' max='" + shopInven[val] + "'placeholder='1'></input></span></div>";
    updatePrice()
}
function closeShop() {
    document.body.onkeydown = function () { keyPress() };
    cart.innerHTML = ""
    sInventDis.innerHTML = ""
    slBox.innerHTML = ""
    for (x in cartHold) {
        delete cartHold[x]
    }
    for (x in selling) {
        delete selling[x]
    }
    for (x in shopInven) {
        delete shopInven[x]
    }
    shopDis.style.visibility = "hidden"
    shopDis.style.zIndex = "-1";
    Mogrid.style.visibility = "visible";
    level++;
    nextLevel();
}
const selling = {//property format: `itemInBox:amount` THIS IS FOR SELLING STUFF

}
const spendAmount = document.getElementById("profitLose")
function updatePrice() {
    let temp = cart.childNodes;
    let hold = 0;
    for (i = 0; i < temp.length; i++) {
        let item = temp[i].id;
        item = item.slice(0, item.length - 1)//the ID has an extra character which is needed for IDing, but is otherwise unhelpful, this removes it.
        let tele = temp[i].lastChild.childNodes[0].value//finds and gets the input tag.
        if (!tele) {//this is true if value is empty, which can happen when this is called from "AddtoSell"
            tele = 1;
        }
        cartHold[item] = tele;
        hold += tele * prices[item];
    }
    if (isNaN(hold)) {//in case i did something wrong.
        hold = parseInt(sellProfit);
    }
    spendAmount.innerHTML = hold + "g";
}
function returnToCart(item) {
    document.getElementById(item + "B").remove();
    sInventDis.innerHTML += "<div id='" + item + "H' style='display:grid;grid-template-columns:50% 50%;'><span class='onShelf' onClick='addToCart(\"" + item + "\")'>" + item + "</span><span>" + prices[item] + "g</span></div>";
    delete cartHold[item];
    updatePrice()
}
function AddtoSell(item) {
    if (selling[item] !== undefined) {//should only be true if the item is already in the box
        return;//without this, you could sell multiple of the same item simulatously, which could be exploited to sell infinite items.
    }
    slBox.innerHTML += "<div class='cartItem' id='" + item + "S'><span style='color:red;font-weight:bold;' onClick='returnToInvent(\"" + item + "\")'>X</span><div style='color:white;'>" + item + "</div><span><input type='number' min='1' onchange='updateProfit()' max='" + inventory[item] + "'placeholder='1'></input></span></div>"
    selling[item] = 1;
    updateProfit();
}
function returnToInvent(ret) {
    delete selling[ret];
    document.getElementById(ret + "S").remove();//delete the item from the display
    updateProfit();
}
function buyItems() {
    let temp = parseInt(spendAmount.innerHTML);//the text is the price, and should be correct always.
    if (temp > inventory["gold coin"] || !inventory["gold coin"]) {//!undefined is true, since undefinied is a falsy.
        TtC("You don't have enough money.")
        return;
    }
    inventory["gold coin"] -= temp;
    for (x in cartHold) {
        if (inventory[x] === undefined) {//"===" is a strict check, and will not auto match the variable types before comparing
            inventory[x] = Number(cartHold[x]);
        } else {
            inventory[x] += Number(cartHold[x]);//attempting to do this while inventory[x] is undefined cause a NaN to appear.
        }
        shopInven[x] -= cartHold[x];
        if (shopInven[x] == 0) {
            delete shopInven[x];//if none of it exists, get rid of it.
        }
        delete cartHold[x];//empty the cart
    }
    displayInvent();
    cart.innerHTML = ""//clear the cart display
    spendAmount.innerHTML = "0g"
    addToShelf();//reset the shop inventory display
}
function mkProfit() {
    let temp = parseInt(sellProfit.innerHTML);//the text is the price, and should be correct always.
    if (inventory["gold coin"] === undefined) {
        inventory["gold coin"] = Number(temp);
    } else {
        inventory["gold coin"] += Number(temp);
    }
    for (x in selling) {
        inventory[x] -= selling[x];
        if (inventory[x] == 0) {
            delete inventory[x];//if none of it exists, get rid of it.
        }
        delete selling[x];//empty the cart
    }
    displayInvent();
    slBox.innerHTML = ""//clear the sellbox display
    sellProfit.innerHTML = "0g"
}
const sellProfit = document.getElementById("sellProfit")
function updateProfit() {
    let temp = slBox.childNodes;
    let hold = 0;
    for (i = 0; i < temp.length; i++) {
        let item = temp[i].id;
        item = item.slice(0, item.length - 1)//should remove the last index, which isn't helpful for this
        let tele = temp[i].lastChild.childNodes[0].value//finds and gets the input tag.
        if (!tele) {//this is true if value is empty, which can happen when this is called from "AddtoSell"
            tele = 1;
        }
        selling[item] = tele
        hold += tele * shopItemValues[item];
    }
    sellProfit.innerHTML = hold + "g";
}