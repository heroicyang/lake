var mongodb=require('mongodb');
var Db=mongodb.Db;
var Server=mongodb.Server;

var db=new Db('local',new Server('localhost',27017));
db.open(function(err,db){
	console.log(err);
})