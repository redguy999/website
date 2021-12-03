const grid={}//in theory could be an array of arrays, but then the index values would all be off by one, which is a problem.
let hT = 9//number of columns of tiles, AKA the max x value.
let wT = 10	//number of rows of tiles, AKA the max y value.
function mkGrid(){//makes the grid in the grid const above.
    for(x=1;x<=hT;x++){
        grid[x]={}
        for(y=1;y<=wT;y++){
            grid[x][y]="empty"
        }
    }
}
mkGrid()
function setRow(row,arg){//runs a function over every tile in a given row.
    for(x in grid[row]){//notice, 'x' will be the index value of the tiles in the row.
        arg(x);
    }
}
setRow(2,function(J){//setRow test
    grid[2][J]="wall"
})
function setColumn(column,arg){//runs a function over every tile in a given column.
    for(x in grid){//notice, 'x' will be the index value of a tile in the row.
        arg(x)
    }
}
setColumn(3,function(J){
    grid[J][3]='door'
})
console.log(grid[2]);