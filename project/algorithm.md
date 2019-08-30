###### 算法题（数组）
###### 1、数组去重
+ 双重循环
+ indexOf简化内层循环
```js
// 方法二：indexOf简化内层循环
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    // res 存结果
    var res = [];
    for(var i = 0, length = arr.length; i < length; i++){
       var current = arr[i];
       if(res.indexOf(current) === -1){
           res.push(current);
       }
    }
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ filter简化外层循环
```js
// 方法三：filter + indexOf
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    // res 存结果
    var res = arr.filter(function(item, index, arr){
        return arr.indexOf(item) === index;
    })
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ Object键值对
思路：利用一个空的Object对象，把数组的值存成Object的key，比如就是Object[value] = true;循环判断的时候，如果Object[value]存在，说明这个值重复了。
事件复杂度降到O(n)
Object键值对，实质是hasOwnProperty的hash表。
```js
function unique(arr){
    // obj 存对象
    var obj= {};
    var res = arr.filter(function(item, index, arr){
        if(obj.hasOwnProperty(typeof item + item)) return false;
        else {
            return obj[typeof item + item] = true;
        }
    })
    return res;
}
unique(array);   //[1, "1", "2", 2]
```
+ reduce高阶函数
存在问题：对象数组不能使用includes方法来检测
```js
var array = [1,1,'1','2','1',1,2]
function unique(arr){
    let newArr = arr.reduce((pre,cur)=>{
        if(!pre.includes(cur)){
            return pre.concat(cur)
        }else{
            return pre
        }
    },[]);
    return newArr;
}
console.log(unique(array));// [1, "1", "2", 2]
```
+ ES6的set数据结构
```js
var array = [1,1,'1','2','1',1,2]
const unique = arr => [...new Set(arr)];
unique(array);   //[1, "1", "2", 2]
```
目前时间复杂度到O(n)的方法：

（1）Object键值对，实质是hasOwnProperty的hash表。

（2）ES6的set，map的数据结构

（3）reduce高阶函数


###### 2、数组中查找重复元素

```js
var array = [1,2,4,4,3,3,1,5,3]
function unique(arr){
    // res 存去重结果   returnres 存重复的结果然后再去重。
   let res = []; 
   let returnres = [];
   for(let i=0;i<arr.length;i++){
       let current = arr[i];
       console.log(current, '00000000')
       if(res.indexOf(current) === -1){
           res.push(current)
       }else{
           returnres.push(current)
       }
   }
   console.log(returnres, '-==-=')
   return [...new Set(returnres)]
}
unique(array);   
```

###### 3、数组中最大值和最小值
思路：sort排序，

###### 4、数组中最大差值
思路：sort排序，
```js
function getMaxVal(arr) {
  let minPrice = arr[0];
  let maxPrice = arr[0];
  let maxVal = 0;
  for(let i = 0; i < arr.length; i++){
      let current = arr[i];
      minPrice = Math.min(minPrice, current);
      maxPrice = Math.max(maxPrice, current);
      maxVal = maxPrice - minPrice
  }
  return maxVal;
}
```

###### 5、斐波那契数列
```js
function fib(n) {
  let fibArr = [];
  let i = 0;
  while(i < n){
      if(i === 0 || i === 1 || i === 2){
          fibArr.push(i);
      }else{
          fibArr.push(fibArr[i - 1] + fibArr[i - 2])
      };
      i++;
  }
  return fibArr;
}
```

###### 6、数组扁平化
+ 递归调用
+ toString，数组内只能都是数字
+ reduce
```js
function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
```
+ ES6的扩展运算符...
```js
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
```
+ ES6的flat方法
```js
arr.flat(Infinity);
```

###### 7、删除数组中所有的假值
js中的假值：false,null,0,"",undefined,NaN
```js
function bouncer(arr) {
  function isBigEnough(element) {
    if(element!==false || element!==null || element!==0 || element!=="" || element!==undefined || element!==NaN){
      return element;
    }
  }
  var filtered =arr.filter(isBigEnough);
  return filtered;
}
```

