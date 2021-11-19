//!!undefined === false
const currency = "";
const everySingleItem = {
	"gold coin":{
		currency:true,//for the item that we want to be the currency
	},
	findableItem:{
		findable:true,//just don’t list this if false
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
	//continue for every item.
}
function seteveryItems(){
	for(x in everySingleItem){
		let iM = everySingleItem[x]//makes it easier to call
        if(iM["currency"]){
            currency=x;
        }
        if(iM["findable"]){
            //push to the "AllItems" array
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
