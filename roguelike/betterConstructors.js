//!!undefined === false
var currency = "";
const everySingleItem = {//we can't do this til the item drops are overhaulxw, again. might have this be a part of that overhaul
    "gold coin": {
        currency: true,//for the item that we want to be the currency, currently, this does nothing.
        //this doesn't need the value property since it can't be sold.
        findable:[5,10]
    },
    sword: {
        value: 20,
        equip: {
            slot: "mainHand",//NEEDS TO MATCH THE SLOTS IN THE EQUIPMENT OBJECT
            attack: 1,
            defense: 1,
        },
        findable: [3,1,2]//rarity:3 maxAmount: 1, first findable floor: 5;
    },
    spear: {
        value: 10,
        equip: {
            slot: "2Hands",//TODO: make slot an array so i don't have to hard code for 2Hands
            attack: 3,
        },
        use: {
            deal: 5,
        },
        findable:[4,function(){
            return Math.floor(level/2);
        },2]
    },
    
    potion: {
        value: 5,
        use: {
            deal: -10,
        },
        findable: [4,function(){
            return Math.floor(level*.1)+2
        }]
    },
    shield: {
        value: 25,
        equip: {
            defense: 1,
            Mhealth: 10,//might wanna rework something so this looks better.
            slot: "offHand",
        },
        findable:[3,1,5]//rarity, maxAmount, first floor it can be found on.
    },
    'chest plate': {
        value: 35,
        equip: {
            defense: 1,
            Mhealth: 20,
            slot: "chest",
        },
        findable:[3,1,10]
    },
    helmet: {
        value: 30,
        findable: [3,1,5],
        equip: {
            defense: 1,
            Mhealth: 10,
            slot: "head",
        }
    },
    "rock helmet": {//i'm not sure when we why i added this, but its here so i'll keep it.
        equip: {
            defense: 2,
            Mhealth: 20,
            slot: "head",
        },
    },
    "rock flail": {
        value: 100,
        equip: {
            attack: 5,
            slot: "mainHand",
        },
    },
    /* formating:
    findableItem:{
        [SEE SWORD]
        //if it isn't findable, just don't list the property
    },
    equipableItemName:{
        'value':[Number]
        //if it is useable or equipable, it must be given a value, otherwise errors will accord at the shop.
        equip:{
            // [INSERT EQUIPMENT VALUES HERE]
        },
    },
    useableItemName:{
        use:{
            // [INSERT CONSUMABLE’S VALUES HERE]
        },
    },	
    UseNequipName:{
        equip:{

        },
        use:{

        },
    },
    //continue for every item.*/
}
function seteveryItem() {//running this will create the items (in the above object) and place them properly in the correct locations 
    useable.splice(0,useable.length)
    equipable.splice(0,equipable.length)
    for (x in everySingleItem) {//x = item name
        let iM = everySingleItem[x]//makes it easier to call
        if (iM["value"]) {
            shopItemValues[x] = iM["value"];
        }
        if (iM["currency"]) {//this does nothing for the moment.
            currency = x;
        }
        if (iM["findable"]) {//makes the item findable, and adds it to the itemChance table
            setConstructing(x,iM["findable"])
        }
        if (iM['use']) {//this will be false if undefined
            //adds it to the useable array, and also adds its stats to the consumeable stats object.
            useable.push(x);
            comsumableStats[x] = {};
            let temp = comsumableStats[x]
            for (A in iM['use']) {
                temp[A] = iM['use'][A];
            }
        }
        if (iM['equip']) {
            //adds it to the equipable array, and adds its stats to the itemStats object.
            equipable.push(x)
            itemStats[x] = {};
            let temp = itemStats[x];
            for (A in iM['equip']) {
                temp[A] = iM['equip'][A];
            }
        }
    }
    updateConstructors();
}