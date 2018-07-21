/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */

require('./config/config.js')

var express = require ('express');
var {ObjectID} = require('mongodb');
var limit = require('express-better-ratelimit');
var paginate = require('express-paginate')
var _ = require('lodash');
var bodyParser = require('body-parser');

var {Burger} = require('./models/burgerModel.js');
var {mongoose} = require('./db/mongoose');
 
var app = express();

app.use(bodyParser.json());

//setting up the default paginate settings
app.use(paginate.middleware(10, 50));

//setting rate limiter to send max 100 request per minute to the DB
app.use(limit ({
    duration: 60000,
    max: 100
}));

//Create burger
app.post('/createBurger', async (req, res) => {
    var newBurger;
    try {
        
        newBurger = new Burger({
        burgerName: req.body.burgerName,
        description: req.body.description,
        ingredients:[
            {
                vegetables: {
                    potatoes: req.body.potatoes,
                    tomatoes: req.body.tomatoes,
                    frenchFries: req.body.frenchFries,
                    onion: req.body.onion,
                    lettuce: req.body.lettuce,
                },
                meat: {
                    chicken: req.body.chicken,
                    beef: req.body.beef,
                    pork: req.body.pork
                }
            }]
        });


        var doc = await newBurger.save();
        res.send({doc});
    } catch (e) {
       res.status(400).send(e); 
    }
});

//Fetch all burgers
app.get('/all', async(req, res) => {

    //ex - http://localhost:3000/all?limit=2&page=4
    try{
    
        var [results, burgerCount] = await Promise.all([
            Burger.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Burger.count({})
        ]);

        var pageCount = Math.ceil(burgerCount / req.query.limit);

        res.send({
        has_more_pages: paginate.hasNextPages(req)(pageCount),
        data: results
        });  
    
    } catch(err) {
        res.send(err);
    }
     
    /*var allBurgers = await Burger.find();
    
    res.send({allBurgers});*/
});

//Fetch one by name
app.get('/getone/:name', async(req, res) => { // Това тук защо по дяволите не работи?!?!?!
    var doc;
    var burgerName = req.params.name;

    try {
        doc = await Burger.findOne({burgerName});
        if (!doc) {
            return res.status(404).send();
        }
        res.send({doc});
    } catch(e) {
        res.status(400).send(e.message);
    }
    
});


//Fetch All with this name
app.get('/getallbyname/:name', async(req, res) => {
    var doc;
    var burgerName = req.params.name;
    
    try{
    
        var [results, burgerCount] = await Promise.all([
            Burger.find({burgerName}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Burger.count({burgerName})
        ]);

        var pageCount = Math.ceil(burgerCount / req.query.limit);

        res.send({
        has_more_pages: paginate.hasNextPages(req)(pageCount),
        data: results
        });  
    
    } catch(e) {
        res.send(e);
    } 
    
});

//Delete burger
app.delete('/delete/:name', async(req, res) => {
    var burgerName = req.params.name;
    
    try {
        var doc = await Burger.findOneAndRemove({burgerName});
        await res.send({doc});
    } catch (e) {
        res.status(400).send();  
    } 
});

//Update burger
app.patch('/update/:name', async(req, res) => {
    var burgerName = req.params.name;
    
    var body = _.pick(req.body, ['burgerName', 'description', 'potatoes', 'tomatoes', 'frenchFries', 'onion', 'lettuce', 'chicken', 'beef', 'pork']);
    //var doc = await Burger.findOneAndUpdate(burgerName, {$set: body}, {new: true});
    try{
        var doc = await Burger.findOneAndUpdate({burgerName}, {$set: { 
                                                        burgerName: req.body.burgerName,
                                                        description: req.body.description,
                                                        ingredients:[
                                                            {
                                                                vegetables: {
                                                                    potatoes: req.body.potatoes,
                                                                    tomatoes: req.body.tomatoes,
                                                                    frenchFries: req.body.frenchFries,
                                                                    onion: req.body.onion,
                                                                    lettuce: req.body.lettuce,
                                                                },
                                                                meat: {
                                                                    chicken: req.body.chicken,
                                                                    beef: req.body.beef,
                                                                    pork: req.body.pork
                                                                }
                                                            }]
                                                        }}, {new: true});

        res.send({doc});
    } catch(e) {
        res.status(400).send(e);
    }
    
    
    
});

app.listen(3000, () => {
    console.log('burger app is set on port 3000');
});




module.exports = {app}; 





