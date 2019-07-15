let person = require('./demo-export')

console.log(person, '-------------')
console.log(person.name, '===========')
person.getName('gmw');

person.name = 'updateName'
console.log(person, '22222222')
console.log(person.name, '3333333')
person.getName('gmw')
