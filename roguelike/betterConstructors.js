//!!undefined === false
const currency = "";
const everySingleItem = {
	"gold coin":{
		currency:true,//for the item that we want to be the currency
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
function seteveryItems(){
	for(x in everySingleItem){
		let iM = everySingleItem[x]//makes it easier to call
        if(iM["currency"]){
            currency=x;
        }
        if(iM["findable"]){
            AToFind(iM["findable"],x);
        }
		if(iM['use']){//this will be false if undefined
			//push to "useable"  array
            //then function call to add the item and stats to 'comsumableStats' 
		}
        if(iM['equip']){
            //push to "equipable" array
        }
	}
}
function AToFind(props,name){//props is an array, name is a string.
    allItems[name]=props;
}
