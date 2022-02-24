//these put the enemies and items on the board, see Constructors files for where the enemies and item information is.
function pickEnemy() {
    let hold = [];
    for (x in enemies) {
        //this will need modified for the floors
        hold.push(x);
    }
    let temp = Math.floor(Math.random() * hold.length); //pick a number equal to or between 0 and the highed index number of the list.
    return hold[temp]; //returns the randomly picked enemy (specificly the name)
}
function placeEnemies() {
    var href = getCorrdHref(ranArrCorrd());
    let name = pickEnemy();
    let eHold = enemies[name];
    href.dis.style.backgroundColor = eHold.color;
    href.content = new enemy(name, eHold.hp, eHold.atk, eHold.def, href);
    //href.content=new
}
function emptyTile(loc) {
    //might need to be made async so it doesn't bug the hell out of the program.
    loc.content = "";
    loc.dis.style.backgroundColor="";
}
//above is enemy code, the rest is below
function mkOtherStuff() {
    //placeEnemies();
    placeItems();
}
function placeItems() {//!!TODO: update this to the version the stable is using.
    var href;
    var hold = Math.floor(Math.random()+1)*3
    for(i=0;i<hold;i++){
        do{
            href = getCorrdHref(ranArrCorrd());
        }
        while(href.content || href.dis.style.backgroundColor)
        href.content = new treasure(GIFL(),2,href)//TODO: replace 2 with the actual amount function.
        href.dis.style.backgroundColor = "gold"
        console.log(href.content)
    }
}
class treasure{
    constructor(cont,amount,loc){
        this.contents = cont;//string
        this.amount = amount;
        this.location = loc;//grid object ref
        this.getItem = function(){
            if(this.amount==1){
                alert("you found a "+this.contents+".")
            }else{
                alert("you found some "+this.contents+"s.");//change this to log at the bottom console
            }
            addToInventory(this.contents,this.amount);  
            emptyTile(this.location)//JS is fine with this.
        }
    }
}