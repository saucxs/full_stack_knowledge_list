# npm的原理
npm成为世界最大的包管理器，原因：用户友好。

## 1、npm init
用来初始化一个简单的package.json文件。package.json文件用来定义一个package的描述文件。

**1、npm init的执行的默认行为**

执行`npm init --yes`，全部使用默认的值。

**2、 自定义npm init行为**

npm init命令的原理是：调用脚本，输出一个初始化的package.json文件。

获取用户输入使用prompt()方法。

## 2、依赖包安装
npm的核心功能：依赖管理。执行npm i从package.json中dependencies和devDependencies将依赖包安装到当前目录的node_modules文件夹中。

**1、package定义**

npm i <package>就可以安装一个包。通常package就是我们需要安装的包名，默认配置下npm会从默认的源（Registry）中查找该包名的对应的包地址，并且下载安装。
<package>还可以是一个指向有效包名的http url/git url/文件夹路径。

package的准确定义，符合以下a)到g)其中一个条件，他就是一个package：
![package的准确定义](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/package的准确定义.png?raw=true)

**2、安装本地包/远程git仓库包**

共享依赖包，并非非要把包发布到npm源上才能使用。

（1）场景1：本地模块引用

开发中避免不了模块之间调用，开发中，我们把频繁调用的配置模块放在根目录，然后如果有很多层级目录，后来引用

```
const config = require(''../../../../..config)
```
这样的路径引用不利于代码重构。这时候我们需要考虑把这个模块分离出来供其他模块共享。
比如config.js可以封装成一个package放到node_modules目录下。

不需要手动拷贝或者创建软连接到node_modules目录，npm 有自己的解决方案：

方案：

1、新增config文件夹，将config.js移入文件夹，名字修改为index.js，创建package.json定义config包

```json
{
    "name": "config",
    "main": "index.js",
    "version": "0.1.0"
}
```

2、在项目的package.json新增依赖项，然后执行npm i。
```json
{
  "dependencies": {
    "config":"file: ./config"
  }
}
```
查看 node_modules 目录我们会发现多出来一个名为 config，指向上层 config/ 文件夹的软链接。这是因为 npm 识别 file: 协议的url，得知这个包需要直接从文件系统中获取，会自动创建软链接到 node_modules 中，完成“安装”过程。

（2）场景2：私有git共享package

团队内会有一些代码/公用库需要在团队内不同项目间共享，但可能由于包含了敏感内容。

我们可以简单的将被依赖的包托管到私有的git仓库中，然后将git url保存到dependencies中。npm会直接调用系统的git命令从git仓库拉取包的内容到node_modules中。

npm支持的git url格式：
```
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
```
git 路径后可以使用 # 指定特定的 git branch/commit/tag, 也可以 #semver: 指定特定的 semver range.

比如：

```
git+ssh://git@github.com:npm/npm.git#v1.0.27
git+ssh://git@github.com:npm/npm#semver:^5.0
git+https://isaacs@github.com/npm/npm.git
git://github.com/npm/npm.git#v1.0.27

```

（3）场景3：开源package问题修复

此时我们可以手动进入 node_modules 目录下修改相应的包内容，也许修改了一行代码就修复了问题。但是这种做法非常不明智！

方案：

fork原作者的git库，在自己的repo修复问题，然后将dependencies中的相应依赖改为自己修复后版本的git url就可以解决问题。


## 3、npm install如何工作
npm i执行完毕，node_modules中看到所有的依赖包。开发人员无关注node_modules文件夹的结构细节，关注业务代码中引用依赖包。

理解node_modules结构帮助我们更好理解npm如何工作。npm2到npm5变化和改进。

### 3.1 npm2
npm2在安装依赖包，采用的是简单的递归安装方法。每一个包都有自己的依赖包，每一个包的依赖都安装在自己的node_modules中，依赖关系层层递进，构成整个依赖树，这个依赖树与文件系统中的文件结构树一一对应。

最方便的**依赖树的方式**在根目录下执行npm ls。

优点：
+ 1、层级结构明显，便于傻瓜式管理。

缺点：
+ 1、复杂工程，目录结构可能太深，深层的文件路径过长触发window文件系统中文件路径不能超过260个字符长。
+ 2、部分被多个包依赖的包在很多地方重复安装，造成大量的冗余。

### 3.2 npm3
npm3的node_modules目录改成更加扁平状层级结构。npm3在安装的时候遍历整个依赖树，计算最合理的文件夹安装方式，所有被重复依赖的包都可以去重安装。

npm来说，同名不同版本的包是两个独立的包。

npm3的依赖树结构不再与文件夹层级一一对应。

### 3.3 npm5
沿用npm3的扁平化依赖包安装方式。最大的变化时增加package-lock.json文件。

