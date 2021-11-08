//JS class constructors for items.
const itemStats={//should only be looked into when something is added to equipment.
    sword:{
        name:"sword",//we need these cause it makes some things easier.
        slot:"mainHand",//NEEDS TO MATCH THE SLOTS IN THE EQUIPMENT OBJECT
        attack:1,
        defense:1,
    },
    spear:{
        name:"spear",
        slot:"2Hands",
        attack:2,
    },
    shield:{
        name:"shield",
        defense:1,
        Mhealth:10,
        slot:"offHand",
    },
    missingFail:{
        name:"missingFail",
    },
    potion:{//might need to make this its own class if we ever do custom potions.
        name:"potion",//leave name since its helpful, and we might need it.
        deal:-10,//deal (damage), negative Values mean healing.
    },
    useItem:function(item,target="self"){//default target for this function is yourself/the player. can't be used to target an enemy currently.
        let temp={};
        for(let x in this[item]){//we have to do this since we can't edit the orginial objects.
            if(x=="name"){
                continue;//they're not (valid) stats
            }
            temp[x]=this[item][x];
        }
        if(typeof(temp["deal"])!="undefined"){//might change this to a for loop that reads all the items in an array, which corrispond to all possible affects.
            if(target=="self"){
                player.hurtPlayer(temp["deal"]);
            }
        }//TODO: add more affects.
        //function returns nothing.
    },
    getStats:function(iTe){
        let temp = {
        };
        //debugger;
        for(let x in this[iTe]){//we have to do this since we can't edit the orginial objects.
            if(x=="slot"){
                continue;//they're not (valid) stats
            }
            temp[x]=this[iTe][x];
        }
        return temp;
    }
}
const enemies = [
    {name:"Goblin",Mhealth:"10",attack:"1",defense:"0",color:"orange"},//color is only for displaying where the enemy is.
    {name:"Armored goblin",Mhealth:"15",attack:"2",defense:"3",color:"grey"},
];
//{name:"None",Mhealth:"0",attack:"0",defense:"0",color:"orange"}, //this is the framework
const lootTable = [//loot table is an array of objects, each index of the array will match the enemy is corresponds to in the enemies array. 
    {"gold coin":[50,5],},//goblin,
    {spear:[30,1],shield:[20,1],"gold coin":[50,15]},//armored goblin has a 30% chance of dropping one spear, and a 20% chance of dropping one shield.
];//this will probably need overhauled/moved to enemies at some point but it works for now.
function dropLoot(Dropper){
    let temp;
    for(x in enemies){
        if(enemies[x].name==Dropper){
            temp=x;//x should be an int since its interating through an array.
            break;
        }
    }
    temp=lootTable[temp];//need to grab this.
    let chance = 100;
    for(x in temp){//enemies can only currently drop a single type of item currently
        let RNG = Math.floor(Math.random()*(chance))+1;
        console.log(chance);
        console.log(RNG);
        console.log(x)
        console.log(temp[x][0])
        if(RNG<temp[x][0]){
            if(temp[x][1]=1){
                return [x,1];
            }else if(temp[x][1]=0){//this shouldn't ever be true
                console.error("drop value invalid for: " +x);
                console.log(temp);
                continue;//skip it.
            }else{
                console.log(temp[x][1]);
                let temp = Math.floor(Math.random()*temp[x][1])+1;
                console.log(temp);
                return [x,temp];
            }
        } else {
            chance-temp[x][0]
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