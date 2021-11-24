//JS class constructors for items.
const comsumableStats={

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
const enemies = {//name is needed here, cause of how the indices work for objects.
    "Goblin":{Mhealth:"10",attack:"1",defense:"0",color:"green",table:{"gold coin":[50,2],}},//color is only for displaying where the enemy is.
    "Armored goblin":{Mhealth:"15",attack:"2",defense:"3",color:"darkolivegreen",table:{spear:[30,1],shield:[20,1],sword:[20,1],"gold coin":[50,5]}},
    "Rock golem":{Mhealth:"30",attack:"4",defense:"4",color:"grey",table:{"rock flail":[50,1],"gold coin":[100,50]}},
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
    for(x in temp){//enemies can only currently drop a single type of item currently
        let RNG = Math.floor(Math.random()*(100))+1;
        if(RNG<temp[x][0]){
            if(temp[x][1]==1){
                return [x,1];
            }else if(temp[x][1]==0){//this shouldn't ever be true, unless someone codes badly
                console.error("drop value invalid for: " +x);
                continue;//skip it.
            }else{
                console.log(temp[x][1]);
                let RNT = Math.floor(Math.random()*temp[x][1])+1;
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
const itemChance={//array: rarity (5 is most common), max amount
    5:{},//floors 1-5
    10:{},//floors 6-10
    20:{},
    Final:{},//for floors beyond the bounds.
}
/*
function GEFL(){//get enemy from list
    let arrayT = [];//this will hold all the enemy names
    let temp;
    for(x in enemyChance){
        if(level<=x){
            temp = enemyChance[x];
            break;
        }
    }
    if(temp===undefined){
        temp = enemyChance["Final"];
    }
    //temp is an object this point forward
    for(x in temp){
        arrayT.push(x);//adds every enemy in the list to the array.
    }
    let RNG = Math.floor(Math.random()*100)+1; 	
    let hold;
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
}//this will need to be overhauled if i want to make it get harder as time goes on.*/

function eGIFL(){//get item from list
    let temp;
    for(x in itemChance){
        if(level<=x){
            temp = itemChance[x];
            break;
        }
    }
    if(temp===undefined){
        temp = itemChance["Final"];
    }
    //temp is object going foward
    let arrayT = [];
    for(x in temp){
        for(let i=0;i<temp[x][0];i++){//get the rarity, then...
            arrayT.push(x);//add the item a certain amount of items in accordance with the rarity value.
        }
    }
    let hold =arrayT[Math.floor(Math.random()*arrayT.length)];
    if(temp[hold][1]==1){//no need to do math, just do a quick check then skip the math if it succeeds.
        return [hold,1];
    } else{
        temp = Math.floor(Math.random()*(temp[hold][1]))+1;//should work.
        return [hold,temp];
    }
}//*/