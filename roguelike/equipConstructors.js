//JS class constructors for items.
const comsumableStats={
    potion:{//might need to make this its own class if we ever do custom potions.
        deal:-10,//deal (damage), negative Values mean healing.
    },
    spear:{//throw it at enemies
        deal:5,
    },//might rework this somewhat to add descriptions.
    useItem:function(item,target){//default target for this function is yourself/the player, but that default is set elsewhere.
        let temp={};
        for(let x in this[item]){//we have to do this since we can't edit the orginial objects.
            temp[x]=this[item][x];
        }
        if(typeof(temp["deal"])!="undefined"){//might change this to a for loop that reads all the items in an array, which corrispond to all possible affects.
            if(target==playerLoc){
                TtC("You use the "+item+" on yourself.")
                player.hurtPlayer(temp["deal"]);
            } else {
                for(let i=0;i<eList.length;i++){
                    if(eList[i]["location"]==target){
                        TtC("You use the "+item+" on "+eList[i].name+".");
                        eList[i].hurt(temp["deal"],false);
                        break;
                    }
                }
            }
        }//TODO: add more affects.
        //function returns nothing.
    },
};
const itemStats={//should only be looked into when something is added to equipment.
    sword:{
        slot:"mainHand",//NEEDS TO MATCH THE SLOTS IN THE EQUIPMENT OBJECT
        attack:1,
        defense:1,
    },
    spear:{
        slot:"2Hands",//TODO: make slot an array so i don't have to hard code for 2Hands
        attack:2,
    },
    shield:{
        defense:1,
        Mhealth:10,//might wanna rework something so this looks better.
        slot:"offHand",
    },
    missingFail:{//fail test, should never be found in game, and is only to test that the null checks for bad code work.
        name:"missingFail",
    },
    'chest plate':{
        defense:1,
        Mhealth:20,
        slot:"chest",
    },
    helmet:{
        defense:1,
        Mhealth:10,
        slot:"head",
    },
    "rock helmet":{
        defense:2,
        Mhealth:20,
        slot:"head",
    },
    "rock flail":{
        attack:5,
        slot:"mainHand",
    },
    getStats:function(iTe){
        let temp = {
        };
        temp.name = iTe;
        for(let x in this[iTe]){//we have to do this since we can't edit the orginial objects.
            if(x=="slot"){
                continue;//they're not (valid) stats
            }
            temp[x]=this[iTe][x];
        }
        return temp;
    }
}
const enemies = {//name is needed here, cause of how the indices work for arrays.
    "Goblin":{Mhealth:"10",attack:"1",defense:"0",color:"#0A0",table:{"gold coin":[50,5],}},//color is only for displaying where the enemy is.
    "Armored goblin":{Mhealth:"15",attack:"2",defense:"3",color:"darkgreen",table:{spear:[30,1],shield:[20,1],sword:[20,1],"gold coin":[50,15]}},
    "Rock golem":{Mhealth:"30",attack:"4",defense:"4",color:"grey",table:{"rock flail":[25,1],"gold coin":[100,100]}},
};
const enemyChance = {//contains the chances of enemies spawning on a certain range of floors.
    5:{"Goblin":90,"Armored goblin":10},//spawn chance for floors 1-5
    10:{"Armored goblin":25,"Goblin":75},//spawn chance for floors 6-10
    20:{"Goblin":50,"Armored goblin":50},//spawn chance 11-20
    30:{"Goblin":20,"Armored goblin":70,"Rock golem":10},
    40:{"Goblin":1,"Armored goblin":74,"Rock golem":25},//sum of all the numbers in an object need to be equal to 100
    50:{"Armored goblin":50,"Rock golem":50},//41-50
    Final:{"Armored goblin":20,"Rock golem":80},//Final is for when the player gets to a floor beyond the defined range
};
//{name:"None",Mhealth:"0",attack:"0",defense:"0",color:"orange"}, //this is the framework
function dropLoot(Dropper){
    temp=Dropper;//Dropper is the loot table.
    let chance = 100;
    for(x in temp){//enemies can only currently drop a single type of item currently
        let RNG = Math.floor(Math.random()*(chance))+1;
        console.log(x);
        console.log(RNG);
        if(RNG<temp[x][0]){
            if(temp[x][1]==1){
                return [x,1];
            }else if(temp[x][1]==0){//this shouldn't ever be true, unless someone codes badly
                console.error("drop value invalid for: " +x);
                console.log(temp);
                continue;//skip it.
            }else{
                console.log(temp[x][1]);
                let RNT = Math.floor(Math.random()*temp[x][1])+1;
                console.log(RNT);
                return [x,RNT];
            }
        }
    }
    return null;//if dropping nothing.
}
class equiped{
    constructor(name="missingN",attack=0,defense=0,healthUp=0,special=null){//currently no way to read special.
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.healthUp = healthUp;
        this.special = special;
    }
}