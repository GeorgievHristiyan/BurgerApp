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
app.post('/burger', async (req, res) => {
    var newBurger;
    var doc;
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

        doc = await newBurger.save();
        res.send({doc});
    } catch (e) {
       res.status(400).send(e); 
    }
});

//Fetch all burgers
app.get('/burgers', async(req, res) => {
    var pageCount;
    
    try{
    
        var [results, burgerCount] = await Promise.all([
            Burger.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Burger.count({})
        ]);

        pageCount = Math.ceil(burgerCount / req.query.limit);

        res.send({
        has_more_pages: paginate.hasNextPages(req)(pageCount),
        data: results
        });  
    
    } catch(err) {
        res.send(err);
    }
     
});

//fetch all burgers by Id
app.get('/burger/:id', async(req, res) => { 
    var doc;
    var id = req.params.id;

    try {
        doc = await Burger.findById(id);
        if (!doc) {
            return res.status(404).send();
        }
        return res.send({doc});
    } catch(e) {
        res.status(400).send(e.message);
    }
    
});

//fetch random burger
app.get('/random/', async(req, res) => {
    var doc;
    var burgersCount;
    var random;
    
    try {
        burgersCount = await Burger.count();
        random = Math.floor(Math.random() * burgersCount);
        doc = await Burger.findById(random);
        res.send({doc});
    } catch(e) {
        res.status(400).send(e.message);
    }
    
});

//Fetch All burgers with this name
app.get('/burgerName/:name', async(req, res) => {
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
        res.status(404).send(e);
    } 
    
});

//Delete burger
app.delete('/delete/:id', async(req, res) => {
    var id = req.params.id;
    
    try {
        var doc = await Burger.findByIdAndRemove(id);
        await res.send({doc});
    } catch (e) {
        res.status(400).send();  
    } 
});

//Update burger
app.patch('/update/:name', async(req, res) => {
    var burgerName = req.params.name;
    var body = _.pick(req.body, ['burgerName', 'description', 'potatoes', 'tomatoes', 'frenchFries', 'onion', 'lettuce', 'chicken', 'beef', 'pork']);
    
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





