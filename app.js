
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// comment

//  Connection URL
const uri = 'mongodb+srv://danielf:12345@cluster0.g3jm3.mongodb.net/WebDataBase?retryWrites=true&w=majority';

app.use(express.static(__dirname + '/public'));

// Database Name
const dbName = 'WebDataBase';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true });

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})


app.set('view engine', 'ejs')

// this post will be activated when the submit button is clicked
// it will use the user query and search through the database to found the relevant movie name
//
app.post('/', urlencodedParser, function(req, res){
    console.log(req.body);
    const db = client.db(dbName);
    const collection = db.collection('WebDataCollection');
    //selection statements to check if certain critical fields are empty or not, with respective queries
    if (req.body.budgetLower == "" && req.body.budgetUpper == "" && req.body.revenueLower == "" && req.body.revenueUpper == ""){    
        collection.find({$and: [{"title" : {$regex : req.body.movName}}, {"genres" : {$regex : req.body.genreName}}, {"release_date" : {$regex : req.body.yearInput}}]}).limit(10).toArray(function(err, movie_list) {
            assert.equal(err, null);
            res.render('movies', {'movies': movie_list})
        });
    } 
    else if((req.body.budgetLower == "" && req.body.budgetUpper == "") && (!req.body.revenueLower == "" && !req.body.revenueUpper == "")){
        collection.find({$and: [{"title" : {$regex : req.body.movName}}, {"genres" : {$regex : req.body.genreName}}, {"release_date" : {$regex : req.body.yearInput}}, {"revenue" : {$gte : req.body.revenueLower}}, {"revenue" : {$lte : req.body.revenueUpper}}]}).limit(10).toArray(function(err, movie_list) {
            assert.equal(err, null);
            res.render('movies', {'movies': movie_list})
        });
    }
    else if((!req.body.budgetLower == "" && !req.body.budgetUpper == "") && (req.body.revenueLower == "" && req.body.revenueUpper == "")){
        collection.find({$and: [{"title" : {$regex : req.body.movName}}, {"genres" : {$regex : req.body.genreName}}, {"release_date" : {$regex : req.body.yearInput}}, {"budget" : {$gte : req.body.budgetLower}}, {"budget" : {$lte : req.body.budgetUpper}}]}).limit(10).toArray(function(err, movie_list) {
            assert.equal(err, null);
            res.render('movies', {'movies': movie_list})
        });
    }
    else{
        collection.find({$and: [{"title" : {$regex : req.body.movName}}, {"genres" : {$regex : req.body.genreName}}, {"release_date" : {$regex : req.body.yearInput}}, {"budget" : {$gte : req.body.budgetLower}}, {"budget" : {$lte : req.body.budgetUpper}}, {"revenue" : {$gte : req.body.revenueLower}}, {"revenue" : {$lte : req.body.revenueUpper}}]}).limit(10).toArray(function(err, movie_list) {
            assert.equal(err, null);
            res.render('movies', {'movies': movie_list})
        });
    }
});

app.get('/', (req, res) => { 
    res.render('home')
});



// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to mongo db");


    app.listen(port, () => console.log('listening on port 3000'))
});