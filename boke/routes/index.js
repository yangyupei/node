var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/register";

/* GET home page. */
router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express' });
  res.render('index', {user:req.session.user});
});


router.get('/register', function(req, res, next) {
  res.render('register', {});
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});
router.get('/out', function(req, res, next) {
	req.session.user=undefined;
 	res.redirect('/');
});

router.get('/msg', function(req, res, next) {
	function conData(db,callback){
			var collect=db.collection('liuyan');
			collect.find({},function(err,relsult){
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
				console.log(err)
			}else{		
				
				conData(db,function(relsult){
					relsult.toArray(function(err,item){
							
						res.render('msg',{item:item});	
						db.close();
					})
				});				
			}	
		})
});

module.exports = router;
