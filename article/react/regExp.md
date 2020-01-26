## 一、说明：
### 1、正则匹配关键字
- /g 表示该表达式将用来在输入字符串中查找所有可能的匹配，返回的结果可以是多个。如果不加/g最多只会匹配一个
- /i  表示匹配的时候不区分大小写
- /m 表示多行匹配，什么是多行匹配呢？就是匹配换行符两端的潜在匹配。影响正则中的^$符号


### 2、正则方法
- regExp.test(string)      //  字符串中测试是否匹配的regExp方法，它返回 true 或 false。
- string.replace(regExp, '')    // 匹配上regExp方法，替换为''
- regExp.exec(string)         // 匹配的RegExp方法，它返回一个数组（未匹配到则返回 null）
- string.match(regExp)       // 执行查找匹配的String方法，它返回一个数组，在未匹配到时会返回 null
- string.search(regExp)      // 匹配的String方法，它返回匹配到的位置索引，或者在失败时返回-1


## 二、一些常见场景
### 1、匹配字符串是否含有一些特殊字符
 const regExp = /[（），。；‘\？【「】」《》<>=`￥~!@#$%^&_<>?:"{},.;'[\]]/im;
- regExp.test('(') ;       // false  英文括号(
- regExp.test('（');     // true  中文括号（
- '（A+B)'.replace(regExp, '');   // A+B)    将中文括号（替换为空''

### 2、匹配中文
const regExp = /[\u4e00-\u9fa5]/g
- regExp.test('字节');      // true  
- regExp.test('bytedance');     // false
- 'hello 中文 world'.replace(regExp,  '666');    // 将字符串中中文换成666

### 3、判断字符串中某个字符出现次数
var str ="abc#def#hig";
var len =str.split("#").length-1;   // 2


### 4、非法字符
包括哪些非法字符，可以自由添加删除
下面这个正则就是判断非法字符
```
 const regExpSpecial = /[（），。；‘’\？！\-、：“”【「】」《》=`￥~!@#$%^&_<>?:"{},.;'[\]+-*\/\(\)]/gim;
```
注意：遇到正则的关键符号需要使用 \ 进行转义


### 5、输入括号()、加号+、减号-、乘号*、除号/;计算公式可任意组合，仅支持一层括号的计算
```
const validatorCalculate = (str) => {
  const regExp = /[\+\-\*\/\(\)A-Z]/img;
  const regExpSpecial = /[（），。；‘’\？！-、：“”【「】」《》=`￥~!@#$%^&_<>?:"{},.;'[\]]/img;
  if (!regExp.test(str) || regExpSpecial.test(str)) {
    return '不支持除了+-*/()以外的字符';
  } else if (str.includes('(') && str.includes(')')) {
    // 1、有括号的计算
    if (str.split('(').length > 2 || str.split(')').length > 2) {
      return '只支持一层括号';
    }
    const regExpkuo = /^\(([A-Z1-9]{1}[\+\-\*\/]{1})+[A-Z0-9]\)$/g;
    if (!regExpkuo.test(str)) return '不符合括号运算规则';
  } else if (!str.includes('(') && !str.includes(')')) {
    // 2、没有括号
    const regExp = /^([A-Z1-9]{1}[\+\-\*\/]{1})+[A-Z0-9]$/g;
    if (!regExp.test(str)) return '不符合运算规则';
  } else {
    return '括号没有闭合';
  }
};
```
