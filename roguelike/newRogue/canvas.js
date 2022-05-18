const canvas=document.getElementsByClassName("gScreen")[1]//get element by name didn't work so i'm trying this.
var artBoard = canvas.getContext("2d")
var rowWid=canvas.width/rows;
var columnWid=canvas.height/columns;
var VRM= 1; //visibilty radius multipler
function drawVisCircle(){//draws the visibilty circle
    artBoard.fillStyle="black";
    let temp = playerLoc.split(",");
    let tempY = rowWid*temp[1]-rowWid/2;
    let tempX = columnWid*temp[0]-columnWid/2;	
    artBoard.beginPath();
    artBoard.clearRect(canvas.width,0,-canvas.width,canvas.width);
    //gradiant code starts
    var grad = artBoard.createRadialGradient(tempX,tempY,60*VRM,tempX,tempY,120*VRM)
    grad.addColorStop("0","rgba(0,0,0,0)")
    grad.addColorStop("1","rgba(0,0,0,1")
    artBoard.fillStyle=grad
    //gradiant code ends.
    artBoard.rect(canvas.width, 0, -canvas.width, canvas.width);
    artBoard.fill();
}
function clearCanvas(){//for removing the cover
    artBoard.clearRect(canvas.width,0,-canvas.width,canvas.width);
}