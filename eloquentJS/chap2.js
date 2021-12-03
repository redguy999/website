function exercise1() {
    document.getElementById("a")["innerHTML"]="Chapter two (check console)"
    console.log("logging triangle:")
    var Hold = ""
    for (let i = 0; i < 7; i++) {
        Hold += "#";
        console.log(Hold);
    }
    Hold = ""
    console.log("logging FizzBuzz")
    for (let i = 1; i <= 100; i++) {
        Hold = ""//clear it
        if (i % 3 === 0) {
            Hold += "Fizz";
        }
        if (i % 5 === 0) {
            Hold += "Buzz";
        }
        if (!Hold) {//will be true if Hold is an empty string.
            Hold = i;
        }
        console.log(Hold)
    }
    Hold = "";
    var size=8
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if ((y+x)%2===0) {//true if y is even (except maybe if y is negative but we aren't dealing with those.)
                Hold += " "
            } else {
                Hold += "#"
            }
        }
        Hold += "\n"
    }
    console.log(Hold)
}