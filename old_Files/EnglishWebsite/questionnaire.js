var C = 0;//correctly answered questions
var W = 0;//incorrectly answered questions
var Q = 1;//was used to count the number of questions done, now is just used to help go from question to question
var cDone = 0;//increase by one every time a cabinet is completed.
var Given;
var CabinetCount = 0;
var cabinet = "" //Y is yellow, O is orange, R is red, , P is purple, B is blue.
var open = 0//set to 1 when a cabinet is selected, set to 0 when a cabinet is finished.
var CabY = false;
var CabB = false;
var CabR = false;
var CabO = false;
var CabP = false;
var Position = 0;
function start(){
    let t=1;
while(t<6){
    let t2 = "YQ";
    t2=t2+t;
document.getElementById(t2).style.display = "none";
t++;
}
t=1;
while(t<5){
    let t2 = "OQ";
    t2=t2+t;
document.getElementById(t2).style.display = "none";
t++;
}
t=1;
while(t<5){
    let t2 = "RQ";
    t2=t2+t;
document.getElementById(t2).style.display = "none";
t++;
}
t=1;
while(t<6){
    let t2 = "PQ";
    t2=t2+t;
document.getElementById(t2).style.display = "none";
t++;
}
t=1;
while(t<6){
    let t2 = "BQ";
    t2=t2+t;
document.getElementById(t2).style.display = "none";
t++;
}
document.getElementById("BGM").play;
}
function QuestionFormat(){//this function should never be called, but should be copied when making more questions
let A = "This is the answer";
Given = prompt("This is the question");
AnswerCheck(A);
switchQuestion();
}
/*function AltName(){
    let A = "C. November revolution";
    Given= document.getElementById("1-3").checked;
    AnswerCheck(A);
    switchQuestion();
}*/
function cabinetY(){
    if(open==0&&CabY==false){
    Q=1;
    cabinet = "Y";
    document.getElementById("YQ1").style.display = "grid";
    open=1;
    colorTiles();
    }
}
function cabinetO(){
    if(open==0&&CabO==false){
    Q=1;
    cabinet = "O";
    document.getElementById("OQ1").style.display = "grid";
    open=1;
    colorTiles();
    }
}
function cabinetR(){
    if(open==0&&CabR==false){
    Q=1;
    cabinet = "R";
    document.getElementById("RQ1").style.display = "grid";
    open=1;
    colorTiles();
    }
}
function cabinetP(){
    if(open==0&&CabP==false){
    Q=1;
    cabinet = "P";
    document.getElementById("PQ1").style.display = "grid";
    open=1;
    colorTiles();
    }
}
function cabinetB(){
    if(open==0&&CabB==false){
    Q=1;
    document.getElementById("BQ1").style.display = "grid";
    cabinet = "B"
    open=1;
    colorTiles();
    }
}

function RussianTsar(){
    let A = "B. Nicholas II";
    Given = document.getElementById("1-2").checked;
    AnswerCheck(A);
    switchQuestion();
}
function switchQuestion(){
    let t = cabinet + "Q"+(Q-1);
    document.getElementById(t).style.display = "none";
    t = cabinet + "Q" + Q;
    console.log(t)
    if(cabinet=="O"&&Q>4){
        
    } else if(cabinet=="R"&&Q>4){
    
    } else if(Q>5){
    
    }else {
        document.getElementById(t).style.display = "grid";
    }
}
function AnswerCheck(Answer){//"Answer" should be the correct answer to the asked question
if(Given==true){    
    alert("Correct!");
    C=C+1;
    ColorBorder();
} else {
    alert("Sadly, that is wrong, the correct answer is: " + Answer +".");
    W=W+1;
    colorBordeR();
}
Q=Q+1;
if(cabinet=="O"&&Q>4){
        
} else if(cabinet=="R"&&Q>4){

} else if(Q>5){

}else {
    Position++;
    MarkerSet();
}
}//the section below is the functions for the gameboard
function colorTiles(){
    let t = 0;
if(cabinet=="R"){
    for(let i=1;i<5;i++){
        t = Position + i;
        console.log(t);
        document.getElementById("T"+t).style.backgroundColor = "rgb(171,36,30)";
    }
} else if(cabinet=="O"){
    for(let i=1;i<5;i++){
        t = Position + i;
        console.log(t);
        document.getElementById("T"+t).style.backgroundColor = "rgb(229,93,15)";
    }
} else if(cabinet=="B"){
    for(let i=1;i<6;i++){
        t = Position + i;
        console.log(t);
        document.getElementById("T"+t).style.backgroundColor = "rgb(23,82,138)";
    }
} else if(cabinet=="P"){
    for(let i=1;i<6;i++){
        t = Position + i;
        console.log(t);
        document.getElementById("T"+t).style.backgroundColor = "rgb(126,23,106)";
    }
} else if(cabinet=="Y"){
    for(let i=1;i<6;i++){
        t = Position + i;
        console.log(t);
        document.getElementById("T"+t).style.backgroundColor = "rgb(219,164,3)";
    }
}
Position++;
MarkerSet();
//function that sets the mark on the board should be called here.
}
function winAlert(){
    if(CabinetCount==5){
        let t = C+W;
        alert("your score is " + W +"/" + t +".")
    }
}
function colorBordeR(){
    document.getElementById("T"+Position).style.borderColor = "red";
}//this above is for when a question is answered incorrectly.
function ColorBorder(){
    document.getElementById("T"+Position).style.borderColor = "green";
}//this above is for when a question is answered correctly.
function MarkerSet(){
    for(i=1;i<24;i++){
        document.getElementById("T"+i).innerHTML = "";
    }
    document.getElementById("T"+Position).innerHTML = "X";
}
//question functions
function RussianTsar(){
    let A = "B. Nicholas II"; 
    Given = document.getElementById("Y1-2").checked;
   AnswerCheck(A);
    switchQuestion();
}
function GreatBritian(){
    let A = "C. Great Britain"; 
    Given = document.getElementById("Y2-3").checked;
    AnswerCheck(A);
    switchQuestion();
}
    function Anastasia(){
        let A = "C. Anastasia"; 
        Given = document.getElementById("Y3-3").checked;
        AnswerCheck(A);
        switchQuestion();
}
function Romanov(){
    let A = "A. Romanov dynasty"; 
    Given = document.getElementById("Y4-1").checked;
    AnswerCheck(A);
    switchQuestion();
}
function German(){
    let A = "C. German"; 
    Given = document.getElementById("Y5-3").checked;
    AnswerCheck(A);
    switchQuestion();
    CabY=true;
    CabinetCount++;
    open=0;
    winAlert();
}//This is the end of the Royal Family Questions//

