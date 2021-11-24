//FILE START!
/*TODO: stuff to do list:
URGENT:
HIGH: make it so that you can't throw spears through walls. optimism display inventory.
MEDIUM: optimism everything, work on the shop.
LOW: rework attack functions (defense formula, wording, a few other things.)
VERY LOW: rework how locations are read and stored.
		*/
		//items are gonna need overhauled at some point.
		var entLocs = []//each entry will be a corrdinate string. Entries will be where the location of all the enemies and items are.  
		const AllItems = [];//might remove at some point, since we don't need this anymore for item spawns.
		//the chance of getting 5 gold coins is the same as the chance as getting 
		//rarites in ascending order: basic=5, common=4, uncommon=3, rare=2, legendary=1. property value format: [rarity,max amount]
		//see GIFL for more details on what the rarity value for each property does.
		//An object contaning the name and rarity, and amount of every (findable) item possible.
		const equipable = [];//array containing the name of every item that is equipable.
		const useable = [];//array containing the name of every item that is usable
		const inventory = {
			
		}
		const equipment = {//might need to overhaul how items work before i can do this.
			mainHand:{
				name:"empty",
			},
			offHand:{
				name:"empty",
			},
			chest:{
				name:"empty",
			},
			head:{
				name:"empty",
			},
		};
		function equipEquipment(equiping){//equipment is a string, TODO: rework it to accept an array.
			let temp=itemStats[equiping];
			if(temp["slot"]=="2Hands"){//have to hardcode the 2 hand equip
				if(equipment.offHand.name!="empty"||equipment.mainHand.name!="empty"){
					return;//something is already equiped
				}
				equipment.mainHand=itemStats.getStats(equiping);
				equipment.offHand["name"]="FULL";
			} else {//reworked so that it only needs to check for
				if(equipment[temp["slot"]]==undefined){//if someone codes wrong.
					console.error("ERROR: attempted to equip "+equiping+" to notexistant slot: "+temp["slot"]+".")
					return;//code will break since the slot value is invalid.
				}
				if(equipment[temp["slot"]].name!="empty"){
					return;//something is already equiped
				}
				equipment[temp["slot"]]=itemStats.getStats(equiping);
			}
			inventory[equiping]-=1;
			TtC("You equip the "+equiping+".");
			displayInvent();
			displayEquipment();
			player.updateStats();
		}
		function displayEquipment(){//makes the equipment display display equipment.
			for(x in equipment){
				let equipDisplay=document.getElementById(x + " slot");
				equipDisplay.innerHTML="";//need to clear it.
				if(equipment[x].name=="empty"){
					equipDisplay.innerHTML+="empty";
					continue;
				} else if(equipment[x].name=="FULL"){//this should only accord when a 2 hand item is equiped, at least for now.
					equipDisplay.innerHTML+="("+equipment.mainHand.name+")";
					continue;
				}else{
					for(y in equipment[x]){
						equipDisplay.innerHTML+=y+" : "+equipment[x][y]+"<br>";
					}
					equipDisplay.innerHTML+="<span span class='E' onClick='unequip(\""+x+"\")'>Unequip?";
				}
			}
		}
		function unequip(eSlot){
			let temp=equipment[eSlot].name;
			if(itemStats[temp].slot=="2Hands"){
				for(x in equipment.offHand){
					delete equipment.offHand[x]
				}
				for(x in equipment.mainHand){
					delete equipment.mainHand[x]
				}
				equipment.offHand.name="empty";
				equipment.mainHand.name="empty";
			} else {
				for(x in equipment[eSlot]){
					delete equipment[eSlot][x];
				}
				equipment[eSlot].name="empty";
			}
			if(typeof(inventory[temp])=="undefined"){//check if we already have this.
				inventory[temp]=1;
			}else{
				inventory[temp]+=1;
			}
			TtC("You unequip the "+temp+".");
			displayInvent();
			displayEquipment();
			player.updateStats();
		}
		class treasure{
			constructor(location,contents,amount,locked){
				this.location = location;
				this.contents = contents;//string or an object, figure that out at some point.
				this.amount = amount;
				//this.locked = locked;//unused
				this.getItem = function(){
					if(this.amount==1){
						TtC("you found a "+this.contents+".")
					}else{
						TtC("you found "+this.amount+" "+this.contents+"s.");//change this to log at the bottom console
					}
					setBGColor(this.location,"white");
					entLocs.splice(entLocs.indexOf(this.location),1);
					this.location = null;
					addToInventory(this.contents,this.amount);
				}
			}
		}
		class enemy{
			constructor(name,Mhealth,attack,defense,table){
				this.name = name;//string
				this.location = location;//string
				this.Mhealth = Mhealth;//number
				this.health = Mhealth; //health starts equal to max health.
				this.attack = attack; //number
				this.defense = defense; //number
				this.table = table;
				this.hurt = function(damg,retal=true){//retal is short for retaliate.
					let temp = 0;
					if(damg>0){//if damage is negative, ignore defense, since it is likely healing.
					temp = Math.ceil(damg-(this.defense/2))//current defense calucation formula, will likely change it.
					if(temp<=0){
						TtC("The "+this.name+"'s armor completely protects them from harm!")
						if(retal==true){this.fight();}//skip to attack
						return;//nothing else to do.
					}
					} else{
						temp = damg
					}
					//probably some check for special attributes, oh and also defense
					//if the enemy doesn't have "health" which can be determined by checking max health, call a special function.
					this.health-=temp;
					if(temp>0){
						TtC("The "+this.name+" takes "+temp+" damage!");
					} else{
						TtC("The "+this.name+" heals "+(-temp)+" health!");//TODO: reword this.
					}
					if(this.health>this.Mhealth){//this function can be used for healing too.
						this.health=this.Mhealth;
					} else if(this.health<=0){
						this.dead()
						return;//need to early return because otherwise attack runs.
					}
					if(retal==true){this.fight();}
				}
				this.dead = function(){
					TtC(this.name+" has been defeated.");
                    try{
						let temp = dropLoot(this.table);
						if(temp===null){//drop nothing

						}else{
							if(temp[1]>1){
								TtC("The "+this.name+" dropped: "+temp[1]+" "+temp[0]+"s.")
							} else{
								TtC("The "+this.name+" dropped: one "+temp[0]+".")//TODO: merge this and the temp = string one.
							}
							addToInventory(temp);//addToInventory can convert this to the proper format.
						}
					} catch {
						console.error("ERROR: function, dropLoot failed.")
					}
					setBGColor(this.location,"white");
					entLocs.splice(entLocs.indexOf(this.location),1);
					this.location = null;
				}
				this.fight = function(){//might make it able to attack anyone.
					if(this.attack==0){
						return;//early exit in case the enemy can't attack.
					}
						player.hurtPlayer(this.attack);
				}
			}
		}
        function playerDead(){
			player.health=0;
			updateHealth();//set health to Zero and display it.
            TtC("<span style='position:relative;background-color:black;color:white;Z-index:110;'>You have died.</span>");
			document.getElementById("sCover").style.zIndex="100";//bring it to the front so everything you can click can not be used.
			document.body.onkeydown = function(){};//empty the function
			setTimeout(coverScreen,2000);
			setTimeout(function(){
				while(true){//gonna rework this so that you can answer with the alerts.
					let temp = prompt("Would you like to 'restart' or 'return' to the title screen?");
					if(temp=="restart"){
						clearVars();
						document.body.onkeydown = function(){keyPress()};
						startGame();
						unCover();
						return;
					} else if(temp=="return"){
						clearVars();
						document.body.onkeydown = function(){keyPress()};
						try{
              				location.href="titleToGame.html"
						}catch{
							console.error("tileScreen does not exist, restarting...");
							startGame();
							unCover();
						}
						return;
					} else {
						alert("please answer the question.");
					}
				}
			},10000);
        }
		let interv;//for holding the interval function
		function coverScreen(){
			interv = setInterval(covering,50);
		}
		function covering(){
			let styler = document.getElementById("sCover").style;
			let opac = parseFloat(styler.opacity)+.01;
			styler.opacity = opac;
			if(opac >= 1){
				clearInterval(interv);
				return;
			}
			
		}
		function unCover(){
			document.getElementById("sCover").style.opacity=0;
			document.getElementById("sCover").style.zIndex="-10";//send it to the back.
			opac=0;
		}
		function Die(){//should instantly (and always), instantly kill the player.
			player.hurtPlayer(1000);
		}
        function clearVars(){//more accurate name would be "resetVars" but i'm too lazy to change the name back.
            eList.splice(0,eList.length);//clear eList
            level=1;
            entLocs = [];//clear entLocs
            for(x in inventory){
                delete inventory[x];
            }
            for(x in equipment){
                for(y in equipment[x]){//this is needed so that we don't delete the slots themselves and break everything.
                    delete equipment[x][y];
                }
				equipment[x].name="empty"//equipment breaks if we don't do this.
            }
            for(x in iList){
                iList[i]["location"]=null;
            }
            walls.splice(0,walls.length-1);//probably don't need to, but just in case.
			displayInvent();//so that the inventory display actually clears.
            player.updateStats();//since equipment was cleared, this should reset to default stats.
            player.health=100;//should be a full heal.
            conDis.innerHTML="";//clear the console.
        }
			const player = {//could probably move the location variable here but that would be kinda annoying.
				attack:1,//default values, attack should never go below 1 while alive.
				defense:0,//TODO: make this actually do stuff.
				Mhealth:100,
				health:100,
				special:null,//null means none
				hurtPlayer:function(damg){//this could be its own function but its easier to call the variables here.
					//defense and special attribute checks go here.
					//debugger;
					let temp = 0;
					if(damg>0){
					temp = Math.ceil(damg-(this.defense/2))//current defense calucation formula, will likely change it.
					if(temp<=0){
						TtC("Your armor completely protects you from harm!")
						updateHealth()
						return;//no damage to deal, skip to end.
					}
					} else{//if damage is negative, ignore defense.
						temp = damg
					}
					this.health-=temp;
					if(temp>0){
						TtC("you take "+temp+" damage!");
					} else{
						TtC("you heal "+(-temp)+" health.");//TODO: reword this.
					}
					if(this.health>this.Mhealth){//this function can be used for healing, so we need to check for this edge case.
						this.health=this.Mhealth;
					} else if(this.health<=0){
						playerDead();
						return;
					}
					updateHealth()
			},
			updateStats:function(){
				this.attack = 1;
				this.defense = 0;
				this.Mhealth = 100;//default values
				this.special = null;//we have no way of editing this currently but i'll leave it here.
				for (x in equipment){
					for(y in equipment[x]){//reads every property of every slot
						if(equipment[x][y]=="empty"){
							continue;
						}
						this[y]+=equipment[x][y];
					}
				}
				for(x in player){
					if(typeof(x)=="undefined"){
						console.error("stat became invalid, printing stat logs:");
						console.log(this.attack);
						console.log(this.defense);
						console.log(this.Mhealth);
						console.log("reseting values to default:")
						this.attack = 1;
						this.defense = 0;
						this.Mhealth = 100;
						this.special = null;
					}
				}
				if(this.health>this.Mhealth){
					this.health=this.Mhealth;
				} 
				updateStatistics()
			}
		}
		//classes above, objects and functions below:
		function mkOtherStuff(){
			placeItems();
			updateStatistics();
			updateInfo();
		}
		function updateInfo(){
			document.getElementById("levelDis").innerHTML = level;
		}
		function placeItems(){
			entLocs = [];//clear entLocs
			let RNG = Math.floor(Math.random()*(iList.length));
			for(i=0;i<RNG;i++){//should set all the items.
				let temp=eGIFL();
				iList[i]["contents"] = temp[0];
				iList[i]["amount"] = temp[1];
				temp = getCorrdInGrid();
				while(temp==startPoint||temp==exitPoint||walls.indexOf(temp)!=-1||entLocs.indexOf(temp)!=-1){
					temp  = getCorrdInGrid();
				}
				iList[i]["location"] = temp;
				entLocs.push(temp);
				setBGColor(temp,"gold");
			}
			placeEnemies();
		}
		function placeEnemies(){//
			let RNG = Math.floor(Math.random()*5)+1;//set to 1-5
			eList.splice(0,eList.length);//clear eList
			//TODO: rework the RNG formulas so that it becomes harder as you get to lower floors.
			for(let i=0;i<RNG;i++){
				let color=GEFL();
				eList[i]["health"]=eList[i]["Mhealth"];//full heal.
				let temp = getCorrdInGrid();
				while(temp==startPoint||temp==exitPoint||walls.indexOf(temp)!=-1||entLocs.indexOf(temp)!=-1){//goblins can place themselves on the exit tile, which should be impossible
					temp  = getCorrdInGrid();
				}
				eList[i]["location"]=temp;
				entLocs.push(temp);
				setBGColor(temp,color);
			}
		}
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
			for(x in temp){
				arrayT.push(x);//adds every enemy in the list to the array.
			}//still don't have it so that it factors the chance in properly.
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
		}//this will need to be overhauled if i want to make it get harder as time goes on.
		function GIFL(){//get item from list
			let temp = []
			for(x in AllItems){//for every item in AllItems
				for(let i=0;i<AllItems[x][0];i++){//get the rarity, then...
					temp.push(x);//add the item a certain amount of items in accordance with the rarity value.
				}
			}
			return temp[Math.floor(Math.random()*temp.length)];//then get a random item from the rarity weighted list.
		}
		function collectOrCombat(){//too lazy to change the name even if have of it isn't here.
			for(let i=0;i<iList.length;i++){
				if(iList[i]["location"]==playerLoc){
					iList[i].getItem();
				}
			}
		}
		//make the items and enemies be in an array, this will allow for loop calling, which is must easier to expand.
		function addToInventory(item,amount=1){//self explainitory
			if(typeof(item)=="object"){
				amount=item[1];
				item=item[0];
			} 
			if(typeof(item)!="string"){
				console.error("ERROR: invalid type for argument 'item', type should be string or array.")
				return;//can't work with an invalid variable type.
			}
			if(typeof(inventory[item])=="undefined"){
				inventory[item]=amount;
			}else{
			inventory[item]+=amount;
			}
			try{
				displayInvent()
			} catch {

			}
		}
		function equipItem(item){
			try{//incase equipConstructors gets removed.
				if((typeof(itemStats[item])=="undefined")||(typeof(itemStats[item])!="object")){//second check would be false for arrays, since they are objects.
					console.error("attempted to equip a nonexistant/unequipable item.");
					console.log("invalid item entry:")
					console.log(item)
					return;//early exit since rest of code would break otherwise.
				}
				equipEquipment(item);
			} catch {
				console.error("couldn't find equipConstructors.js");
				return;
			}
		}
		function useItem(item,victim=playerLoc){
			try{
				if((typeof(comsumableStats[item])=="undefined")||(typeof(comsumableStats[item])!="object")){
					console.error("attempted to use a nonexistant/unuseable item.");
					console.log("invalid item entry:")
					console.log(item)
				}
				inventory[item]-=1;
				//TtC("You use the "+item+"."); //moved to next function.
				comsumableStats.useItem(item,victim);
				displayInvent();
			} catch {
				console.error("couldn't find equipConstructors.js");
				return;
			}
		}
		const eList = [];
		const iList = [new treasure(null),new treasure(null),new treasure(null),new treasure(null),new treasure(null),new treasure(null)];
		const inDis= document.getElementById("inventDisplay");
    	function displayInvent(){
			inDis.innerHTML = "";
    		for (x in inventory){
				if(inventory[x]<=0){//there shouldn't be a negative amount of an item, but there can be less than 0 of an item.
					delete inventory[x];
					continue;
				}else if(inventory[x]==NaN){//null check
					console.error("value of "+x+" was equal to NaN, removing...")
					delete inventory[x];
					continue;//rest will break if we don't restart.
				}
				if(inventory[x]!=1){
					if(equipable.indexOf(x)!=-1&&useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\' class='G' onClick='equipItem(\""+x+"\")' draggable='true' >"+inventory[x] + " " + x+"s</span><br>";
					}else if(equipable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\' class='E' onClick='equipItem(\""+x+"\")' draggable='true' >"+inventory[x] + " " + x+"s</span><br>";
					} else if(useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\'class='U' onClick='useItem(\""+x+"\",playerLoc)' draggable='true'>"+inventory[x] + " " + x+"s</span><br>";
					} else {
						inDis.innerHTML += "<span>"+inventory[x] + " " + x+"s</span><br>";
					}
				}else{
					if(equipable.indexOf(x)!=-1&&useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\' draggable='true' onClick='equipItem(\""+x+"\")' class='G' >"+inventory[x] + " " + x+"</span><br>";
					}else if(equipable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\' draggable='true' onClick='equipItem(\""+x+"\")' class='E' >"+inventory[x] + " " + x+"</span><br>";
					} else if(useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span id=\'"+x+"\' class='U' onClick='useItem(\""+x+"\",playerLoc)' draggable='true'>"+inventory[x] + " " + x+"</span><br>";
					} else {
						inDis.innerHTML += "<span>"+inventory[x] + " " + x+"</span><br>";
					}
				}
      		}
    	}
		const conDis=document.getElementById("console")
		function TtC(string){//Text to Console; adds text to the console.
			conDis.innerHTML+=string;
			conDis.innerHTML+="<br>";//auto adds text to the next line.
			conDis.scrollTo(0,999999999999)//scrolls to the bottom of the console, first zero is horizontal scroll.
			//theres probably a better way to make it scroll to the bottom of the console, but this will do.
		}
		function clearConsole(){
			conDis.innerHTML="";//removes all the text in the console.
		}
		const healthDis = document.getElementById("health")
		const MhealthDis = document.getElementById("Mhealth")
		const attackDis = document.getElementById("attack")
		const defenseDis = document.getElementById("defense")
		function updateStatistics(){//fixes the stat display, should be called when an item is equiped
			updateHealth();
			attackDis.innerHTML = player.attack;
			defenseDis.innerHTML = player.defense;
		}
		function updateHealth(){//we only need to update this when the player is hurt
			healthDis.innerHTML = player.health;
			MhealthDis.innerHTML = player.Mhealth;
		}