###### 8、判断数组是否存在重复
```js
var containsDuplicate = function(nums) {
    let hashMap = new Map();
    for(let i = 0; i < nums.length; i++) {
        if( hashMap.has(nums[i]) ) {
           return true;
        }
        hashMap.set(nums[i], 1);
    }
    return false;
};
```


###### 9、两个升序的数组合并成一个升序数组
```js
// 时间复杂度O(M+N)，空间复杂度O(M+N)
function merge(left, right){
    let result  = [],
        il      = 0,
        ir      = 0;
    while (il < left.length && ir < right.length) {
        result.push(left[il] < right[ir] ? left[il++] : right[ir++]);
    }
    return result.concat(left.slice(il)).concat(right.slice(ir));
}
```

```js
// 时间复杂度O(M+N)，空间复杂度O(1)
function merge(left, m, right,  n) {
    var i = m - 1, j = n - 1, writeIdx = m + n - 1;
    while (i >= 0 && j >= 0)
    left[writeIdx--] = left[i] > right[j]? left[i--] : right[j--];
    while (j >= 0)
    left[writeIdx--] = right[j--];
    return left;
}
```

###### 10、数组交集
```js
var intersect = function(nums1, nums2) {
    var map1 = new Map();
    var number = [];
    for(var i = 0; i < nums1.length; i++) {
        var map1Value = map1.get(nums1[i]);
        map1.set( nums1[i], ( map1Value ? map1Value : 0 ) + 1 );
    }
    for(var i = 0; i < nums2.length; i++) {
        if( map1.has(nums2[i]) && map1.get(nums2[i]) != 0 ) {
            number.push(nums2[i]);
            map1.set( nums2[i], map1.get(nums2[i]) - 1 );
        }
    }
    return number;
};
```

###### 11、找出一个数组中只出现一次的数字
```js
var singleNumber = function(nums) {
    
    let number = 0;
    for(let i = 0; i < nums.length; i++) {
        number ^= nums[i];
    }
    return number;
};
```

###### 算法题（字符串）
###### 1、统计字符串中出现最多的和次数
```js
function repeated(str) {
  let obj = {};
  for(let i = 0, length = str.length; i < length; i++){
      if(obj[str.charAt(i)]){
          obj[str.charAt(i)]++
      }else{
          obj[str.charAt(i)] = 1;
      }
  }
  let iMax = 0;
  let iIndex;
  console.log(obj, '0000000000000000')
  for(let j in obj){
      if(obj[j] > iMax){
          iMax = obj[j];
          iIndex = j;
      }
  }
  return {str: iIndex, num: iMax}
}
repeated('aaaaa33455aaaasfdfdsfdgdf')
```

###### 2、反转字符串
先把字符串转为数组，使用数组reverse翻转，然后数组转为字符
```js
function reverseString(str) {
  return str.split('').reverse().join('');
}
```

###### 3、回文字符串判断
如果字符串，忽略标点，大小写，空格，正读和反复一样，这样字符串就是回文字符串。
```js
function palind(str) {
  var astr = str.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  var bstr = astr.split('').reverse().join('');
  if(astr === bstr){
      return true
  }else{
      return false
  }
}
```

###### 4、英文句子中最长的单词，并计算长度
```js
function findLongestWord(str) {
  var astr = str.split('');
  var bstr = astr.sort(function(a, b) {
    return b.length - a.length
  })
  var lenMax = bstr[0].length;
  return lenMax;
}
```

###### 5、字符串中每个单词首字母大写，其他字母小写
```js
function titleCase() {
  var astr = str.toLOwerCase().split("");
  for(let i = 0; i < astr.length;i++){
      astr[i] = astr[i][0].toUpperCase() + astr[i].substring(1, astr[i].length);
  }
  var string = astr.join("");
  return string;
}
```



###### 算法题（数字）
###### 1、整数的阶乘
```js
function fac(num) {
  if(num < 0) return -1;
  else if(num === 0 || num === 1) return 1;
  else if(num > 1){
      return num * fac(num - 1);
  }
}
```
