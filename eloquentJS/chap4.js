function exercise3(){
    document.getElementById("c")["innerHTML"]+=" (check console)"
    function range(start,end,step=1){//both parameters are numbers, second must be the bigger number.
        var valuRange = []
        for(i=start;i<=end;i+=step){
            valuRange.push(i)
        }
        return valuRange
    }
    function sum(numArr){//parameter must be an array
        var total = 0;
        for(x of numArr){
            total+=x;
        }
        return total;
    }   
    console.log(sum(range(1,10)));
    console.log(range(1, 10));
    console.log(range(5, 2, -1));
    function arrayToList(arr){
        var List={}
        for(x of arr){
            var reff = List//get the list
            while(reff["rest"]!==undefined){//get the last part of the list
                reff=reff.rest
            }
            reff.value=x;
            reff.rest={};
        }
        reff.rest=null;
        return List;
    }
    function listToArray(list){
        var arr=[list.value];//get the first value of the list
        var reff=list;
        while(reff.rest!==null){
            reff=reff.rest
            arr.push(reff.value)
        }
        return arr;
    }
    function nth(list,posit){//'list' object, number
        var reff = list
        for(i=0;i<posit;i++){//if posit is zero, this will instantly skip to the end return statement.
            if(reff.rest===null){
                return undefined;//we've run out of list to check. thus it is undefined
            }
            reff=reff.rest;
        }
        return reff.value
    }
    function deepEqual(val1,val2){
        if(val1===val2){//in case they are litterally the same thing.
            return true;
        }
        if(val1===null||val2===null){
            return false;//fail safe early exit.
        }
        if(typeof(val1)==="object"&&typeof(val2)==="object"){//== would also work but for consistency, i did ===
            for(x in val1){
                if(val2[x]===undefined){
                    return false;//a property in object 1 is not in object 2, thus there can't possibly be the same.
                } else if(typeof(val1[x])=="object"&&typeof(val2[x])=="object"){//are the properties objects?
                    if(!deepEqual(val1[x],val2[x])){//if deepEqual is false, then they're not the same.
                        return false
                    } else {
                        continue;
                    }
                } else if(val2[x]===val1[x]){//are they the same value?
                    continue;//onto the next thing.
                }
                return false;//they are not the same thing, if it reaches this if statement.
            }
        }
        return true;
    }
    console.log(arrayToList([10,20]))
    console.log(listToArray(arrayToList([10,20,30])))
    console.log(nth(arrayToList([10,20,30]),2))
    let obj = {here: {is: "an"}, object: 2};
    console.log(deepEqual(obj, obj));
    console.log(deepEqual(obj, {here: 1, object: 2}));
    console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
}