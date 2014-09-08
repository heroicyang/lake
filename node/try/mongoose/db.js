var mongo=require('mongoose');
mongo.connect('127.0.0.1:27017');
var db=mongo.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log('the db is connect');
});