package-lock.json作用：**锁定依赖安装结构，**发现node_modules目录文件层级结构是与json的结构一一对应。

npm5默认会在执行npm i后生成package-lock.json文件，提交到git/svn代码库。

要升级，不要使用 5.0版本。

注意：在 npm 5.0 中，如果已有 package-lock 文件存在，若手动在 package.json 文件新增一条依赖，再执行 npm install, 新增的依赖并不会被安装到 node_modules 中, package-lock.json 也不会做相应的更新。
  

## 4、依赖包版本管理
介绍依赖包升级管理相关知识。

### 4.1 语义化版本semver
npm依赖管理的一个重要特性采用语义化版本（semver）规范，作为版本管理方案。

语义化版本号必须包含三个数字，格式：major.minor.patch。意思是：主版本号.小版本号.修改版本号。

我们需要在dependencies中使用semver约定的指定所需依赖包的版本号或者范围。

常用的规则如下图：

![semver语义化版本](https://github.com/saucxs/full_stack_knowledge_list/blob/master/image/font-end-image/semver语义化版本.png?raw=true)

**1、任意两条规则，用空格连接起来，表示“与”逻辑，即为两个规则的交集。**

如 >=2.3.1 <=2.8.0 可以解读为: >=2.3.1 且 <=2.8.0
+ 可以匹配 2.3.1, 2.4.5, 2.8.0
+ 但不匹配 1.0.0, 2.3.0, 2.8.1, 3.0.0

**2、任意两条规则，用||连接起来，表示“或”逻辑，即为两条规则的并集。**

如 ^2 >=2.3.1 || ^3 >3.2
+ 可以匹配 2.3.1, 2,8.1, 3.3.1
+ 但不匹配 1.0.0, 2.2.0, 3.1.0, 4.0.0

**3、更直观的表示版本号范围的写法**
+ * 或 x 匹配所有主版本
+ 1 或 1.x 匹配 主版本号为 1 的所有版本
+ 1.2 或 1.2.x 匹配 版本号为 1.2 开头的所有版本

**4、在 MAJOR.MINOR.PATCH 后追加 - 后跟点号分隔的标签，作为预发布版本标签**
通常被视为不稳定、不建议生产使用的版本。
+ 1.0.0-alpha
+ 1.0.0-beta.1
+ 1.0.0-rc.3

### 4.2 依赖版本升级
在安装完一个依赖包之后有新的版本发布了，如何使用npm进行版本升级呢？
+ npm i或者npm update，但是不同的npm版本，不同的package.json和package-lock.json文件，安装和升级表现是不同的。

使用npm3的结论：
+ 如果本地 node_modules 已安装，再次执行 install 不会更新包版本, 执行 update 才会更新; 而如果本地 node_modules 为空时，执行 install/update 都会直接安装更新包。
+ npm update 总是会把包更新到符合 package.json 中指定的 semver 的最新版本号——本例中符合 ^1.8.0 的最新版本为 1.15.0
+ 一旦给定 package.json, 无论后面执行 npm install 还是 update, package.json 中的 webpack 版本一直顽固地保持 一开始的 ^1.8.0 岿然不动

使用npm5的结论：
+ 无论何时执行 install, npm 都会优先按照 package-lock 中指定的版本来安装 webpack; 避免了 npm 3 表中情形 b) 的状况;
+ 无论何时完成安装/更新, package-lock 文件总会跟着 node_modules 更新 —— (因此可以视 package-lock 文件为 node_modules 的 JSON 表述)
+ 已安装 node_modules 后若执行 npm update，package.json 中的版本号也会随之更改为 ^1.15.0


### 4.3 最佳实践
我常用的node是8.11.x，npm是5.6.0。
+ 使用npm >= 5.1 版本，保持package-lock.json文件默认开启配置。
+ 初始化，npm i  <package>安装依赖包，默认保存^X.Y.Z，项目提交package.json和package-lock.json。
+ 不要手动修改package-lock.json
+ 升级依赖包：
    + 升级小版本，执行npm update升级到新的小版本。
    + 升级大版本，执行npm install <package-name>@<version> 升级到新的大版本。
    + 手动修改package.json中的版本号，然后npm i。
    + 本地验证升级新版本后没有问题，提交新的package.json和package-lock.json文件。
+ 降级依赖包：
    + 正确：npm i <package-name>@<version>验证没有问题后，提交package.json和package-lock.json文件。
    + 错误：修改package.json中的版本号，执行npm i不会生效。因为package-lock.json锁定了版本。
+ 删除依赖包：
    + A计划：npm uninstall <package>。提交package.json和package-lock.json。
    + B计划：在package.json中删除对应的包，然后执行npm i，提交package.json和package-lock.json。
       
       
       
