var module = {
    exports: {}
};

var exports = module.exports;

function change(exports) {
    /*为形参exports添加属性name，会同步到外部的module.exports对象*/
    exports.name = 'saucxs'
    /*在这里修改wxports的引用，并不会影响到module.exports*/
    exports = {
        age: 18
    }
    console.log(exports)  // {age: 18}
}

change(exports);
console.log(module.exports);   // {exports: {name: 'saucxs'}}
