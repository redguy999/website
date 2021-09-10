function OR(c1,c2){
	if(c1||c2==true){
		return true;
	}
	return false;
}//not really that useful
function AND(c1,c2){
	if(c1&&c2==true){
		return true;
	}//else isn't needed cause the return ends the function
	return false;
}//also not really useful
function NAND(C1,C2){
	return !AND(C1,C2);
}//this and the following function are why we need AND() and OR()
function NOR(C1,C2){
	return !OR(C1,C2);
}
function XOR(c1,c2){
	if(c1==c2){
	return false;
	}
return true;
}
function XNOR(C1,C2){
	return !XOR(c1,c2);
}
