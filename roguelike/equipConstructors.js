//JS class constructors for items.
const itemStats={//should only be looked into when something is added to equipment.
    sword:{
        name:"sword",//we need these cause it makes some things easier.
        slot:"mainHand",
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
class equiped{
    constructor(name="missingN",attack=0,defense=0,healthUp=0,special=null){//currently no way to read special.
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.healthUp = healthUp;
        this.special = special;
    }
}