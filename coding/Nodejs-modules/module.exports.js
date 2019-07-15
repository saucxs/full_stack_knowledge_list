//这些操作都是合法的
exports.name = 'saucxs';
exports.getName = function(){
    console.log('saucxs')
};


//相当于下面的方式
module.exports = {
    name: 'saucxs',
    getName: function(){
        console.log('saucxs')
    }
}


//或者更常规的写法
let name = 'saucxs';
let getName = function(){
    console.log('saucxs')
}
module.exports = {
    name: name,
    getName: getName
}
