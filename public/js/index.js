function showList(){
	document.getElementById("addList").style.display = "block";
	document.getElementById("cover").style.display = "block";
}

function showThing(){
	document.getElementById("addThing").style.display = "block";
	document.getElementById("cover").style.display = "block";
}

function hideAll(){
	document.getElementById("addList").style.display = "none";
	document.getElementById("addThing").style.display = "none";
	document.getElementById("cover").style.display = "none";
}

function check_list(){
	if(document.getElementById("listName").value == "")return false;
	return true;
}

function check_search(){
	if(document.getElementById("search_content").value == "") return false;
	return true;
}

function deleteThing(id,list){
	location.href = "/delete?id="+id+"&list="+list;
	return;
}

function removeThing(id){
	location.href = "/remove?id="+id;
	return;
}

function getDay(year,month){
	var days = [31,28,31,30,31,30,31,31,30,31,30,31];
	if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) days[1]++;
	return days[month-1];
}

function check_thing(){
	var title = document.getElementById("title").value;
	var year = document.getElementById("year").value;
	var month = document.getElementById("month").value;
	var day = document.getElementById("day").value;
	var thing_tip = document.getElementById("thing_tip");
	if(title == ""){
		
		return false;
	}
	if(year == "" || isNaN(year) || year < 1000 || year > 10000){
		
		return false;
	}
	if(month == "" || isNaN(month) || month < 1 || month > 12){
		
		return false;
	}
	if(day == "" || isNaN(day) || day < 1 || day > getDay(year,month)){
				return false;
	}
	return true;
}
