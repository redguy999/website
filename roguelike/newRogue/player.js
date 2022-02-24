const inventory = {//player's inventory.

}
const player = {//could probably move the location variable here but that would be kinda annoying.
    attack: 1,//default values, attack should never go below 1 while alive.
    defense: 0,//TODO: make this actually do stuff.
    Mhealth: 100,
    health: 100,
    special: null,//null means none
    inventory:{
        
    },
    hurtPlayer: function (damg) {//this could be its own function but its easier to call the variables here.
        //defense and special attribute checks go here.
        //debugger;
        let temp = 0;
        if (damg > 0) {
            temp = Math.ceil(damg - (this.defense / 2))//current defense calucation formula, will likely change it.
            if (temp <= 0) {
                TtC("Your armor completely protects you from harm!")
                updateHealth()
                return;//no damage to deal, skip to end.
            }
        } else {//if damage is negative, ignore defense.
            temp = damg
        }
        this.health -= temp;
        if (temp > 0) {
            TtC("You take " + temp + " damage!");
        } else {
            TtC("You heal " + (-temp) + " health.");//TODO: reword this.
        }
        if (this.health > this.Mhealth) {//this function can be used for healing, so we need to check for this edge case.
            this.health = this.Mhealth;
        } else if (this.health <= 0) {
            playerDead();
            return;
        }
        updateHealth()
    },
    updateStats: function () {
        this.attack = 1;
        this.defense = 0;
        this.Mhealth = 100;//default values
        this.special = null;//we have no way of editing this currently but i'll leave it here.
        for (x in equipment) {
            for (y in equipment[x]) {//reads every property of every slot
                if (equipment[x][y] == "empty") {//there's nothing here.
                    continue;//TODO:
                }
                this[y] += equipment[x][y];
            }
        }
        for (x in player) {//sanity check
            if (typeof (x) == "undefined") {
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
        if (this.health > this.Mhealth) {
            this.health = this.Mhealth;
        }
        updateStatistics();
    },
    forceKill: function () {//debug function for game over screen.
        this.health=0;
        this.death();
    },
    death:function(){
        //insert playerDead() from the old code here.
    }
}