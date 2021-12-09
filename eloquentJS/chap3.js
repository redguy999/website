function minOf(){
    var low = arguments[0];//gets the first argument given.
    for(x of arguments){//"x" = one of the given arguments
        if(low>x){
            low = x
        }//if this check fails, just go to the next number
    }
    return low
}
//console.log(minOf(0,10,1,-10,1111111,9999999))
function isEven(num){
    if(num<0){//is it negative?
        //if true, make it positive
        num=Math.abs(num);//absolute value of an even number is even, same for an odd number.
    }//otherwise, continue.
    if(num==0){
        return true;
    } else if(num==1){
        return false;
    }else{
        return isEven(num-2);
    }
}
// console.log(isEven(50));
// console.log(isEven(75));
// console.log(isEven(-1));
function countBs(str){
    var count=0;
    for(x of str){//'x'=one of the characters in the given string.
        if(x==="B"){
            count++
        }
    }
    return count;
}
// console.log(countBs("BBC"));
function countChar(str,match){
    var count=0;
    for(x of str){
        if(x==match){
            count++;
        }
    }
    return count;
}
// console.log(countChar("kakkerlak", "k"));
function exercise2(){
    document.getElementById("b")["innerHTML"]+=" (check console)"
    console.log(minOf(0,10,1,-10,1111111,9999999))
    console.log(isEven(50));
    console.log(isEven(75));
    console.log(isEven(-1));
    console.log(countBs("BBC"));
    console.log(countChar("kakkerlak", "k"));
}