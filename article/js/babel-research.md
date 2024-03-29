
# babel背后到底执行了什么？

babel对于大多数前端开发人员来说，不陌生，但是背后的原理海慧寺黑盒。

我们需要了解babel背后的原理在我们开发中广泛应用。

## 一、babel简单应用

```js
[1,2,3].map(n => n+1);
```

经过babel转译之后，代码变成这样

```js
[1,2,3].map(function(n){
  return n + 1;
})
```
那我们应该知道了babel定位：babel将ES6新引进的语法转换为浏览器可以运行的ES5语法。

## 二、babel背后
babel过程：解析----转换---生成。

![babel背后过程](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/babel.png?raw=true)

我们看到一个叫AST(抽象语法树)的东西。

主要三个过程：

+ 解析：将代码（字符串）转换为AST（抽象语法树）。
+ 转换：访问AST的节点进行变化操作生成新的AST。
+ 生成：以新的AST为基础生成代码

## 三、过程1：代码解析（parse）
代码解析（parse）将一段代码解析成一个数据结构。其中主要关键步骤：
+ 词法分析：代码（字符串）分割成token流。即语法单元组成的数组。
+ 语法分析：分析token流（生成的数组）生成AST。

### 3.1词法分析
词法分析，首先明白JS中哪些属于语法单元？
+ 数字：js中科学计数法以及普通数组都是语法单元。
+ 括号：(和)只要出现，不管意义都算是语法单元。
+ 标识符：连续字符，常见变量，常量，关键字等等
+ 运算符：+，-，*，/等。
+ 注释和中括号。

我们来看一下简单的词法分析器（Tokenizer）

```js
// 词法分析器,接收字符串返回token数组
export const tokenizer = (code) => {
    // 储存 token 的数组
    const tokens  = [];

    // 指针
    let current = 0;

    while (current < code.length) {
        // 获取指针指向的字符
        const char = code[current];

        // 我们先处理单字符的语法单元 类似于`;` `(` `)`等等这种
        if (char === '(' || char === ')') {
            tokens.push({
                type: 'parens',
                value: char,
            });

            current ++;

            continue;
        }

        // 我们接着处理标识符,标识符一般为以字母、_、$开头的连续字符
        if (/[a-zA-Z\$\_]/.test(char)) {
            let value = '';
            value += char;
            current ++;

            // 如果是连续字那么将其拼接在一起,随后指针后移
            while (/[a-zA-Z0-9\$\_]/.test(code[current]) && current < code.length) {
                value += code[current];
                current ++;
            }

            tokens.push({
                type: 'identifier',
                value,
            });

            continue;
        }


        // 处理空白字符
        if (/\s/.test(char)) {
            let value = '';
            value += char;
            current ++;

            //道理同上
            while (/\s]/.test(code[current]) && current < code.length) {
                value += code[current];
                current ++;
            }

            tokens.push({
                type: 'whitespace',
                value,
            });

            continue;
        }


        // 处理逗号分隔符
        if (/,/.test(char)) {

            tokens.push({
                type: ',',
                value: ',',
            });

            current ++;
            continue;
        }

        // 处理运算符
        if (/=|\+|>/.test(char)) {
            let value = '';
            value += char;
            current ++;

            while (/=|\+|>/.test(code[current])) {
                value += code[current];
                current ++;
            }

            // 当 = 后面有 > 时为箭头函数而非运算符
            if (value === '=>') {
                tokens.push({
                    type: 'ArrowFunctionExpression',
                    value,
                });
                continue;
            }

            tokens.push({
                type: 'operator',
                value,
            });

            continue;
        }

        // 如果碰到我们词法分析器以外的字符,则报错
        throw new TypeError('I dont know what this character is: ' + char);
    }
    return tokens;
};
```

上述的这个词法分析器：主要是针对例子的箭头函数。

### 3.2语法分析
语法分析之所以复杂,是因为要分析各种语法的可能性,需要开发者根据token流(上一节我们生成的 token 数组)提供的信息来分析出代码之间的逻辑关系,只有经过词法分析 token 流才能成为有结构的抽象语法树.

做语法分析最好依照标准,大多数 JavaScript Parser 都遵循estree规范

