setTimeout(function timeout () {
    console.log('timeout');
},0);
setImmediate(function immediate () {
    console.log('immediate');
});
