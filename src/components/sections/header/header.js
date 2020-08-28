// testing importing scss
import "./header.scss";
const validator = require('validator');


// Testing arrow functions
const headerFunction = () => 'Header JS ES6 Function';
console.log(headerFunction())

const validate = validator.isEmail('foo@bar.com');
console.log("validated?", validate);
