//FILE START!
/*TODO: stuff to do list:
URGENT:
HIGH:
MEDIUM: optimism everything.
LOW: rework attacking (i forgot why i wanted to do this)
VERY LOW: rework how locations are read and stored.
		*/
		//items are gonna need overhauled at some point.
		var entLocs = []//each entry will be a corrdinate string. Entries will be where the location of all the enemies and items are.  
		const AllItems = ["gold coin","sword","shield","spear","potion"];//array contaning the name of every (findable) item possible.
		const equipable = ["sword","shield","spear"];//array containing the name of every item that is equipable.
		const useable = ["potion"];//array containing the name of every item that is usable
		const inventory = {
			
		}
		const equipment = {//might need to overhaul how items work before i can do this.
			mainHand:{
				name:"empty"
			},
			offHand:{
				name:"empty"
			},
			equipEquipment:function(equipment){//equipment is a string
				/*debugger*/;
				let temp=itemStats[equipment];
				switch (temp["slot"]) {
					case "mainHand":
						if(this.mainHand.name!="empty"){
							return;//something is already equiped
						}
						this.mainHand=itemStats.getStats(equipment);
						break;
					case "offHand":
						if(this.offHand.name!="empty"){
							return;//something is already equiped
						}
						this.offHand=itemStats.getStats(equipment);
						break;
					case "2Hands":
						if(this.offHand.name!="empty"||this.mainHand.name!="empty"){
							return;//something is already equiped
						}
						this.mainHand=itemStats.getStats(equipment);
						this.offHand["name"]="FULL"
						break;
					default:
						console.error("invalid slot setting for"+equipment)
						return;
				}
				inventory[equipment]-=1;
				TtC("You equip the "+equipment);
				displayInvent();
				displayEquipment();
				player.updateStats();
			},
		};
		var equipDisplay=document.getElementById("equipDisplay");
		function displayEquipment(){//this needs overhauled if we want to add more slots. for in should help.
			//this could be turned into a nested for in loops, but a dictonary object would be required
			equipDisplay.innerHTML="";//need to clear it.
			equipDisplay.innerHTML+="Main hand item:<br>";//might change this, but this will work for now.
			//debugger;
			for(x in equipment.mainHand){
				if(equipment["mainHand"].name=="empty"){
					equipDisplay.innerHTML+="empty";
					break;//we can just early exit since there shouldn't be anything else to read.
				}
				equipDisplay.innerHTML+=x+" : "+equipment.mainHand[x]+"<br>";
			}
			if(equipment["mainHand"].name!="empty"){
				equipDisplay.innerHTML+="<span span class='E' onClick='unequip(\"mainHand\")'>Unequip?"
			}
			equipDisplay.innerHTML+="<br>Off hand item:<br>";
			for(x in equipment.offHand){
				if(equipment["offHand"].name=="FULL"){//this only accords if an item is equiped in 2Hands.
					equipDisplay.innerHTML+="("+equipment.mainHand.name+")<br>";//might need to overhaul how 2 slot equipment works if we want to change this to work with different slots.
					break;//early exit since we don't need to read it.
				} else if(equipment.offHand.name=="empty"){
					equipDisplay.innerHTML+="empty";
					break;//we can just early exit since there shouldn't be anything else to read.
				}
				equipDisplay.innerHTML+=x+" : "+equipment.offHand[x]+"<br>";
			} 
			if(equipment["offHand"].name!="empty"&&equipment["offHand"].name!="FULL"){//i think this works.
				equipDisplay.innerHTML+="<span span class='E' onClick='unequip(\"offHand\")'>Unequip?"
			}
		}
		function unequip(slot){
			let temp=equipment[slot].name;
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
				for(x in equipment[slot]){
					delete equipment[slot][x];
				}
				equipment[slot].name="empty";
			}
			if(typeof(inventory[temp])=="undefined"){
				inventory[temp]=1;
			}else{
				inventory[temp]+=1;
			}
			TtC("You unequip the "+temp);
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
			constructor(name,Mhealth,attack,defense,special=null){
				this.name = name;//string
				this.location = location;//string
				this.Mhealth = Mhealth;//number
				this.health = Mhealth; //health starts equal to max health.
				this.attack = attack; //number
				this.defense = defense; //number
				this.special = special;//no clue what this would be. maybe a map. its optional anyway.
				this.hurt = function(damg){
					let temp = 0;
					if(damg>0){//if damage is negative, ignore defense, since it is likely healing.
					temp = Math.ceil(damg-(this.defense/2))//current defense calucation formula, will likely change it.
					if(temp<=0){
						TtC("The "+this.name+"'s armor completely protects them from harm!")
						this.fight();//skip to attack
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
					//TODO: add a way to skip attacking the player in case they're not being attacked.
					this.fight();
				}
				this.dead = function(){
					TtC(this.name+" has been defeated.");
                    try{
						let temp = dropLoot(this.name);
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
        const thisWin = window.self
        function playerDead(){
			player.health=0;
			updateHealth();//set health to Zero and display it.
            TtC("<span style='position:relative;background-color:black;color:white;Z-index:110;'>You have died.</span>");
			document.getElementById("sCover").style.zIndex="100";//bring it to the front so everything you can click can not be used.
			document.body.onkeydown = function(){};//empty the function
            //code for if we want a game over screen and still able to view what the player has would need to be placed above.
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
							returnToTile();
							unCover();
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
		let opac = 0;//for setting the opacity when you die.
		function coverScreen(){
			let styler = document.getElementById("sCover");
			interv = setInterval(covering,50, styler);
		}
		function covering(styler){
			opac += 0.01;
			styler.style.opacity = opac;
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
		function Die(){//admin function for killing the player.
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
            //Mogrid.innerHTML="";//empty the grid.
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
			displayEquipment();
			updateStatistics();
			updateInfo();
		}
		function updateInfo(){
			document.getElementById("levelDis").innerHTML = level;
		}
		function placeItems(){
			entLocs = [];//clear entLocs
			let RNG = Math.floor(Math.random()*(iList.length-1))+1;//1-3 items per floor if iList is length 3
			for(i=0;i<RNG;i++){//should set all the items.
				iList[i]["contents"] = GIFL();
				iList[i]["amount"] = Math.floor(Math.random()*3+1);//need to rework so you can get a lot of coins and not a lot of weapons.
				let temp = getCorrdInGrid();
				while(temp==startPoint||temp==exitPoint||walls.indexOf(temp)!=-1||entLocs.indexOf(temp)!=-1){
					temp  = getCorrdInGrid();
				}
				iList[i]["location"] = temp;
				entLocs.push(temp);
				setBGColor(temp,"gold");
			}
			placeEnemies();
		}
		function placeEnemies(){
			let RNG = Math.floor(Math.random()*6);//0-5 if random*6
			eList.splice(0,eList.length);//clear eList
			//might rework the RNG formulas so that it becomes harder as you get to lower floors.
			//debugger;
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
			let temp = enemies[Math.floor(Math.random()*enemies.length)];//finds a random enemy in the array enemies, which contains every enemy.
			eList.push(new enemy(temp.name,temp.Mhealth,temp.attack,temp.defense))
			return temp.color;
		}
		function GIFL(){//get item from list
			return AllItems[Math.floor(Math.random()*(AllItems.length))];//this won't need changed if the length of AllItems changes.
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
			console.log(inventory);
		}
		function equipItem(item){
			try{//incase equipConstructors gets removed.
				if((typeof(itemStats[item])=="undefined")||(typeof(itemStats[item])!="object")){//second check would be false for arrays, since they are objects.
					console.error("attempted to equip a nonexistant/unequipable item.");
					console.log("invalid item entry:")
					console.log(item)
					return;//early exit since rest of code would break otherwise.
				}
				console.log(itemStats[item]);
				equipment.equipEquipment(item);
			} catch {
				console.error("couldn't find equipConstructors.js");
				return;
			}
		}
		function useItem(item){
			try{
				if((typeof(itemStats[item])=="undefined")||(typeof(itemStats[item])!="object")){
					console.error("attempted to use a nonexistant/unuseable item.");
					console.log("invalid item entry:")
					console.log(item)
				}
				inventory[item]-=1;
				TtC("You use the "+item+".");
				itemStats.useItem(item);
				displayInvent();
			} catch {
				console.error("couldn't find equipConstructors.js");
				return;
			}
		}
		//new enemy("Goblin",10,1,0)
		//new enemy("Armored goblin",15,5,3)
		const eList = [];
		//console.log(eList[1]["health"])//displays the health of the second enemy in the array.
		//eList objects being constructed inside the array is only temporary, that will be moved.
		const iList = [new treasure(null),new treasure(null),new treasure(null),new treasure(null),new treasure(null),new treasure(null)];
		const inDis= document.getElementById("inventDisplay");
    	function displayInvent(){
			///*debugger*/;
			inDis.innerHTML = "";
    		for (x in inventory){
				if(inventory[x]<=0){
					console.log(x+" has been removed.")
					delete inventory[x];
					continue;
				}
				if(inventory[x]!=1){
					if(equipable.indexOf(x)!=-1){
						inDis.innerHTML += "<span class='E' onClick='equipItem(\""+x+"\")'>"+inventory[x] + " " + x+"s</span><br>";
					} else if(useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span class='U' onClick='useItem(\""+x+"\")'>"+inventory[x] + " " + x+"s</span><br>";
					} else {
						inDis.innerHTML += inventory[x] + " " + x+"s<br>";
					}
				}else{
					if(equipable.indexOf(x)!=-1){
						inDis.innerHTML += "<span class='E' onClick='equipItem(\""+x+"\")'>"+inventory[x] + " " + x+"</span><br>";
					} else if(useable.indexOf(x)!=-1){
						inDis.innerHTML += "<span class='U' onClick='useItem(\""+x+"\")'>"+inventory[x] + " " + x+"</span><br>";
					} else {
						inDis.innerHTML += inventory[x] + " " + x+"<br>";
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
		function forceAddItem(item,amount){//for admin use only
			if(typeof(inventory[item])=="undefined"){
				inventory[item]=amount;
			}else{
				inventory[item]+=amount;
			}
			displayInvent();
		}
		function forcePlaceEnemy(eName,corrdinate){//admin function; both parameters are strings.
			debugger;
			let temp = placementInWall(corrdinate)
			if(temp){}else{return;}//this works
			for(x in enemies){
				if(enemies[x].name==eName){
					eList.push(new enemy(temp.name,temp.Mhealth,temp.attack,temp.defense))//adds it to the end of the array, which is important for the next part.
					let LI = eList.length-1;//gets last index of array, which should be the newly added enemy.
					eList[LI]["location"]==corrdinate;
					return;//so that the console error doesn't run.
				}
			}
			console.error("ERROR: enemy name not found in enemy list.")
		}
		function placementInWall(corrdin){//should only be called from an admin function
			if(!checkOoB(corrdin)){//placement check
				console.error("corrdinate out of bounds error, enemy placement impossible, aborting...")
				return false;//enemy can't be validly placed.
			} else if(CVM(corrdin)){//CVM also check for being out of bounds, but we already checked that so that can't be true.
				while(true){
					let temp = prompt("corrdinate is in a wall, your options are: to 'remove' the wall or to 'cancel' enemy placement.")
					if(temp=="remove"){
						walls.splice(walls.indexOf(corrdin),1);//removes the wall on corrdinate, shouldn't error.
						return true;//enemy can now be placed.
					} else if(temp=="cancel"){
						return false;//enemy is no longer being placed.
					}else{
						alert("please answer the prompt correctly.")
					}
				}
			}
			return true;
		}
		function forcePlaceCustomE(){//admin function; it'll just ask for the values in prompts
			let stats = []
			stats.push(prompt("enemy's name:"));
			stats.push(prompt("enemy's max health:"));
			stats.push(prompt("enemy's attack:"));
			stats.push(prompt("enemy's defense:"));
			for(let i=1;i<=3;i++){//skips the first index, which is intentional
				stats[i]=parseInt(stats[i]);
				if(stats[i]==NaN){
					alert("ERROR: invalid variable type, expects: INT for all but name.")
					return;
				}
			}
			eList.push(new enemy(stats[0],stats[1],stats[2],stats[3]));
			let LI = eList.length-1;//gets last index of array, which should be the newly added enemy.
			while(true){
				let tempc = prompt("input corrdinate to place");
				let temp=placementInWall(tempc)
				if(temp===null){
					return;//enemy is no longer being placed.
				}else if(temp){
					eList[LI]["location"]==tempc;
					return;//no need to continue
				}
				alert("invalid corrdinate input")
			}
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
		console.log(document.getElementById("movementGrid").clientHeight);