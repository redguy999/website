const enemies = {
    //name is needed here, cause of how the indices work for objects.
    Goblin: {
        hp: "10",
        atk: "1",
        def: "0",
        color: "green" /*table:{"gold coin":[50,2],}*/,
    }, //color is only for displaying where the enemy is.
    "Armored goblin": {
        hp: "15",
        atk: "2",
        def: "3",
        color:
            "darkolivegreen" /*table:{spear:[30,1],shield:[20,1],sword:[20,1],"gold coin":[50,5]}*/,
    },
    "Rock golem": {
        hp: "30",
        atk: "4",
        def: "4",
        color: "grey" /*table:{"rock flail":[50,1],"gold coin":[100,50]}*/,
    },
};
const AllItems = ["gold coin","sword","shield","spear"]
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
class enemy {
    constructor(name, Mhealth, attack, defense, ref, table = null) {
        this.name = name; //string
        this.location = ref; //So it can delete itself when it needs to.
        this.Mhealth = Mhealth; //number
        this.health = Mhealth; //health starts equal to max health.
        this.attack = attack; //number
        this.defense = defense; //number
        this.table = table; //currently unused.
        this.hurt = function (damg, retal = true) {
            //retal is short for retaliate.
            let temp = 0;
            if (damg > 0) {
                //if damage is negative, ignore defense, since it is likely healing.
                temp = Math.ceil(damg - this.defense / 2); //current defense calucation formula, will likely change it.
                if (temp <= 0) {
                    TtC(
                        "The " + this.name + "'s armor completely protects them from harm!"
                    );
                    if (retal == true) {
                        this.fight();
                    } //skip to attack
                    return; //nothing else to do.
                }
            } else {
                temp = damg;
            }
            //probably some check for special attributes, oh and also defense
            //if the enemy doesn't have "health" which can be determined by checking max health, call a special function.
            this.health -= temp;
            if (temp > 0) {
                TtC("The " + this.name + " takes " + temp + " damage!");
            } else {
                TtC("The " + this.name + " heals " + -temp + " health!"); //TODO: reword this.
            }
            if (this.health > this.Mhealth) {
                //this function can be used for healing too.
                this.health = this.Mhealth;
            } else if (this.health <= 0) {
                this.dead();
                return; //need to early return because otherwise attack runs.
            }
            if (retal == true) {
                this.fight();
            }
        };
        this.dead = function () {
            TtC(this.name + " has been defeated.");
            this.location.dis.style.backgroundColor = "";
            if (table) {
                //hasn't been ported yet.
                // let temp = dropLoot(this.table);
                // if(temp===null){//drop nothing
                // }else{
                //     if(temp[1]>1){
                //         TtC("The "+this.name+" dropped: "+temp[1]+" "+temp[0]+"s.")
                //     } else{
                //         TtC("The "+this.name+" dropped: one "+temp[0]+".")//TODO: merge this and the temp = string one.
                //     }
                //     addToInventory(temp);//addToInventory can convert this to the proper format.
                // }
            } else {
                //console.error("ERROR: function, dropLoot failed.")
            }
            emptyTile(this.location); //there might be erroring unless this is made an async function.
        };
        this.fight = function () {
            //might make it able to attack anyone.
            if (this.attack == 0) {
                return; //early exit in case the enemy can't attack.
            }
            player.hurtPlayer(this.attack);
        };
    }
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
const items = [ ]
function placeItems() {
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
function GIFL(){//get item from list THIS IS THE OLD FUNCTION WHICH IS BEING USED FOR TESTING.
    return AllItems[Math.floor(Math.random()*(AllItems.length))];//this won't need changed if the length of AllItems changes.
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
            emptyTile(this.location)
        }
    }
}
const inventory = {
			
}
function addToInventory(item,amount=1){//self explainitory
    if(typeof(item)=="object"){
        amount=item[1];
        item=item[0];
    } 
    if(typeof(item)!="string"){
        console.error("ERROR: invalid type for argument 'item', type should be string or array.")
        return;//can't work with an invalid variable type.
    }
    if(inventory[item]){//this check will be false if its undefined or 0, for the former this is needed, for the latter it doesn't matter.
        inventory[item]=amount;
    }else{
    inventory[item]+=amount;
    }
    // try{//We already know how to make the inventory work, we're only testing to see if getting the items work correctly.
    //     displayInvent()
    // } catch {

    // }
}