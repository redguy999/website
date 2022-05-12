const dGrid = document.getElementById("displayGrid")
const aGrid = document.getElementById("actionGrid")
const gridObj = {}//While this could be an array, the 0th index would mess everything up.
//might remove gridObj
const rows = 9
const columns = 8
var playerLoc = "1,1"
function mkGrid() {//!!VERY IMPORTANT
    aGrid.innerHTML = ""
    dGrid.innerHTML = ""//clears the grids, in case theres anything in them.
    let rowing = 100 / rows
    let coling = 100 / columns
    for (let y = 1; y <= rows; y++) {//creates all the divs.
        aGrid.style.gridTemplateRows += rowing + "% "
        dGrid.style.gridTemplateRows += rowing + "% "//also sets the grid templates correctly
        for (let x = 1; x <= columns; x++) {
            if (y == 1) {
                aGrid.style.gridTemplateColumns += coling + "% "
                dGrid.style.gridTemplateColumns += coling + "% "
            }
            dGrid.innerHTML += "<div id='d" + x + "," + y + "'></div>"
            aGrid.innerHTML += "<div id='" + x + "," + y + "'></div>"
        }
    }
    for (let i = 1; i <= columns; i++) {//the colums and rows have to be created in the reverse order, so we can't do this while making the divs.
        gridObj[i] = {}
    }
    for (x in gridObj) {//creates the rest of the javascript object.
        for (let i = 1; i <= rows; i++) {
            gridObj[x][i] = {
                "dis": document.getElementById("d" + x + "," + i),
                'act': document.getElementById(x + "," + i),
                'content': "",//should either be a string or an enemy object or an item object
                'loc': x + "," + i,//so that the corrdinate is easily accessible
            }
        }
    }
}

