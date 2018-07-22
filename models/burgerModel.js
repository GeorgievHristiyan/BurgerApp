/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


autoIncrement.initialize(mongoose);

var burgerSchema = new mongoose.Schema({
    burgerName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        default: 'No information'
        
    },
    ingredients: [
        {
            vegetables: {
                potatoes:{
                    type: Boolean,
                    default: true,
                    required: true
                },
                tomatoes:{
                    type: Boolean,
                    default: true
                },
                frenchFries: {
                    type: Boolean,
                    default: true
                },
                onion: {
                    type: Boolean,
                    default: false
                },
                lettuce: {
                    type: Boolean,
                    default: true
                }
            },
            meat: {
                chicken: {
                    type: Boolean,
                    default: false
                },
                beef: {
                    type: Boolean,
                    default: false
                },
                pork: {
                    type: Boolean,
                    default: true
                }
            }
        }
    ]
});

burgerSchema.plugin(autoIncrement.plugin, 'Burger');


var Burger = mongoose.model('Burger', burgerSchema);

module.exports = {Burger};


