/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */

var mongoose = require('mongoose');

mongoose.Promise = global.Promise; 
mongoose.connect(process.env.MONGODB_URI)

module.exports = {mongoose};