1、语句(Statements): 语句是 JavaScript 中非常常见的语法,我们常见的循环、if 判断、异常处理语句、with 语句等等都属于语句。

2、表达式(Expressions): 表达式是一组代码的集合，它返回一个值,表达式是另一个十分常见的语法,函数表达式就是一种典型的表达式,如果你不理解什么是表达式, MDN上有很详细的解释.

3、声明(Declarations): 声明分为变量声明和函数声明,表达式(Expressions)中的函数表达式的例子用声明的写法就是下面这样.

```js
const parser = tokens => {
    // 声明一个全时指针，它会一直存在
    let current = -1;

    // 声明一个暂存栈,用于存放临时指针
    const tem = [];

    // 指针指向的当前token
    let token = tokens[current];

    const parseDeclarations = () => {

        // 暂存当前指针
        setTem();

        // 指针后移
        next();

        // 如果字符为'const'可见是一个声明
        if (token.type === 'identifier' && token.value === 'const') {
            const declarations = {
                type: 'VariableDeclaration',
                kind: token.value
            };

            next();

            // const 后面要跟变量的,如果不是则报错
            if (token.type !== 'identifier') {
                throw new Error('Expected Variable after const');
            }

            // 我们获取到了变量名称
            declarations.identifierName = token.value;

            next();

            // 如果跟着 '=' 那么后面应该是个表达式或者常量之类的,额外判断的代码就忽略了,直接解析函数表达式
            if (token.type === 'operator' && token.value === '=') {
                declarations.init = parseFunctionExpression();
            }

            return declarations;
        }
    };

    const parseFunctionExpression = () => {
        next();

        let init;
        // 如果 '=' 后面跟着括号或者字符那基本判断是一个表达式
        if (
            (token.type === 'parens' && token.value === '(') ||
            token.type === 'identifier'
        ) {
            setTem();
            next();
            while (token.type === 'identifier' || token.type === ',') {
                next();
            }

            // 如果括号后跟着箭头,那么判断是箭头函数表达式
            if (token.type === 'parens' && token.value === ')') {
                next();
                if (token.type === 'ArrowFunctionExpression') {
                    init = {
                        type: 'ArrowFunctionExpression',
                        params: [],
                        body: {}
                    };

                    backTem();

                    // 解析箭头函数的参数
                    init.params = parseParams();

                    // 解析箭头函数的函数主体
                    init.body = parseExpression();
                } else {
                    backTem();
                }
            }
        }

        return init;
    };

    const parseParams = () => {
        const params = [];
        if (token.type === 'parens' && token.value === '(') {
            next();
            while (token.type !== 'parens' && token.value !== ')') {
                if (token.type === 'identifier') {
                    params.push({
                        type: token.type,
                        identifierName: token.value
                    });
                }
                next();
            }
        }

        return params;
    };

    const parseExpression = () => {
        next();
        let body;
        while (token.type === 'ArrowFunctionExpression') {
            next();
        }

        // 如果以(开头或者变量开头说明不是 BlockStatement,我们以二元表达式来解析
        if (token.type === 'identifier') {
            body = {
                type: 'BinaryExpression',
                left: {
                    type: 'identifier',
                    identifierName: token.value
                },
                operator: '',
                right: {
                    type: '',
                    identifierName: ''
                }
            };
            next();

            if (token.type === 'operator') {
                body.operator = token.value;
            }

            next();

            if (token.type === 'identifier') {
                body.right = {
                    type: 'identifier',
                    identifierName: token.value
                };
            }
        }

        return body;
    };

    // 指针后移的函数
    const next = () => {
        do {
            ++current;
            token = tokens[current]
                ? tokens[current]
                : { type: 'eof', value: '' };
        } while (token.type === 'whitespace');
    };

    // 指针暂存的函数
    const setTem = () => {
        tem.push(current);
    };

    // 指针回退的函数
    const backTem = () => {
        current = tem.pop();
        token = tokens[current];
    };

    const ast = {
        type: 'Program',
        body: []
    };

    while (current < tokens.length) {
        const statement = parseDeclarations();
        if (!statement) {
            break;
        }
        ast.body.push(statement);
    }
    return ast;
};
```

## 四、过程2：代码转换
+ 代码解析和代码生成是babel。
+ 代码转换是babel插件