## 5、npm的sctipts
### 5.1 基本使用
npm scripts是npm的一个重要的特性。在package.json中scripts字段定义一个脚本。

比如：
```json
{
    "scripts": {
        "echo": "echo HELLO WORLD"
    }
}
```
我们可以通过npm run echo 命令执行这段脚本，就像shell中执行echo HELLO WOLRD，终端是可以看到输出的。

总结如下：
+ npm run 命令执行时，会把./node_modules/.bin目录添加到执行环境的PATH变量中。全局的没有安装的包，在node_modules中安装了，通过npm run 可以调用该命令。
+ 执行npm 脚本时要传入参数，需要在命令后加 -- 表明，比如 npm run test -- --grep="pattern" 可以将--grep="pattern"参数传给test命令。
+ npm 还提供了pre和post两种钩子的机制，可以定义某个脚本前后的执行脚本。
+ 运行时变量：npm run 的脚本执行环境内，可以通过环境变量的方式获取更多的运行相关的信息。可以通过process.env对象访问获得：
    + npm_lifecycle_event：正在运行的脚本名称
    + npm_package_<key>：获取当前package.json中某一个字段的匹配值：如包名npm_package_name
    + npm_package_<key>_<sub-key>：package中的嵌套字段。

### 5.2 node_modules/.bin目录
保存了依赖目录中所安装的可供调用的**命令行包**。本质是一个可执行文件到指定文件源的映射。

例如 webpack 就属于一个命令行包。如果我们在安装 webpack 时添加 --global 参数，就可以在终端直接输入 webpack 进行调用。

上一节所说，npm run 命令在执行时会把 ./node_modules/.bin 加入到 PATH 中，使我们可直接调用所有提供了命令行调用接口的依赖包。所以这里就引出了一个最佳实践：

+ 将项目依赖的命令行工具安装到项目依赖文件夹中，然后通过 npm scripts 调用；而非全局安装

**于是 npm 从5.2 开始自带了一个新的工具 npx.** 

### 5.3 npx

npx 的使用很简单，就是执行 npx <command> 即可，这里的 <command> 默认就是 ./node_modules 目录中安装的可执行脚本名。例如上面本地安装好的 webpack 包，我们可以直接使用 npx webpack 执行即可。

### 5.4 用法
+ 1、传入参数

```json
"scripts": {
  "serve": "vue-cli-service serve",
  "serve1": "vue-cli-service --serve1",
  "serve2": "vue-cli-service -serve2",
  "serve3": "vue-cli-service serve --mode=dev --mobile -config build/example.js"
}
```
除了第一个可执行的命令，以空格分割的任何字符串都是参数，并且都能通过process.argv属性访问。

比如执行npm run serve3命令，process.argv的具体内容为：
```
[ '/usr/local/Cellar/node/7.7.1_1/bin/node',
  '/Users/mac/Vue-projects/hao-cli/node_modules/.bin/vue-cli-service',
  'serve',
  '--mode=dev',
  '--mobile',
  '-config',
  'build/example.js'
]
```

+ 2、多命令运行
在启动时可能需要同时执行多个任务，多个任务的执行顺序决定了项目的表现。

（1）串行执行

串行执行，要求前一个任务执行成功之后才能执行下一个任务。使用 && 服务来连接。
```
npm run scipt1 && npm run script2
```
> 串行执行命令，只要一个命令执行失败，整个脚本会中止的。

（2）并行执行

并行执行，就是多个命令同时平行执行，使用 & 符号来连接。
```
npm run script1 & npm run script2
```

+ 3、env 环境变量
在执行npm run脚本时，npm会设置一些特殊的env环境变量。其中package.json中的所有字段，都会被设置为以npm_package_ 开头的环境变量。


+ 4、指令钩子
在执行npm scripts命令（无论是自定义还是内置）时，都经历了pre和post两个钩子，在这两个钩子中可以定义某个命令执行前后的命令。
比如在执行npm run serve命令时，会依次执行npm run preserve、npm run serve、npm run postserve，所以可以在这两个钩子中自定义一些动作：

```json
"scripts": {
  "preserve": "xxxxx",
  "serve": "cross-env NODE_ENV=production webpack",
  "postserve": "xxxxxx"
}
```
+ 5、常用脚本示例

```
// 删除目录
"clean": "rimraf dist/*",

// 本地搭建一个http服务
"server": "http-server -p 9090 dist/",

// 打开浏览器
"open:dev": "opener http://localhost:9090",

// 实时刷新
"livereload": "live-reload --port 9091 dist/",

// 构建 HTML 文件
"build:html": "jade index.jade > dist/index.html",

// 只要 CSS 文件有变动，就重新执行构建
"watch:css": "watch 'npm run build:css' assets/styles/",

// 只要 HTML 文件有变动，就重新执行构建
"watch:html": "watch 'npm run build:html' assets/html",

// 部署到 Amazon S3
"deploy:prod": "s3-cli sync ./dist/ s3://example-com/prod-site/",

// 构建 favicon
"build:favicon": "node scripts/favicon.js",
```


