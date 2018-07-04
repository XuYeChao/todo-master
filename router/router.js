const formidable = require("formidable");
const dao = require("../dao/dao.js");

exports.Get_login = (request, response, next) => { //获取登陆界面,ok
	var tip = "";
	var tips = request.query.tip;
	if(tips == 1) tip = "用户名或密码错误";
	else if(tips == 2) tip = "请先登陆";
	response.render("login", {
		"tip": tip
	});
}

exports.Post_login = (request, response, next) => { //提交登陆信息,ok
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var userName = fields.userName;
		var userPass = fields.userPass;
		var sql = "select * from login where user='" + userName + "' and pass='" + userPass + "'";
		dao.query(sql, (err, results) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			if(results.length == 0) {
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/login?tip=1"
				});
				response.end();
			} else {
				request.session.userName = userName;
				response.writeHead(302, {
					"Location": "http://127.0.0.1:3000/index?list=2"
				});
				response.end();
			}
		});
	});
}

exports.Get_index = (request, response, next) => { //获取主页，及其所有数据,ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = 2;
	if(request.query.list != null) id = parseInt(request.query.list);
	var sql = "select * from lists where type = 'child'";
	dao.query(sql, (err, left_result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		if(id == 1) {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			if(month < 10) month = "0" + month;
			if(day < 10) day = "0" + day;
			var now_date = year + "-" + month + "-" + day;
			sql = "select * from to_do where time='" + now_date + "' and isdelete=0 order by urgent desc,time asc";
		} else if(id == 2) sql = "select * from to_do where isdelete=0 order by urgent desc,time asc";
		else if(id == 3) sql = "select * from to_do where isdelete=1 order by urgent desc,time asc";
		else sql = "select * from to_do where list_id=" + id + " and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, right_result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.render("index", {
				"lists": left_result,
				"contents": right_result,
				"list_flag": id
			});
		});
	});
}

exports.Post_addThing = (request, response, next) => { //添加计划,ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	var list_id = 2;
	if(request.query.list != null) list_id = parseInt(request.query.list);
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var title = fields.title;
		var urgent = parseInt(fields.urgent);
		var year = fields.year;
		var month = fields.month;
		var day = fields.day;
		if(month < 10) month = "0" + parseInt(month);
		if(day < 10) day = "0" + parseInt(day);
		var time = year + "-" + month + "-" + day;
		var sql = "insert into to_do values(null,?,?,?,?,?)";
		var params = [title, urgent, time, list_id, 0];
		dao.add(sql, params, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=" + list_id
			});
			response.end();
		});
	});
}

exports.Get_delete = (request, response, next) => { //删除计划,软删除方式,ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = request.query.id;
	var list = request.query.list;
	var sql = "update to_do set isdelete=1 where id=?";
	dao.update(sql, [id], (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=" + list
		});
		response.end();
	});
}

exports.Get_remove = (request, response, next) => { //删除计划，硬删除方法,ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = request.query.id;
	var sql = "delete from to_do where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/index?list=3"
		});
		response.end();
	});
}

exports.Post_addList = (request, response, next) => { //新建列表，ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var listName = fields.listName;
		var sql = "insert into lists values(null,?,'child')";
		dao.add(sql, [listName], (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.Post_search = (request, response, next) => { //搜索,ok
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var form = new formidable.IncomingForm();
	form.parse(request, (err, fields, files) => {
		if(err != null) {
			console.log("表单解析错误");
			next();
			return;
		}
		var search = fields.search;
		var sql = "select * from to_do where title like '%" + search + "%' and isdelete=0 order by urgent desc,time asc";
		dao.query(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			sql = "select * from lists where type='child'";
			dao.query(sql, (err, resl) => {
				if(err) {
					console.log(err);
					next();
					return;
				}
				response.render("index", {
					"lists": resl,
					"contents": result,
					"list_flag": -1
				});
			});
		});
	});
}

exports.Get_deleteList = (request, response, next) => {
	if(request.session.userName == null) {
		response.writeHead(302, {
			"Location": "http://127.0.0.1:3000/login?tip=2"
		});
		response.end();
		return;
	}
	var id = parseInt(request.query.id);
	var sql = "delete from lists where id=" + id;
	dao.remove(sql, (err, result) => {
		if(err) {
			console.log(err);
			next();
			return;
		}
		sql = "delete from to_do where list_id=" + id;
		dao.remove(sql, (err, result) => {
			if(err) {
				console.log(err);
				next();
				return;
			}
			response.writeHead(302, {
				"Location": "http://127.0.0.1:3000/index?list=2"
			});
			response.end();
		});
	});
}

exports.Get_logout = (request, response, next) => { //退出登陆,ok
	request.session.userName = null;
	response.writeHead(302, {
		"Location": "http://127.0.0.1:3000/login?tip=2"
	});
	response.end();
}