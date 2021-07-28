const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const connectionString = 'mongodb://localhost:27017/?readPreference=primary&ssl=false';
MongoClient.connect(connectionString).then(client => {
    console.log("Connected to database");
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body).then(result => {
            res.redirect('/')
        })
            .catch(error => console.error(error))
    });

    app.get('/', (req, res) => {
        const db = client.db('star-wars-quotes');
        db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results });
                console.log(results);
            }).catch(error => console.error(error));

    })

});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
    console.log("listioning on port 3000");
});


// https://zellwk.com/blog/crud-express-mongodb/