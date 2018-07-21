/*jslint devel: true */
/*eslint-disable no-console */
/*eslint-env node*/
/* eslint-env browser */

var env = process.env.NODE_ENV || 'development';
console.log(env);

if (env === 'development') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/Burgers';
} else {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/BurgersTest';

}