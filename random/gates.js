function OR(c1,c2){
	return c1||c2;
}//not really that useful
function AND(c1,c2){
	return c1&&c2;
}//also not really useful
function NAND(C1,C2){
	return !AND(C1,C2);
}//this and the following function are why we need AND() and OR()
function NOR(C1,C2){
	return !OR(C1,C2);
}
function XOR(c1,c2){
	return c1==c2;
}
function XNOR(C1,C2){
	return !XOR(C1,C2);
}
