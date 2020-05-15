var express = require('express');
	bodyParser = require('body-parser');
	mongodb = require('mongodb');
	objectId = require('mongodb').ObjectId;

var app = express();

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next){

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

var porta = 8080;

app.listen(porta);

var db = new mongodb.Db(
	'wordOReading',
	new mongodb.Server('localhost', 27017, {}),
	{}
);

app.get('/', function(rep, res){
	res.send({mes: 'Olá!!!'});
});

//POST (create)
app.post('/api', function(req, res){
	var date = new Date();
	time_stamp = date.getTime();

	var dados = {
		nomeDoLivro: req.body.nomeDoLivro,
		autorDoLivro: req.body.autorDoLivro,
		resumoDoLivro: req.body.resumoDoLivro
	}

	console.log(dados);
	db.open( function(err, mongoClient){
		mongoClient.collection('postagens', function(err, collection){
			collection.insert(dados, function(err, records){
				if(err){
					res.json({'status': 'json'});
				}else {
					res.json({'status': 'Inclusao realizada'});
				}
				mongoClient.close();
			});
		});
	});

});

//GET by ID
app.get('/api/:id', function(req, res){
	db.open(function(err, mongoClient){
		mongoClient.collection('postagens', function(err, collection){
			collection.find(objectId(req.params.id)).toArray(function(err, records){
				if(err){
					res.json(err);
				}else {
					res.json(records);
				}
				mongoClient.close();
			});
		});
	});
});

//GET
app.get('/api', function(req, res){
	db.open(function(err, mongoClient){
		mongoClient.collection('postagens', function(err, collection){
			collection.find().toArray(function(err, records){
				if(err){
					res.json(err);
				}else {
					res.status(200).json(records);
				}
				mongoClient.close();
			});
		});
	});
});
console.log("TESTE");


