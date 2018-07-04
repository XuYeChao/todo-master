function check_login(){
	var userName = document.getElementById("userName").value;
	var userPass = document.getElementById("userPasss").value;
	var tip = document.getElementById("tip");
	if(userName == ""){
		tip.innerHTML = "请输入正确的账号";
		return false;
	}
	if(userPass == ""){
		tip.innerHTML = "请输入正确的密码";
		return false;
	}
	return true;
}
