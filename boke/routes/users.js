var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/register";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post ("/form",function(req,res,next){
	var user=req.body["user"]
	var pass=req.body["pass"]
	
	var insertdata=function(db,callback){
		//找到要插入的集合
		var coll=db.collection("msg")
		//设置需要插入集合的文档数据
		var data=[{user:user,pass:pass}]
		coll.insert(data,function(err,result){
			if(err){
				console.log(err)
			}else{
				callback(result)
			}
		})
	}
	mongodb.connect(db_str,function(err,db){
		if(err){
			console.log(err)
		}else{
			console.log("链接成功")
			//调用插入函数
			insertdata(db,function(result){
				console.log(result)
				
			})
//			res.send("恭喜你，注册成功")
			res.redirect('/')
		}
		
	})
})

//接下来是登录
//登录
router.post('/check', function(req, res, next) {
		//查询数据
		function loginData(db,callback){
			var collect=db.collection('msg');
			var data={user:req.body['user'],pass:req.body['pass']};
			collect.find(data,function(err,relsult){
				if(err){
					console.log(err);
				}else{
					callback(relsult)
					
				}
			})
			
		}
		
		//链接数据库
		mongodb.connect(db_str,function(err,db){
			if(err){

			}else{	
				
				loginData(db,function(relsult){
			
					relsult.toArray(function(err,item){
	
						if(item.length>0){
						
							req.session.user=item[0].user;
							console.log(item[0].user)
							res.redirect('/')
							db.close();
						}
					})
				});				
			}	
		})
		
	
});

router.post('/liuyan', function(req, res, next) {
	   var ses=req.session.user;
	   if(ses){
	   		var baioti=req.body['biaoti'];
			var con=req.body['con'];
			//插入数据
			function liuyanData(db){
				var collect=db.collection('liuyan');
				var data=[{biaoti:baioti,con:con}];
				collect.insert(data,function(err,relsult){
					if(err){
						console.log(err);
					}else{
						
					}
				})
				
			}
			//链接数据库
			mongodb.connect(db_str,function(err,db){
				if(err){
					console.log(err)
				}else{
					liuyanData(db)
					console.log(1)
					res.redirect('/msg')
					db.close();
				}
			})
	   }else{
	   		res.send('session过期');
	   }
		
		
	
});

module.exports = router;
