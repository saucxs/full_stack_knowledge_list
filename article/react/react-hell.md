> 松宝写代码

## 一、项目生成
- `create-react-app saucxs-web` 生成项目
- `cd saucxs-web` 进入项目
- `yarn start` 启动项目

## 二、项目部署
- 本地开发 `yarn start`
- 线上部署 `yarn build`

## 三、参考文档
- [react 英文文档](https://reactjs.org/docs/getting-started.html)
- [create-react-app](https://facebook.github.io/create-react-app/docs/getting-started)
- [ant UI库的配置参考](https://blog.csdn.net/qwe502763576/article/details/83242823)
- [react-router 英文](https://reacttraining.com/react-router/web/example/basic)
- [react-router 中文](http://router.happyfe.com/web/guides/quick-start)

## 四、配置项
### 1、Ant Design UI库引入
- `yarn add antd` 安装UI库
- `yarn add babel-plugin-import` 实现按需引入

**package.json/babel** 中增加如下内容：
``` json
"plugins": [
    [
        "import",
        {
            "libraryName": "antd",
            "libraryDirectory": "es",
            "style": "css"
        }
    ]
]
```
**组件使用** 如下：
``` javascript
import React, { Component } from 'react';
import { Button } from 'antd'
import 'antd/dist/antd.css'

class App extends Component {
  render() {
    return (
        <Button type="primary">松宝写代码</Button>
    );
  }
}

export default App;
```
此时可以使用UI库的默认样式

### 2、自定义Ant Design UI库样式
- 安装 `less` 和 `less-loader`
- 使用命令 `yarn run eject` 暴露配置文件
- 在 `webpack.config.dev.js` 与 `webpack.config.prod.js` 中做如下修改：

**创建 `antModifyVars.js` 文件**
``` javascript
'use strict';

const modifyVars = {
  'primary-color': '#E26A6A',
}

module.exports = modifyVars;
```

**创建 `less` 相关变量**，参考默认sass的配置：
``` javascript
// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// 增加less部分
const lessRegex = /\.less/;
const lessModuleRegex = /\.module\.less$/;
```

**在 `module.rules` 的 `oneOf` 下**， 仿照sass追加一下代码：
``` javascript
// Opt-in support for LESS (using .less extensions).
// Chains the less-loader with the css-loader and the style-loader
// to immediately apply all styles to the DOM.
// By default we support LESS Modules with the
// extensions .module.scss or .module.sass
{
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders({ importLoaders: 2 }, 'less-loader'),
},
// Adds support for CSS Modules, but using SASS
// using the extension .module.scss or .module.sass
{
    test: lessModuleRegex,
    use: getStyleLoaders(
    {
        importLoaders: 2,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
    },
    'less-loader'),
},
```
**在 `getStyleLoaders` 中**，处理 `less-loader`
``` javascript
// dev下的配置
if (preProcessor) {
    let loader = {loader: require.resolve(preProcessor)}
    if (preProcessor === "less-loader") {
        loader.options.modifyVars = modifyVars
        loader.options.javascriptEnabled = true
    }
    loaders.push(loader);
}

// prod下的配置
if (preProcessor) {
    let loader = {
         loader: require.resolve(preProcessor),
         options: {
            sourceMap: shouldUseSourceMap,
        },
    }
    if (preProcessor === "less-loader") {
        loader.options.modifyVars = modifyVars
        loader.options.javascriptEnabled = true
    }
    loaders.push(loader);
  }

```

###  3、ES6 API支持，引入polyfills
增加低版本浏览器、IE浏览器对ES6API的支持，IE9，IE9+

**方法一，安装 `yarn add react-app-polyfill`**
``` javascript
// src/index.js中的【第一行】引入对IE9及更高版本的支持
import 'react-app-polyfill/ie9';

// 其他支持，如：对IE11及更高版本的支持
import 'react-app-polyfill/ie11';
```

**方法二，安装 `yarn add babel-polyfill`**
``` javascript
// webpack.base.conf.js中引入：
require("babel-polyfill")

// webpack.base.conf.js中配置：
entry: { app: ['babel-polyfill', './src/main.js'] }
```

###  4、引入 react-router-dom 路由
- `react-router-dom` 依赖 `react-router`，所以使用npm安装依赖的时候，只需要安装相应环境下的库即可，不用再显式安装react-router。
- 由于需要权限配置，所以增加`AuthorizedRoute.js`控制权限

###  5、配置别名，@ 指向 src 目录
webpack.base.conf.js 与 webpack.base.conf.js的配置一致，如下：
``` javascript
定义resolvePath方法，新版中resolve名称被占用
function resolvePath (dir) {
  return path.join(__dirname, '..', dir)
}

// resolve.alias中增加别名配置：
'@': resolvePath('src')
```

### 6、引入 axios
在`package.json`底部增加以下代码解决跨域问题
``` javascript
// 新版本需要借助http-proxy-middleware，在src下创建setupProxy.js，内容：
// 会自动引用，不需要额外的配置
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy(
      '/api', {
        target: 'http://**********',
        changeOrigin: true
      }
    )
  )
}

// 定义多个入口：
module.exports = function (app) {
  app.use(proxy('/api', { target: 'http://localhost:7001' }));
  app.use(proxy('/api2', { target: 'http://localhost:7001' }));
}
```
#### 7、样式处理
使用react-css-modules实现组件内部样式与外部分离，使用方式：
``` javascript
import React from 'react'
import CSSModules from 'react-css-modules';
import { Button } from 'antd'
import styles from './Header.module.scss'

class Header extends React.Component {
  render () {
    return (
      <div>
        <Button type="primary" className="nowrap" styleName="test">松宝写代码</Button>
      </div>
    )
  }
}
export default CSSModules(Header, styles)
```
**注意**：
- 由于最新版create-react-app已经实现配置，无需再修改webpack配置文件
- 上述方法可实现，同时使用antd样式、全局样式、组件私有样式
- 特别注意组件私有样式文件的命名`[name].module.scss`

###  8、针对create-react-app 2.1.1之前的版本，引入 stylus
- 安装 `stylus` 和 `stylus-loader`
- 使用命令 `yarn run eject` 暴露配置文件
- 在 `webpack.config.dev.js` 与`webpack.config.prod.js` 的 `module/rules/oneOf` 中修改一下代码：

```javascript
{
    test: /\.(css|styl)$/,
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebookincubator/create-react-app/issues/2677
                    ident: 'postcss',
                    sourceMap: true,
                    plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        autoprefixer({
                            browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                    }),
                ],
            },
        },
        {
            loader: require.resolve('stylus-loader'),
            options: {
                sourceMap: true,
            }
        },
    ],
},
```

## 五、开发过程中遇到的问题
### 1、warning提示：no-op
[参考内容](https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/)

**问题描述**

warning：Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method

**名次解释** `no-op`

Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component.

也就是不能在卸载的组件中进行状态更新操作，如异步请求、事件、定时器等，在`componentWillUnmount`生命周期中都应该进行相应的取消处理

对于事件、定时器，只需要在componentWillUnmount方法中，进行取消事件监听或者清除定时器的操作即可

以下方案均针对异步操作带来的问题进行处理。

**方案一：使用一个变量[_isMounted]来控制是否更新状态**

```javascript
import React from 'react'

class newComponent extends React.Component {
  _isMounted = false

  componentDidMount() {
    this._isMounted = true
    axios
      .get('https://hn.algolia.com/api/v1/search?query=react')
      .then(result =>
      if (!this._isMounted) return
        this.setState({
          news: result.data.hits,
        }),
      )
  }

  componentWillUnmount() {
    // 取消事件监听、清除定时器、控制异步请求
    this._isMounted = false
  }

  render() {
    return (
      ...
    )
  }
}

export default newComponent
```

**方案二：比较粗暴的方式，直接更改setState函数**
```javascript
import React from 'react'

class newComponent extends React.Component {

  componentWillUnmount() {
    // 取消事件监听、清除定时器、控制异步请求
    this.setState = () => {
      return
    }
  }

  render() {
    return (
      ...
    )
  }
}

export default newComponent
```

**方案三，可直接取消接口请求，如axios的CancelToken**

### 2、react-router4.0版本中，不同场景下的路由跳转
[参考](https://github.com/brickspert/blog/issues/3)

**方案一，官方推荐，使用withRouter**
```javascript
import React from 'react'
import { withRouter } from 'react-router-dom'

class NewComponent extends React.Component {
  AFunction() {
    this.props.history.push('/path')
  }
  render() {
    return (
      ...
    )
  }
}
export default withRouter(NewComponent)
```

**方案二，不推荐，使用context**

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class NewComponent extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
     super(props, context);
  }
  AFunction() {
    this.context.router.history.push('/path')
  }
  render() {
    return (
      ...
    )
  }
}
export default NewComponent
```

**方案三，使用history**

在真实的业务场景中，经常需要在非react组件中使用路由跳转，如：接口统一处理场景下，用户登录失效时，跳转至登录页面。

由于react-router4.0中提供的BrowserRouter组件默认创建了history，并且未暴露出来，在非react中使用history会出现不起作用的情况

因此：可不使用BrowserRouter组件，自行创建一个history，如下：

+ 创建history

```javascript
// src/history.js 一定要放在src的根目录下
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
export default history
```
+ 配置router
 
```javascript
// src/index.js  注意router上的history
import { Router, Link, Route } from 'react-router-dom'
import history from './history'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      ...
    </Router>
  </Provider>,
  document.getElementById('root'),
)
```

+ 其他地方使用，如接口统一处理层

```javascript
import history from '@/history';

export function addProduct(props) {
  return dispatch =>
    axios.post('xxx', props, config)
      .then(response => {
        history.push('/cart')
      })
}
```


#### 更多阅读
+ [【每日一题】(55题)算法题：实现数组的全排列](https://mp.weixin.qq.com/s/0KKYgUXJpnJ2yIQ9DY8eJA)

+ [【每日一题】(54题)算法题：最大子序和](https://mp.weixin.qq.com/s/rqU8hZmmBXY5-9ycR7997g)

+ [【每日一题】(53题)算法题：数组中的 K-diff 数对](https://mp.weixin.qq.com/s/JziiqBhYHMw44DAR8FDzwA)

+ [【每日一题】(52题)算法题：合并两个有序数组](https://mp.weixin.qq.com/s/YHD1F0-evjwGjtkMdosioA)

+ [【每日一题】(51题)算法题：最大子序和](https://mp.weixin.qq.com/s/OB8hS_HWyVnwq8EvIYR_Fg)

+ [2020「松宝写代码」个人年终总结：未来可期](https://mp.weixin.qq.com/s/_ay6KfcC5DMoZu9XqS2NHA)


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位**。

3、关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～