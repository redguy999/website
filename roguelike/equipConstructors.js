//JS class constructors for items.
const itemStats={//should only be looked into when something is added to equipment.
    sword:{//in theory these could all be arrays but i'm gonna keep it like this.
        name:"sword",
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
    getStats:function(iTe){
        let temp = {
        };
        //debugger;
        for(x in this[iTe]){//we have to do this since we can't edit the orginial objects.
            if(x=="slot"){
                continue;//they're not (valid) stats
            }
            temp[x]=this[iTe][x];
        }
        return temp;
    }
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