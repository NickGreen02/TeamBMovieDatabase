
const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const uri = 'mongodb+srv://danielf:12345@cluster0.g3jm3.mongodb.net/WebDataBase?retryWrites=true&w=majority';

// Database Name
const dbName = 'WebDataBase';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true });


app.set('view engine', 'ejs')

//ejs code

//list all movies route
app.get('/movies', (req, res) => {
    //let movie_list = [{'title': 'Tenet'}, {'title':'Inception'}]

    const db = client.db(dbName);
    const collection = db.collection('WebDataCollection');
    // Find some documents
    collection.find({"genres" : {$regex : "Comedy"}, "release_date" : {$gte : new Date("1995-01-01").toISOString(), $lt : new Date("2000-01-01").toISOString()}}).sort({"vote_average" : -1}).toArray(function(err, movie_list) {
        assert.equal(err, null);
        res.render('movies', {'movies': movie_list})
    });
    
    //to query based on genre and release date and sort by imdb rating see example below >>>
    //collection.find({"genres" : {$regex : "Comedy"}, "release_date" : {$gte : new Date("1995-01-01").toISOString(), $lt : new Date("2000-01-01").toISOString()}}).sort({"title" : 1}).toArray(function(err, movie_list)

})
app.get('/', (req, res) => res.send('Hello World!'))


// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to mongo db");


    app.listen(port, () => console.log('listening on port 3000'))
});