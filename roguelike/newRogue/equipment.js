const everyItem={
    "gold coin":{
        find:5,
    },
    "sword":{
        find:1,//number is the max amount that can be found at once
        equip:{
            //stat boost given when equiped.
            slot:"Main hand",//should be string or array, see spear for the latter.
            attack:1,
        }
    },
    "shield":{
        find:1,
        equip:{
            slot:"Off hand",
            defense:1,
        }
    },
    "chest plate":{
        find:1,
        equip:{
            slot:"Torso",
            defense:1
        }
    },
    spear:{
        find:2,
        use:5,//use number is how much damage is dealt when used, might change to object to allow for different effects.
        equip:{
            //first slot given in array is where the stats will be listed.
            slot:["Main hand","Off hand"],
            attack:3
        }
    },
}