//This is the start of the World War I Questions//
function TripleEntente(){
    let A = "A. The Triple Entente"; 
    Given = document.getElementById("O1-1").checked;
   AnswerCheck(A);
    switchQuestion();
}
function AllAbove(){
    let A = "D. All of the above"; 
    Given = document.getElementById("O2-4").checked;
   AnswerCheck(A);
    switchQuestion();
}
function Nationalism(){
   let A = "C. Nationalism"; 
    Given = document.getElementById("O3-3").checked;
   AnswerCheck(A);
    switchQuestion();
}
function Tannenberg(){
    let A = "C. They were demoralized"; 
    Given = document.getElementById("O4-3").checked;
   AnswerCheck(A);
    switchQuestion();
    CabO=true;
    CabinetCount++;
    open=0;
    winAlert();
}//End of the World War I questions//
//Start of the Bolshevik movement questions//
function powerfrom(){
    let A = "B. The Provisional Government"; 
    Given = document.getElementById("R1-2").checked;
     AnswerCheck(A);
    switchQuestion();
}
function leader(){
    let A = "A. Lenin"; 
    Given = document.getElementById("R2-1").checked;
    AnswerCheck(A);
    switchQuestion();
}
function Participated(){
   let A = "D. All of the above"; 
    Given = document.getElementById("R3-4").checked;
   AnswerCheck(A);
    switchQuestion();
}
function White(){
    let A = "C. White Army"; 
    Given = document.getElementById("R4-3").checked;
    AnswerCheck(A);
    switchQuestion();
    open=0;
    CabinetCount++;
    CabR=true;
    winAlert();
}//End of Bolshevik questions//
//Start of Soviet/provisional government questions//
function Head(){
    let A = "B. Kerensky"; 
    Given = document.getElementById("P1-2").checked;
   AnswerCheck(A);
    switchQuestion();
}
function long(){
    let A = "C. 8 months"; 
    Given = document.getElementById("P2-3").checked;
    AnswerCheck(A);
    switchQuestion();
}
function coalitions(){
    let A = "C. 3";
    Given = document.getElementById("P3-3").checked;
   AnswerCheck(A);
    switchQuestion();
}
function socialist(){
    let A = "B. Mensheviks";
    Given = document.getElementById("P4-2").checked;
   AnswerCheck(A);
    switchQuestion();
}
function policies(){
   let A = "D. All of the above";
    Given = document.getElementById("P5-4").checked;
    AnswerCheck(A);
    switchQuestion();
    open=0;
    CabinetCount++;
    CabP=true;
    winAlert();
}//End of the Soviet provisional government questions//
//Start of the Economic Questions//
function Taylorism(){
   let A = "A. Taylorism";
    Given = document.getElementById("B1-1").checked;
    AnswerCheck(A);
    switchQuestion();
}
function reduction(){
    let A = "B. 25-30%";
    Given = document.getElementById("B2-2").checked;
    AnswerCheck(A);
    switchQuestion();
}
function sectors(){
    let A = "A. Electricity and transportation";
    Given = document.getElementById("B3-1").checked;
    AnswerCheck(A);
    switchQuestion();
}
function plan(){
    let A = "D. The New Economic Policy";
    Given = document.getElementById("B4-4").checked;
    AnswerCheck(A);
    switchQuestion();
}
function agency(){
    let A = "C. The State Planning Commission";
    Given = document.getElementById("B5-3").checked;
    AnswerCheck(A);
    switchQuestion();
    open=0;
    CabinetCount++;
    CabB=true;
    winAlert();
}