## 6 npm配置
### 6.1 npm config
+ 通过npm config ls -l 可查看npm 的所有配置，包括默认配置。
+ 通过npm config set <key> <value>，常见配置：
    + proxy，https-proxy：指定npm使用的代理
    + registry：指定npm下载安装包时的源，默认是https://registry.npmjs.org。可以指定私有的registry源。
    + package-lock.json：指定是否默认生成package-lock.json，建议保持默认true。
    + save ：true/false指定是否在npm i之后保存包为dependencies，npm5开始默认为true。
+ 通过npm config delete <key> 删除指定的配置项。    


### 6.2 npmrc文件
可以通过删除npm config命令修改配置，还可以通过npmrc文件直接修改配置。
+ npmrc文件优先级由高到低，包括：
    + 工程内配置文件：项目根目录下的.npmrc文件
    + 用户级配置文件：用户配置里
    + 全局配置文件
    + npm内置配置文件
我们可以在自己的团队中在根目录下创建一个.npmrc文件来共享需要在团队中共享的npm运行相关配置。

比如：我们在公司内网下需要代理才能访问默认源：https://registry.npmjs.org源；或者访问内网的registry，就可以在工作项目下新增.npmrc文件并提交代码库。

示例配置：

```
proxy = http://proxy.example.com/
https-proxy = http://proxy.example.com/
registry = http://registry.example.com/
```
这种在工程内配置文件的优先级最高，作用域在这个项目下，可以很好的隔离公司项目和学习研究的项目两种不同环境。

**将这个功能与 ~/.npm-init.js 配置相结合，可以将特定配置的 .npmrc 跟 .gitignore, README 之类文件一起做到 npm init 脚手架中，进一步减少手动配置。**

### 6.3 node版本约束
一个团队中共享了相同的代码，但是每个人开发机器不一致，使用的node版本也不一致，服务端可能与开发环境不一致。

+ 这就带来了不一致的因素----方案：声明式约束+脚本限制。

+ 声明：通过package.json的engines属性声明应用运行所需的版本要求。例如我呢项目中使用了async，await特性，得知[node查阅兼容表格](https://node.green/)得知最低支持版本是7.6.0.因此指定engines配置为：

```json
{
  "engines": {"node": ">=7.6.0"}
}
```
+ 强约束(可选)：需要添加强约束，需要自己写脚本钩子，读取并解析engines字段的semver range并与运行环境做比对校验并适当提醒。

## 总结
+ npm init初始化新项目
+ 统一项目配置：需要团队共享npm config配置项，固化到.npmrc文件中
+ 统一运行环境：统一package.json，统一package-lock.json文件。
+ 合理使用多样化的源安装依赖包
+ 使用npm版本：>= 5.2版本
+ 使用npm scripts和npx管理相应脚本
+ 安全漏洞检查：npm audit fix修复安全漏洞的依赖包（本质：自动更新到兼容的安全版本）

#### 更多阅读
+ [快速学习Gulp并接入到项目中（一）](https://mp.weixin.qq.com/s/QQWzNvrXcqq_w3QKKvJagA)

+ [diff算法深入一下？](https://mp.weixin.qq.com/s/HwowUwWA4pkSIQ1J4fwr9w)

+ [AB实验：MAB多臂老虎机智能调优的基本原理](https://mp.weixin.qq.com/s/7Sz0dSFkWOEo2iw5xrcCLA)

+ [AB实验基础-专有名词](https://mp.weixin.qq.com/s/TXzuf_98yMojVAFlDv0CCQ)

+ [AB实验基础-AB是什么？AB的价值？为什么使用AB实验？](https://mp.weixin.qq.com/s/UcwpNqRQ3we10S9z5cO53g)

+ [【每日一题】(57题)数组扁平化的方法有哪些？](https://mp.weixin.qq.com/s/sXIJ6bQj97bZTaYHQgJTIw)

+ [【每日一题】(56题)介绍下深度优先遍历和广度优先遍历，如何实现？](https://mp.weixin.qq.com/s/KkqdB4mWlMgZMcHVhZVZXQ)

+ [【每日一题】(55题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)

## 感谢支持
> 「松宝写代码」公众号作者，昵称：saucxs，github上dom水印工具700+Star，曾经的ACM校队和数学建模队。现字节社招面试官，校招编程题出题，爱好折腾，致力于全栈，喜欢挑战自己。有精选文章，进阶学习，每日一题，实验室，AB实验等模块，涉及到JS，Node，Vue，React，浏览器，http，算法，端相关，小程序等方向。