比如taro就是用babel完成小程序语法转换。

代码转换的关键是根据当前的抽象语法树，以我们定义的规则生成新的抽象语法树。转换的过程就是新的抽象语法树生成过程。

代码转换的具体过程：
+ 遍历抽象语法树（实现遍历器traverser）
+ 代码转换（实现转换器transformer）


## 五、过程3：代码转换生成代码（实现生成器generator）
生成代码这一步实际上是根据我们转换后的抽象语法树来生成新的代码,我们会实现一个函数, 他接受一个对象( ast),通过递归生成最终的代码

## 六、核心原理
Babel 的核心代码是 babel-core 这个 package，Babel 开放了接口，让我们可以自定义 Visitor，在AST转换时被调用。所以 Babel 的仓库中还包括了很多插件，真正实现语法转换的其实是这些插件，而不是 babel-core 本身。

## 优选文章
### 1、技术文章
+ [babel背后到底执行了什么？](https://mp.weixin.qq.com/s/Jd7sX1yNYdXPgepwlq-XLw)

+ [npm的原理](https://mp.weixin.qq.com/s/PSlUfdX3KGqvXdkC0xQ97w)

+ [快速学习Gulp并接入到项目中（一）](https://mp.weixin.qq.com/s/QQWzNvrXcqq_w3QKKvJagA)

+ [diff算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)

### 2、AB实验

+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

### 3、每日一题

+ [【每日一题】(58题)算法题：接雨水问题](https://mp.weixin.qq.com/s/OtCI6SjtLCI608LOQMFQ3A)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)


### 4、总结

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)

## 字节内推
### 1、校招内推
+ 我的内推码👉 8J5ZSB8
+ 投递链接👉 https://jobs.toutiao.com/s/eohNYt3
2022校招详情：https://mp.weixin.qq.com/s/AYkL1BA-QP4vdaMoAufElg

### 2、社招/实习生内推
在线岗位即为在招，内推链接进入投递即为内推，同样无笔试哦。
+ 投递链接：https://job.toutiao.com/s/eohRQ1L

### 3、查询
#### 自助查询

在PC端打开，https://job.bytedance.com/society/position/application

自助查进度可是说是很方便了，毕竟求职的心态「松宝写代码」也体会过，恨不得10分钟看一次进度。

+ 整体流程：简历投递=>简历筛选=>简历评估=>评估通过=>笔试中（非必要）=>面试中=>面试已完成=>待入职=>已入职

当流程中任意一环节挂掉了之后，岗位状态会变成已结束

简历的几种状态说明：

+ 简历筛选，代表HR初筛ing；
+ 简历评估，代表过了hr初筛，业务评估ing；
+ 评估通过，代表通过了业务评估，可等候通知笔试/面试；
+ 面试中，代表面试ing；
+ 如果出现已结束/已终止，则代表挂了

#### 联系「松宝写代码」查询

通过「松宝写代码」内推，且如果超1周没有进度更新，加文末「松宝写代码」微信发送【进度催查+名字+岗位】，松宝会帮你联系对应HR催查哦！还可拉入【写代码】研发进阶群，妈妈再也不担心求职字节遇到问题不知道问谁了。


各个城市的急招可以看这个【各个城市字节急招靠谱招聘汇总】https://www.yuque.com/books/share/39617705-0356-4cc4-a58f-90520a5f2379

其他详细可以：

+ [【2022秋招】内推？8000+Offer来袭](https://mp.weixin.qq.com/s/AYkL1BA-QP4vdaMoAufElg)
+ [字节内推Github](https://github.com/saucxs/job)

## 个人微信

![个人微信](https://cdn.nlark.com/yuque/0/2021/png/276016/1629471940324-1389ccfc-2eb1-4c2d-834c-4f02afbea9a9.png)
## 感谢支持
> 松宝，「松宝写代码」公众号作者，也用saucxs混迹于江湖，watermark-dom包700+ star，曾在ACM校队，在字节做AB实验，担任面试官，出校招编程题，爱好折腾，致力于全栈，喜欢挑战自己。公众号有精选文章，进阶学习，每日一题，实验室，AB实验，字节内推等模块，欢迎关注和咨询，和松宝一起写代码，冲冲冲！

