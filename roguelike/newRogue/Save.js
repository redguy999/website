function storageCheck(){
    if(typeof(Storage) !== "undefined"){
        
    } else {
        alert("FATAL ERROR: your computer has blocked/is unable to use local storage, data can not be saved.")
        throw "this error is suppose to happen."
    }
}
function saveData(){
    storageCheck()
    localStorage.grid = {}
    for(x in gridObj){
        for(y in gridObj[x]){
            let ref = gridObj[x][y]
            if(!ref.content){//this is true if the tile contains nothing.
                if(ref.dis.style.backgroundColor=="green"){//run these checks
                    localStorage.grid[(x)+","+y]="start";
                }else if(ref.dis.style.backgroundColor=="red"){
                    localStorage.grid[(x)+","+y]="end";
                } else {
                    continue;//we don't need to save empty tiles, since if the data doesn't exist we can just assume its empty.
                }
            } else {
                if(typeof(ref.content)=="string"){//should only be true if its a wall.
                    localStorage.grid[x+","+y]="wall"
                } else if(ref.content.name){//is true if this is an enemy
                    localStorage.grid[x+","+y]="E"+ref.content.health+","+ref.content.name;
                    //the rest of the enemy information doesn't need saved since the stats are the same for every enemy of a certain type.
                } else if(ref.content.contents){//Is true if the tile contains an item.
                    localStorage.grid[x+","+y]="I"+ref.content.amount+","+ref.content.contents
                }
            }
        }
    }//grid has been saved.
    localStorage.pLoc=playerLoc//location of player has been saved.
    if(player){//does player object exist?
        localStorage.pHP=player.health
    }
    if(inventory){//does inventory exist?
        localStorage.invent=inventory;//save it.
        //this will need to be changed so it saves the values in the inventory
    }
    //below is the sanity check
    if(localStorage.pLoc!=playerLoc){
        alert("ERROR: Something went wrong when saving.")
        throw "Something went wrong when saving."
    }
}
function loadData(){
    storageCheck();
    if(!localStorage.grid){//this is true if it can't find the data.
        alert("ERROR: data not found.");
        throw "Something went wrong when loading."
    }
    while(true){
        let temp = prompt("NOTICE: loading previous game data will delete all current progress, this action can not be undone. (enter 'Y' to continue loading the data or enter 'N' to not load the data)")
        if(temp=="Y"){
            alert("loading data... (press okay to continue)")
            break;
        } else if(temp=="N"){
            alert("canceling load... (press okay to continue)")
            return;
        }
        alert("please answer the question. (press okay to restate the question)")
    }
    clearGrid();
    if(inventory){//some testing versions might not have inventory.
        inventory={}
    }
    for(x in localStorage.grid){
        let hold = x.split(",");
        var ref = gridObj[hold[0]][hold[1]]
        if(typeof(localStorage.grid[x])=="object"){
            if(localStorage.grid[x][0]==="I"){
                let temp = localStorage.grid[x].slice(1).split(",")
                let eHold = enemies[temp[1]];
                ref.dis.style.backgroundColor = eHold.color;
                ref.content = new enemy(temp[1], eHold.hp, eHold.atk, eHold.def, ref);
                ref.content.health = temp[0]
            }else if(localStorage.grid[x][0]==="E"){
                let temp = localStorage.grid[x].slice(1)   
                ref.content = new treasure(GIFL(),2,ref)
                ref.dis.style.backgroundColor = "gold";
            }
        } else {
            if(localStorage.grid[x]=="wall"){
                setWall(ref)
            } else if(localStorage.grid[x]=="start"){
                ref.dis.style.backgroundColor = "green";
            } else if(localStorage.grid[x]=="end"){
                ref.dis.style.backgroundColor = "red";
            }
        }
    }
    playerLoc=localStorage.pLoc;
    if(player){//does player object exist?
       player.health=localStorage.pHP
    }
    if(localStorage.invent){//does inventory exist?
        inventory=localStorage.invent;//load it.
    }
}