//!!undefined === false
var currency = "";
const everySingleItem = {//we can't do this til the item drops are overhaulxw, again. might have this be a part of that overhaul
	"gold coin":{
		currency:true,//for the item that we want to be the currency, currently, this does nothing.
        //this doesn't need the value property since it can't be sold.
        findable:{
                5:[5,3],//theres most certainly a better way to do this, but this is how it shall be for now.
                10:[5,5],
                20:[5,10],
                30:[5,12],
                40:[5,15],
                50:[5,17],
                Final:[5,20],}
	},
    sword:{
        value:20,
        equip:{
            slot:"mainHand",//NEEDS TO MATCH THE SLOTS IN THE EQUIPMENT OBJECT
            attack:1,
            defense:1,
        },
        findable:{
            5:[3,1],
            10:[3,1],
            20:[3,1],
            30:[3,1],
            40:[3,1],
            50:[3,1],
            Final:[3,1],
        },
    },
    spear:{
        value:10,
        equip:{
            slot:"2Hands",//TODO: make slot an array so i don't have to hard code for 2Hands
            attack:2,
        },
        use:{
            deal:5,
        },
        findable:{
            5:[4,2],
            10:[4,2],
            20:[4,3],
            30:[4,4],
            40:[4,6],
            50:[4,7],
            Final:[4,8],
        }
    },
    potion:{
        value:5,
        use:{
            deal:-10,
        },
        findable:{
            5:[4,2],
            10:[4,3],
            20:[4,4],
            30:[4,5],
            40:[4,6],
            50:[4,7],
            Final:[4,8],
        }
    },
    shield:{
        value:25,
        equip:{
            defense:1,
            Mhealth:10,//might wanna rework something so this looks better.
            slot:"offHand",
        },
        findable:{
            5:[3,1],
            10:[3,1],
            20:[3,1],
            30:[3,1],
            40:[3,1],
            50:[3,1],
            Final:[3,1],
        },
    },
    'chest plate':{
        value:35,
        equip:{
            defense:1,
            Mhealth:20,
            slot:"chest",
        },
        findable:{
            20:[3,1],
            30:[3,1],
            40:[3,1],
            50:[3,1],
            Final:[3,1],
        },
    },
    helmet:{
        value:30,
        findable:{
            10:[3,1],
            20:[3,1],
            30:[3,1],
            40:[3,1],
            50:[3,1],
            Final:[3,1],
        },
        equip:{
            defense:1,
            Mhealth:10,
            slot:"head",
        }
    },
    "rock helmet":{//i'm not sure when we why i added this, but its here so i'll keep it.
        equip:{
            defense:2,
            Mhealth:20,
            slot:"head",
        },
    },
    "rock flail":{
        value:100,
        equip:{
            attack:5,
            slot:"mainHand",
        },
    },
    /* formating:
	findableItem:{
		findable:{floorNum:[rarity,amount],
                floorNum2:[rarity,amount],}
        //if it isn't findable, just don't list the property. also i might change this back to a boolean and make something like what i did for the lootTable.
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
function seteveryItem(){//running this will create the items (in the above object) and place them properly in the correct locations 
	for(x in everySingleItem){//x = item name
		let iM = everySingleItem[x]//makes it easier to call
        if(iM["value"]){
            shopItemValues[x]=iM["value"];
        }
        if(iM["currency"]){//this does nothing for the moment.
            currency=x;
        }
        if(iM["findable"]){//makes the item findable, and adds it to the itemChance table
            // AllItems.push(x)
            let temp = everySingleItem[x]["findable"]//we need this information
            for(A in temp){//x will be a number, or string for 'final'
                if(!itemChance[A]){//if undefined, then this is true.
                    console.log("entry not found.")
                    itemChance[A]={};
                }
                itemChance[A][x]=temp[A];
            }
        }
		if(iM['use']){//this will be false if undefined
            //adds it to the useable array, and also adds its stats to the consumeable stats object.
            useable.push(x);
            comsumableStats[x]={};
            let temp = comsumableStats[x]
            for(A in iM['use']){
                temp[A]=iM['use'][A];
            }
		}
        if(iM['equip']){
            //adds it to the equipable array, and adds its stats to the itemStats object.
            equipable.push(x)
            itemStats[x]={};
            let temp = itemStats[x];
            for(A in iM['equip']){
                temp[A]=iM['equip'][A];
            }
        }
	}
    AllItems[0]=1;//this is so that we can do a quick check so that we don't have to run this again.
}