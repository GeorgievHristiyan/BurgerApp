/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */


const chai = require('chai'); 
const request = require('supertest'); 
var {ObjectID} = require('mongodb'); 


const {app} = require('./../server');
const {Burger} = require('./../models/burgerModel');
const dummyBurgers = [ // some seed data
    {
        burgerName: 'first',
        _id: 0,
        ingredients: [
            {
                vegetables: {
                    potatoes: true
                }
            }
        ]
    },
    {
        burgerName: 'second burger',
        _id: 1,
        ingredients: [
            {
                vegetables: {
                    potatoes: true
                }
            }
        ]

    }
]; 

beforeEach(async() => {
    await Burger.remove({})
    await Burger.insertMany(dummyBurgers);
});

describe('Post /burger', ()=> {
    it('should create burger by name', async()=>{
        var burger = {
            burgerName: 'first1',
            potatoes: false
        }
        var response = await request(app);
        
        .post('/burger')
        .send(burger)
        chai.assert.equal(response.status, 200, 'status differs 200');
        chai.assert.equal(response.body.doc.burgerName, burger.burgerName, 'the created burger is with different name');
        chai.assert.equal(response.body.doc.ingredients[0].vegetables.potatoes, burger.potatoes, 'created ingredient is with different status' );
        
    });
    
    it('should fail if required params are not provided', async() => {
        var burger = {
            potatoe: true
        };
        
        var response = await request(app)
        .post('/burger')
        .send(burger)
        
        chai.assert.equal(response.status, 400, 'created record is invalid')
    })
        
});


describe('Get / all burgers', () => {
    it('should fetch some data', async() => {
        var response = await request(app)
        .get('/burgers')
        chai.assert(response.body.data.length, dummyBurgers.length, 'could not fetch the data' );
    });
});

describe('Get burger/:id', ()=> {
    it('should get the first burger by burger id', async()=> {
         var response =  await request(app)
        .get(`/burger/${dummyBurgers[0]._id}`);
         chai.assert.equal(response.body.doc._id, dummyBurgers[0]._id, `could not fetch burger with id ${response.body.doc._id}`);
    });
    
    it('should fail if incorrect burgerName is provided', async() => {
        var response =  await request(app)
        .get(`/burger/a`)
         chai.assert.isUndefined(response.body.doc);
    });
});

describe('Get /getallbyname/:name', () => {
    it(' should get all burgers with the provided name', async() => {
        var response = await request(app)
        .get(`/burgerName/${dummyBurgers[0].burgerName}`);
        chai.assert.equal(response.body.data[0].burgerName, dummyBurgers[0].burgerName, `could not get burgers with name ${response.body.data[0].burgerName}`);
    });
    
    it('should fail if incorrect burgetName is provided', async() => {
        var response = await request(app)
        .get(`/burgerName/a`)
        chai.assert.isUndefined(response.body.data[0]);
    });

});

describe('Delete /delete/:name', () => {
    it('should delete burger', async() => {
        var response = await request(app)
        .delete(`/delete/${dummyBurgers[0]._id}`);
        
        var dummyBurgersCount = await Burger.count();
        
        chai.assert.equal(dummyBurgersCount, 1, 'could not delete the burger')
    });
    
    it('should fail if attempt to delete unixisting record', async() => {
        var response = await request(app)
        .delete('/delete/test');
        
        chai.assert.isUndefined(response.body.doc);
    });
});


describe('Update /update:name', () => {
    it('should update a record', async() => {
        
        var burgerUpdate = {
            burgerName: 'updatedBurger',
            potatoes: false
        }
        
        var response = await request(app)        .patch(`/update/${dummyBurgers[0].burgerName}`)        
        .send(burgerUpdate);
        chai.assert.equal(burgerUpdate.burgerName, response.body.doc.burgerName, 'burgerName has not been updated')
        
        chai.assert.equal(burgerUpdate.potatoes, response.body.doc.ingredients[0].vegetables.potatoes, 'potatoe has not been updated')
    });
    
    it('should not update record if does not exist', async() => {
        var response = await request(app)
        .patch('/update/test')
        chai.assert.isNull(response.body.doc);
    })

});

