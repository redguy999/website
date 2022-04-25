//these put the enemies and items on the board, see Constructors files for where the enemies and item information is.
function GEFL(){//get enemy from list
    let arrayT = [];//this will hold all the enemy names
    let temp;
    for(x in enemyChance){
        if(level<=x){
            temp = enemyChance[x];
            break;
        }
    }
    if(temp===undefined){//Final section is just in case the player gets very far into the duegon. 
        temp = enemyChance["Final"];
    }
    for(x in temp){
        arrayT.push(x);//adds every enemy in the list to the array.
    }//still don't have it so that it factors the chance in properly.
    let RNG = Math.floor(Math.random()*100)+1;//RNG will be a number between 1-100.
    let hold;//need this for the for loop.
    for(x in temp){//this is kinda complex, if you don't understand what i'm doing, ask me.
        if(RNG<=temp[x]){
            hold = x
            break;
        }else{
            RNG-=temp[x]
        }
    }//this shouldn't error, since RNG will between or equal to 1-100
    temp = enemies[hold];//this will error if the for in loop fails.
    eList.push(new enemy(hold,temp.Mhealth,temp.attack,temp.defense,temp.table));
    return temp.color;
}//this will need to be overhauled if i want to make it get harder as time goes on.
function placeEnemies() {
    var href = getCorrdHref(ranArrCorrd());//Get a random corrdinate.
    let name = GEFL();//get an enemy
    let eHold = enemies[name];//Make sure we get the correct enemy.
    href.dis.style.backgroundColor = eHold.color;
    href.content = new enemy(name, eHold.hp, eHold.atk, eHold.def, href);
    //href.content=new
}
function emptyTile(loc) {//loc is the ref to the element
    loc.content = "";
    loc.dis.style.backgroundColor="";
}
//above is enemy code, the rest is below
function mkOtherStuff() {//the inner functions don't work yet.
    //placeEnemies();
    //placeItems();
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