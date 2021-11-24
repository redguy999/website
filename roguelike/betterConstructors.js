//!!undefined === false
var currency = "";
const everySingleItem = {//we can't do this til the item drops are overhaulxw, again. might have this be a part of that overhaul
	"gold coin":{
		currency:true,//for the item that we want to be the currency, currently, this does nothing.
	},
    /*"rock":{//testing
        findable:[5,10],
    },
    "arrow":{//testing
        findable:[5,5],
        equip:{
            slot:"mainHand",
            attack:1,
        },
        use:{
            deal:3,
        },
    },
    /* formating:
	findableItem:{
		findable:[rarity,amount],
        //if it isn't findable, just don't list the property. also i might change this back to a boolean and make something like what i did for the lootTable.
	},
	equipableItemName:{
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
function seteveryItem(){//running this will create the items (in the above object) and place them properly in the correct locations 
	for(x in everySingleItem){
		let iM = everySingleItem[x]//makes it easier to call
        if(iM["currency"]){
            currency=x;
        }
        if(iM["findable"]){
            AllItems[x]=iM["findable"];//REWORK! this doesn't work since the item rework.
        }
		if(iM['use']){//this will be false if undefined
            useable.push(x);
            comsumableStats[x]={};
            let temp = comsumableStats[x]
            for(A in iM['use']){
                temp[A]=iM['use'][A];
            }
		}
        if(iM['equip']){
            equipable.push(x)
            itemStats[x]={};
            let temp = itemStats[x];
            for(A in iM['equip']){
                temp[A]=iM['equip'][A];
            }
            //add the item and stats to "itemStats"
        }
	}
}