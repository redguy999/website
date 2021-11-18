//admin functions:
function forceAddItem(item,amount){//for admin use only
    if(typeof(inventory[item])=="undefined"){
        inventory[item]=amount;
    }else{
        inventory[item]+=amount;
    }
    displayInvent();
}
function forcePlaceEnemy(eName,corrdinate){//admin function; both parameters are strings.
    let temp = placementInWall(corrdinate)
    if(temp){}else{return;}//this works
    for(x in enemies){
        if(String(enemies[x].name).toLowerCase()==eName.toLowerCase()){//the if statement works
            temp=enemies[x];
            eList.push(new enemy(temp.name,temp.Mhealth,temp.attack,temp.defense))//adds it to the end of the array, which is important for the next part.
            let LI = eList.length-1;//gets last index of array, which should be the newly added enemy.
            eList[LI]["location"]=corrdinate;//i accidently had this as "==" not "="
            entLocs.push(corrdinate);
            setBGColor(corrdinate,enemies[x].color);
            return;//so that the console error doesn't run.
        }
    }
    console.error("ERROR: enemy name not found in enemy list.")
}
function placementInWall(corrdin){//should only be called from an admin function
    if(!checkOoB(corrdin)){//placement check
        console.error("corrdinate out of bounds error, enemy placement impossible, aborting...")
        return false;//enemy can't be validly placed.
    } else if(CVM(corrdin)){//CVM also check for being out of bounds, but we already checked that so that can't be true.
        while(true){
            let temp = prompt("corrdinate is in a wall, your options are: to 'remove' the wall or to 'cancel' enemy placement.")
            if(temp=="remove"){
                walls.splice(walls.indexOf(corrdin),1);//removes the wall on corrdinate, shouldn't error.
                return true;//enemy can now be placed.
            } else if(temp=="cancel"){
                return false;//enemy is no longer being placed.
            }else{
                alert("please answer the prompt correctly.")
            }
        }
    }
    return true;
}
function forcePlaceCustomE(){//admin function; it'll just ask for the values in prompts
    let stats = []
    stats.push(prompt("enemy's name:"));
    stats.push(prompt("enemy's max health:"));
    stats.push(prompt("enemy's attack:"));
    stats.push(prompt("enemy's defense:"));
    for(let i=1;i<=3;i++){//skips the first index, which is intentional
        stats[i]=parseInt(stats[i]);
        if(stats[i]==NaN){
            alert("ERROR: invalid variable type, expects: INT for all but name.")
            return;
        }
    }
    eList.push(new enemy(stats[0],stats[1],stats[2],stats[3]));
    let LI = eList.length-1;//gets last index of array, which should be the newly added enemy.
    while(true){
        let tempc = prompt("input corrdinate to place");
        let temp=placementInWall(tempc)
        if(temp===null){
            return;//enemy is no longer being placed.
        }else if(temp){
            eList[LI]["location"]==tempc;
            return;//no need to continue
        }
        alert("invalid corrdinate input")
    }
}
//Code for drag and drop below:
var cParent=null;
var dragged//string, what is being dragged, at least it should be.
var useA = [false,false]//[true,false] means the item is equipable, but not usable; [false,true] is usable, but not equipable.
document.addEventListener("drag", function(event) {}, false);
document.addEventListener("dragover", function( event ) {event.preventDefault();}, false);//!!DO NOT DELETE THIS
document.addEventListener("dragstart", function(event) {
    // store a ref. on the dragged elem
    dragged = event.target.id;
    let temp = event.target.className;
    if(temp=="G"){//i won't need this when i refractor this.
        useA = [true,true];//usable and equipable.
    } else if(temp=="U"){
        useA = [false,true];
    } else if(temp=="E"){
        useA = [true,false];
    } else {
        useA = [false,false];
        console.error("item was dragged without being able to do anything.")
    }
}, false);
document.addEventListener("dragleave", function( event ) {//event is the element that was left.
    // reset background of potential drop target when the draggable element leaves it
    if(useA[0]){
        if (event.target.id == "equipmentArea"&&cParent!="equipmentArea"){//this doesn't quite work properly, outline sometimes doesn't disappear when leaving.
            document.getElementById("equipmentArea").style.boxShadow = "none";
        }
    }
    if(useA[1]){
        if(event.target.id==playerLoc){
            document.getElementById(event.target.id).style.boxShadow = "none";
            return;
        }
        for(let i=0;i<eList.length;i++){
            if(eList[i]["location"]==event.target.id){
                document.getElementById(event.target.id).style.boxShadow = "none";
                break;
            }
        }
    }
}, false);
document.addEventListener("dragenter", function( event ) {//gonna refractor this.
    // highlight potential drop target when the draggable element enters it
    cParent=event.target.parentNode.id;//drag enter runs before drag leave.
    if(useA[0]){
        if (event.target.id == "equipmentArea"||cParent=="equipmentArea"){
            document.getElementById("equipmentArea").style.boxShadow = "inset 0 0 2px 2px #00F";
        }
    }
    if(useA[1]){
        if(event.target.id==playerLoc){
            document.getElementById(event.target.id).style.boxShadow = "inset 0 0 2px 2px #00FF00";
            return;
        }
        for(let i=0;i<eList.length;i++){
            if(eList[i]["location"]==event.target.id){
                document.getElementById(event.target.id).style.boxShadow = "inset 0 0 2px 2px #FFA500";
                break;
            }
        }
    }
}, false);//i don't know what this false thing does but don't touch it.
document.addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    let temp;
    if(event.target.id==""){//if its not a valid id..
        temp = "InfoDisplay"//...force it to a valid id so that...
    } else {
        temp = event.target.id;
    }
    document.getElementById(temp).style.boxShadow = "none";//...this line doesn't error.
    document.getElementById("equipmentArea").style.boxShadow = "none";
    if(useA[0]){
        if (event.target.id == "equipmentArea"||event.target.parentNode.id=="equipmentArea") {
            equipItem(dragged);
            return;
        }
    }
    if(useA[1]){
        if(event.target.id==playerLoc){
            useItem(dragged);
            return;
        }
        for(let i=0;i<eList.length;i++){
            if(eList[i]["location"]==event.target.id){
                useItem(dragged,event.target.id);
                break;
            }
        }
    }
}, false);
const slBox = document.getElementById("sellBox")
//other complex stuff
function scriptedFloor(){//for floors we want to force a layout for.
    eList.splice(0,eList.length);//clear eList.
    entLocs = [];//clear entLocs
    if(level==5){
        startPoint="1,10"
        playerLoc=startPoint;
        resetLocDisplay();
        setBGColor(startPoint,"lightGreen")
        exitPoint="9,10"
        setBGColor(exitPoint,"red");
        walls = [];
        //below makes the walls.
        for(let i = 1;i<10;i++){
            walls.push(i+",1");
        }
        for(let i=6;i<=8;i++){
            for(let z=10;z>4;z--){
                walls.push(i+","+z)
            }
        }
        for(let i=3;i<=10;i++){
            walls.push("2,"+i);
        }
        for(let i=4;i<=9;i++){
            for(let z=2;z<=3;z++){
                walls.push(i+","+z)
            }
        }
        for(let i=3;i<=5;i++){
            walls.push(i+",10");
        }
        for(let i=4;i<=8;i++){
            walls.push("4,"+i);
        }
        setBGColor(walls, "black")//makes the walls visible.
        //below is for the item.
        iList[0]["location"] = "8,4"
        iList[0]["contents"] = "gold coin";
        iList[0]["amount"] = 50;
        entLocs.push(iList[0]["location"])//need to do this otherwise code will break.
        setBGColor(iList[0]["location"],"gold")//makes treasure visible
        //and now the enemy
        let temp = enemies["Armored goblin"]//should be the armored goblin
        eList.push(new enemy("Armored goblin",temp.Mhealth,temp.attack,temp.defense,temp.table))
        eList[0]["location"]="7,4"//i would have had it find the goblin in the list, but we already cleared this earlier.
        entLocs.push(eList[0]["location"]);//adds it to this array.
        setBGColor(eList[0]["location"],temp.color);//colors the tile
    }

    //these shall always run, otherwise stuff doesn't display properly
    updateInfo();
}
//shop functions:
var shopLoc = "0,0";
const shopDis = document.getElementById("shopDisplay");
const sInventDis = document.getElementById("shopInvent");//short for shop inventory display
const shopInven = {//what the shop has in stock, and how much of it.

}
const shopItemValues={//contains the value of how many coins you'll get if you SELL this item to the shop, items are sold to you at a higher price.
    //format = itemName:Value; value is always a number, itemName is a string.
    spear:10,
    shield:25,
    sword:20,
    potion:5,
    "chest plate":35,
    helmet:30,
    "rock flail":100,
}//if an item is not on the list, it can't be sold to the shop.
const prices={//holds the prices that an item is to be sold to you at.

}
const cartHold={

}
function openShop(){//sets the display so that the shop works correctly.
    Mogrid.style.visibility = "hidden";
    shopDis.style.visibility = "visible";
    shopDis.style.zIndex = "20";//bring in front of the grid
    //intinalize the rest of the shop
    shopInven.potion = 10;
    shopInven["chest plate"] = 1;
    shopInven["shield"] = 1;
    shopInven.sword = 1;
    shopInven.spear = 10;
    //finished giving items to the shop
    var rate = Number.parseFloat((Math.random()*3)+1).toPrecision(2);//should always yeild a number between 1-4 (excluding 6), that can have a digit in the tenths place.
    console.log(rate);
    for(x in shopInven){//for every item in the shop inventory
        prices[x]= Math.ceil(shopItemValues[x]*rate);//find its value and multiple it by the rate, then round up.
    }//we don't need to do all of the values since we won't need to do math on them.
    addToShelf()
}
function addToShelf(){//adds the items to the Menu
    sInventDis.innerHTML=""
    for(x in shopInven){//adds every item in the shop inventory
        sInventDis.innerHTML+="<div id='"+x+"H' style='display:grid;grid-template-columns:50% 50%;'><span class='onShelf' onClick='addToCart(\""+x+"\")'>"+x+"</span><span>"+prices[x]+"g</span></div>";//ID is needed for when we need to remove stuff from the menu.
    }//<span id="item" onClick="addToCart('item')">item</span><br>
}
const cart = document.getElementById("cart");
function addToCart(val){//add items to the cart, these items will be sold to the player once they confirm the purchase.
    document.getElementById(val+"H").remove();//this doesn't work on IE but i doubt that anyone who will play this would use that
    cartHold[val]=prices[val]
    cart.innerHTML+="<div class='cartItem' id='"+val+"B'><span style='color:red;font-weight:bold;'onClick='returnToCart(\""+val+"\")'>X</span><div style='color:white;'>"+val+"</div><span><input type='number' onchange='updatePrice()' min='1' max='"+shopInven[val]+"'placeholder='1'></input></span></div>";
    updatePrice()
}
function closeShop(){
    shopDis.style.visibility = "hidden"
    shopDis.style.zIndex = "-1";
    Mogrid.style.visibility = "visible";
    //the unintinalize the shop?
}
const selling = {//property format: `itemInBox:amount`
    
}
const spendAmount = document.getElementById("profitLose")
function updatePrice(){
    let temp = cart.childNodes;
    let hold = 0;
    for (i = 0; i < temp.length; i++) {
        let item = temp[i].id;
        item = item.slice(0,item.length-1)//returns all but the last index, which is what we need.
        let tele = temp[i].lastChild.childNodes[0].value//finds and gets the input tag.
        if(!tele){//this is true if value is empty, which can happen when this is called from "AddtoSell"
            tele=1;
        }
        selling[item]=tele
        hold+=tele*prices[item];
    }
    if(isNaN(hold)){//in case i did something wrong.
        hold = parseInt(sellProfit);
    }
    spendAmount.innerHTML=hold+"g";
}
function returnToCart(item){
    document.getElementById(item+"B").remove();
    sInventDis.innerHTML+="<div id='"+item+"H' style='display:grid;grid-template-columns:50% 50%;'><span class='onShelf' onClick='addToCart(\""+item+"\")'>"+item+"</span><span>"+prices[item]+"g</span></div>";
    delete cartHold[item];
    updatePrice()
}
function AddtoSell(item){
    if(selling[item]==0||selling[item]===undefined){
        return;//without this, you could see multiple of the same item simulatously, which could be exploited to sell infinite items.
    }
    slBox.innerHTML+="<div class='cartItem' id='"+item+"S'><span style='color:red;font-weight:bold;' onClick='returnToInvent(\""+item+"\")'>X</span><div style='color:white;'>"+item+"</div><span><input type='number' min='1' onchange='updateProfit()' max='"+inventory[item]+"'placeholder='1'></input></span></div>"
    selling[item]=1;
    updateProfit();
}
function returnToInvent(ret){
    delete selling[ret];
    document.getElementById(ret+"S").remove();//delete the item from the display
    updateProfit();
}
const sellProfit = document.getElementById("sellProfit")
function updateProfit(){
    let temp = slBox.childNodes;
    let hold = 0;
    for (i = 0; i < temp.length; i++) {
        let item = temp[i].id;
        item = item.slice(0,item.length-1)//should remove the last index, which isn't helpful for this
        let tele = temp[i].lastChild.childNodes[0].value//finds and gets the input tag.
        if(!tele){//this is true if value is empty, which can happen when this is called from "AddtoSell"
            tele=1;
        }
        selling[item]=tele
        hold+=tele*shopItemValues[item];
    }
    if(isNaN(hold)){//in case i did something wrong.
        hold = parseInt(sellProfit);
    }
    sellProfit.innerHTML=hold+"g";
}