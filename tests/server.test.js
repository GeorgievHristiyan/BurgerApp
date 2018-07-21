/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */


const expect = require('expect'); 
const request = require('supertest'); 
var {ObjectID} = require('mongodb'); 


const {app} = require('./../server');
const {Burger} = require('./../models/burgerModel');
const dummyBurgers = [ // some seed data
    {
        burgerName: 'first',
        _id: new ObjectID(),
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
        _id: new ObjectID(),
        ingredients: [
            {
                vegetables: {
                    potatoes: true
                }
            }
        ]

    }
]; 

beforeEach((done) => {
    Burger.remove({}).then(() => {
        return Burger.insertMany(dummyBurgers);
    }).then(() => done());
});


describe('Get / all burgers', () => {
    it('should fetch some data', (done) => {
        request(app)
        .get('/all')
        .expect(200)
        .expect((res) => {
            expect(res.body.data.length).toBe(2);
        })
        .end(done)
    });
});

describe('Get getone/:burgerName', ()=> {
    it('should get the first burger by burger name', async(done)=> {
       await request(app)
        .get(`/getone/:${dummyBurgers[0].burgerName}`)
        .expect(200)
        .expect((res) => {
             expect(res.body.doc.burgerName).toBe(dummyBurgers[0].burgerName);
        })
        .end(done)
    });
    
});

/*describe('POST / burgers', () => {
    it('should create burger', async(done) => {
        var burgerName = 'testing db create'
        var potatoes = true;
        
        await request(app)
        .post('/createBurger')
        .send({burgerName})
        .expect(400)
        .expect((res) => {
            expect(res.body.burgerName).toBe(burgerName)
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            
            Burger.find().then((burgers) => {
                expect(burgers.length).toBe(2);
                done();
            }).catch((e) => done(e))
        })
    })
})*/