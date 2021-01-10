# 【每日一题】(20题)面试官问：谈谈JS中的 webSockets 的理解？

关注「松宝写代码」，精选好文，每日一题

>作者：saucxs ｜ songEagle

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http等领域。

本文是「每日一题」第 20 题：【每日一题】面试官问：谈谈JS中的 webSockets 的理解？

这是一道很宽泛的题目，如何回答更有亮点？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png)


## 三、Web Sockets封装案例

Web Sockets封装案例:

这个是Event代码：

![Web Sockets封装案例的Event](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/websockets/carbon_1.png)

```
class Event {
  constructor (ctx) {
    this._events = {}
    this._ctx = ctx
  }

  /**
   * 绑定一个事件
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  on (name, cb, ctx) {
    return eventsOnApi(this, name, cb, ctx, false)
  }

  /**
   * 绑定一个事件,只执行一次
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  once (name, cb, ctx) {
    return eventsOnApi(this, name, cb, ctx, true)
  }

  /**
   * 卸载一个绑定的事件
   * @param name 事件名
   * @param cb 回调函数
   * @param ctx 上下文
   * @returns {Event}
   */
  off (name, cb, ctx) {
    var events = eventsApi(this, name, cb, ctx)
    for (var key in events) {
      var e = this._events[key]
      events[key].slice().forEach(function (item) {
        e.splice(e.indexOf(item), 1)
      })
    }
    return this
  }

  /**
   * 暂停某个事件，用法同off
   * @param name
   * @param cb
   * @param ctx
   */
  pause (name, cb, ctx) {
    return eventsPauseApi(this, name, cb, ctx, true)
  }

  /**
   * 恢复某个事件，继续触发回调，用法同off
   * @param name
   * @param cb
   * @param ctx
   */
  resume (name, cb, ctx) {
    return eventsPauseApi(this, name, cb, ctx, false)
  }

  emit (name) {
    var _this = this
    if (!name || typeof name !== 'string') return this
    var len = arguments.length
    var args = []
    var i = 1
    while (i < len) {
      args.push(arguments[i++])
    }

    name.split(/\s+/).forEach(function (ename) {
      if (ename && _this._events[ename]) {
        _this._events[ename].slice().forEach(function (handler) {
          if (handler.once) {
            handler.cb.apply(handler.ctx, args)
            _this.off(ename, handler.cb, handler.ctx)
          } else if (!handler.pause) {
            handler.cb.apply(handler.ctx, args)
          }
        })
      }
    })

    return this
  }
}

/**
 * 找到符合规则的事件，off,pause,resume 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @return events
 */
function eventsApi (self, name, cb, ctx) {
  var events = {}

  // name 存在时，找到所有name下的事件列表
  if (name) {
    name.split(/\s+/).forEach(function (ename) {
      if (ename && self._events[ename]) {
        events[ename] = self._events[ename]
      }
    })
  } else {
    for (var key in self._events) {
      events[key] = self._events[key]
    }
  }

  var keys = Object.keys(events)

  if (keys.length === 0) return events

  if (cb && typeof cb === 'function') {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.cb === cb
      })
    })
  }

  if (ctx) {
    keys.forEach(function (key) {
      events[key] = events[key].filter(function (e) {
        return e.ctx === ctx
      })
    })
  }

  return events
}

// 暂停,恢复通用方法
function eventsPauseApi (self, name, cb, ctx, pause) {
  var events = eventsApi(self, name, cb, ctx)
  for (var key in events) {
    events[key].forEach(function (item) {
      item.pause = pause
    })
  }

  return self
}

/**
 * on,once 通用方法
 * @param self Event实例
 * @param name 事件名，可以是空格隔开的多个事件名
 * @param cb 回调函数
 * @param ctx 绑定回调函数的上下文
 * @param once 是否是once
 * @return self
 */
function eventsOnApi (self, name, cb, ctx, once) {
  if (!name || typeof cb !== 'function' || typeof name !== 'string') return self
  name.split(/\s+/).forEach(function (ename) {
    var handlers = self._events[ename] || []
    handlers.push({
      cb: cb,
      ctx: ctx || self._ctx,
      pause: false,
      once: once
    })
    self._events[ename] = handlers
  })
  return self
}

export default Event
```

这个是websockets代码：

![Web Sockets封装案例的Index](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/JavaScript/websockets/carbon.png)

```
import Event from './event.js'

const settings = {
  url: null,
  protocols: null,
  debug: false,
  // 实例化时直接创建连接，无须手动open
  automaticOpen: true,
  // 自动尝试连接
  automaticReconnect: true,
  // 每次尝试连接的事件间隔
  reconnectInterval: 1000,
  // 最大延迟连接的事件间隔
  maxReconnectInterval: 30000,
  // 重新尝试连接的比率
  reconnectDecay: 1.5,
  // 连接超时事件，毫秒值
  timeoutInterval: 2000,
  // 最大连接数
  maxReconnectAttempts: null,
  // 二进制类型，默认blob，或者arraybuffer
  binaryType: 'blob'
}

class WebSocketIO extends Event {
  constructor (url, protocols, options = {}) {
    super()
    if (isPlainObject(protocols)) {
      options = protocols
      protocols = null
    }
    // 设置配置
    this.setConfig(options)

    this.url = url
    // 可以是一个单个的协议名字字符串或者包含多个协议名字字符串的数组。这些字符串用来表示子协议，这样做可以让一个服务器实现多种WebSocket子协议
    this.protocols = protocols
    // 后端指定的子协议
    this.protocol = null
    // websocket的实例
    this.io = null
    // 手动关闭
    this.forcedClose = false
    // 是否被销毁
    this.active = true
    // 重新尝试连接的次数
    this.reconnectAttempts = 0
    // 数据缓存池
    this.polls = []

    // 自动打开连接
    if (this.automaticOpen === true) {
      this.open(false)
    }
  }

  setConfig (options) {
    if (!isPlainObject(options)) return
    // 代理设置选项
    for (let key in settings) {
      if (typeof options[key] !== 'undefined') {
        this[key] = options[key]
      } else if (this[key] == null) {
        this[key] = settings[key]
      }
    }
  }

  start (options) {
    this.setConfig(options)
    this.open(false)
  }

  get readyState () {
    if (this.io) {
      return this.io.readyState
    }
  }

  open (reconnectAttempt) {
    // 已经销毁或已经存在io实例不做处理
    if (!this.active || this.io) return
    try {
      this.io = new WebSocket(this.url, this.protocols)
    } catch (e) {
      this.emit('error', e)
      throw e
    }

    // 再次尝试连接
    if (reconnectAttempt) {
      if (
        this.maxReconnectAttempts &&
        this.reconnectAttempts > this.maxReconnectAttempts
      ) {
        return
      }
    } else {
      this.reconnectAttempts = 0
    }

    // 触发connecting事件，通知正在连接
    this.emit('connecting')
    log('attempt-connect', this)

    // 设置超时
    this.timeId = setTimeout(() => {
      log('connection-timeout', this)
      this.timeoutClosed = true
      this.io.close()
      this.timeoutClosed = false
    }, this.timeoutInterval)

    // 监听WebSocket的回调事件
    attachEvent(this, this.io, reconnectAttempt)
  }

  // 发送数据
  send (data) {
    if (this.readyState === 1) {
      log('send data: ', data, this)
      return this.io.send(data)
    } else {
      console.error('WebSocket实例不存在，请尝试重新连接')
    }
  }

  // 写数据, 会缓存数据, 返回0：直接发送，大于0：缓存，-1：无效状态
  write (type, payload) {
    if (this.readyState === 1) {
      this.send(JSON.stringify({ type, payload }))
      return 0
    } else if (this.active) {
      // 注意内存泄漏
      this.polls.push(JSON.stringify({ type, payload }))
      return this.polls.length
    }
    return -1
  }

  flush () {
    const polls = this.polls
    for (let i = 0, length = polls.length; i < length; i++) {
      this.send(polls[i])
    }
    this.polls = []
  }

  close (reason, code = 1000) {
    if (!this.active) return
    this.forcedClose = true
    if (this.io) {
      this.io.close(code, reason)
    }
  }

  destroy () {
    if (this.active) {
      this.close('destroy')
      this.active = false
    }
  }
}

function attachEvent (ws, io, reconnectAttempt) {
  io.onopen = function (e) {
    clearTimeout(ws.timeId)
    log('open', ws)
    this.reconnectAttempts = 0
    ws.protocol = io.protocol
    ws.emit('open', e)
    ws.flush()
  }

  io.onclose = function (e) {
    clearTimeout(ws.timeId)
    ws.io = null
    if (ws.forcedClose) {
      ws.emit('close', e)
      if (!ws.active) {
        // 通过destroy销毁对象，在执行完事件通知完毕后，清空事件
        ws._events = {}
      }
    } else {
      // 尝试再次拦截
      if (!reconnectAttempt && !ws.timeoutClosed) {
        ws.emit('close', e)
      }

      if (!ws.automaticReconnect) return

      const timeout =
        ws.reconnectInterval * Math.pow(ws.reconnectDecay, ws.reconnectAttempts)
      setTimeout(function () {
        ws.reconnectAttempts++
        ws.open(true)
      }, timeout > ws.maxReconnectInterval ? ws.maxReconnectInterval : timeout)
    }
  }

  io.onmessage = function (e) {
    log('onmessage: ', e.data, ws)
    ws.emit('message', e.data)
    if (typeof e.data === 'string') {
      try {
        const data = JSON.parse(e.data)
        if (data.type) {
          ws.emit(data.type, data.payload)
        }
      } catch (e) {
        log('onmessage: 解析失败，接受的数据不是json格式', ws)
      }
    }
  }

  io.onerror = function (e) {
    log('onerror: ', e, ws)
    ws.emit('error', e)
  }
}

function log (...args) {
  const ws = args[args.length - 1]
  if (ws.debug) {
    const e = args.slice(0, args.length - 1)
    console.log(...e)
  }
}

function isObjectLike (obj) {
  return obj != null && typeof obj === 'object'
}

const objectProto = Object.prototype
const toString = obj => objectProto.toString.call(obj)

function isPlainObject (obj) {
  if (!isObjectLike(obj) || toString(obj) !== '[object Object]') {
    return false
  }
  const proto = Object.getPrototypeOf(obj)
  if (proto === null) {
    return true
  }

  return proto.constructor === Object
}

export default WebSocketIO
```

Web Sockets的目标：在一个单独的持续连接上提供全双工、双向通信

Web Sockets使用自定义的协议，与http一样，是应用层的协议

好处是：
- 能够在客户端、服务端发送非常少量的数据，不必担心`HTTP字节级`的开销
- 传递数据包小，更适用于移动端，对于移动端，带宽和网络延迟是一个关键问题

`坏处是：制定协议的时间比制定JS API的时间都长`

与HTTP的不同之处：
- http只能由客户端发起，而webSocket是双向的
- webSocket传输的数据包相对于http而言很小，很适合移动端使用
- 没有同源限制，可以跨域共享资源

支持的浏览器：Firfox6+ Safari5+ Chrome IOS 4+版本的Safari

## 四、WebSockets使用
1、创建WebSockets实例
```
var ws = new WebSockets('ws://example.com')
```
需要注意的是：
- URL的模式：`ws://`，加密情况下为：`wss://`
- 必须是绝对URL，也就是完整的URL

2、创建实例后，会立即尝试连接，与XMLHttpRequest类似，存在一个readyState属性表示当前状态。
- WebSocket.OPENING(0) 正在建立连接
- WebSocket.OPEN(1) 已经建立连接
- WebSocket.CLOSEING(2) 正在关闭连接
- WebSocket.CLOSE(3) 已经关闭连接

3、发送数据与接收数据
使用send()方法发送数据，接收到的数据时会触发message事件
```
ws.send('hello')
ws.onmessage = function (event) {
  console.log(event.data)
}
```
注意：
- send发送数据时，数据必须是纯文本的格式
- message返回的数据也是字符串的格式
- WebSocket对象不支持DOM2级事件侦听器，必须使用DOM0级 对每个事件分别处理

其他事件
- open 成功建立连接时触发
- error 发生错误时触发，连接不能继续
- close 连接关闭时触发，只要close的event对象有格外的信息
  - wasClean 是否明确关闭
  - code 服务器返回的数值状态码
  - reason 字符串，包含服务端返回的信息


## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif)


## 字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

## 学习资料福利
回复「算法」获取算法学习资料

## 往期「每日一题」

### 1、JavaScript && ES6

+ 第 19 题：[【每日一题】面试官问：谈谈JS中的 XMLHttpRequest 对象的理解？](https://mp.weixin.qq.com/s/wxIEGJVmfxq0Q-8E4tbv1A)

+ 第 18 题：[【每日一题】面试官问：JS中的 Ajax 跨域与扩展 Comet ？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 17 题：[【每日一题】(17题)面试官问：JS中事件流，事件处理程序，事件对象的理解？](https://mp.weixin.qq.com/s/mb8TRlw1yzEOfDzMyYLW2g)

+ 第 16 题：[【每日一题】面试官问：JS中如何全面进行客户端检测？](https://mp.weixin.qq.com/s/-tNI1vwdK_SAxNGRQTCd1Q)

+ 第 15 题：[【每日一题】面试官问：JS类型判断有哪几种方法？](https://mp.weixin.qq.com/s/UwVgQMaVPg6Z0SVgn4kqwA)

+ 第 14 题：[【每日一题】面试官问：谈谈你对JS对象的创建和引申](https://mp.weixin.qq.com/s/-HTpVMFMRDu8sElNv-WqIw)

+ 第 13 题[[每日一题]面试官问：['1', '2', '3'].map(parseInt)输出，原因，以及延伸？](https://mp.weixin.qq.com/s/DJ6Av4tQgJpqa8hKAPk_uA)

+ 第 12 题[[每日一题]面试官问：JS引擎的执行过程（二）](https://mp.weixin.qq.com/s/CCUsCM2vzb6S1wcwIsjQuA)

+ 第 11 题[[每日一题]面试官问：JS引擎的执行过程（一）](https://mp.weixin.qq.com/s/Lhd5N5a1b8fAstWn5H3B3Q)

+ 第 10 题[[每日一题]面试官问：详细说一下JS数据类型](https://mp.weixin.qq.com/s/wm0EGVXTTHoHMcdUxMQmKA)

+ 第 8 题[[每日一题]面试官问：谈谈你对ES6的proxy的理解？](https://mp.weixin.qq.com/s/8loJlarVrmj47XjgrZLI1w)

+ 第 7 题[[每日一题]面试官问：for in和for of 的区别和原理？](https://mp.weixin.qq.com/s/RsynH85UkAwAgIAzwxs-Ag)

+ 第 6 题[[每日一题]面试官问：Async/Await 如何通过同步的方式实现异步？](https://mp.weixin.qq.com/s/UAYBnQvekRugR8DVEUPB3Q)

+ 第 3 道[「「每日一题」面试官问你对 Promise 的理解？可能是需要你能手动实现各个特性」](https://mp.weixin.qq.com/s/QuuPd2KCp50snN7F2o3oYg)

+ 第 2 道[「[每日一题]ES6 中为什么要使用 Symbol？」](https://mp.weixin.qq.com/s/omeVJdtabo5MeN3DItDfWg)

### 2、浏览器

+ 第 9 题[[每日一题]requestAnimationFrame不香吗？](https://mp.weixin.qq.com/s/4Ob_CEiZUyoHKxffAeAYdw)


### 3、Vue

+ 第 5 道[「每日一题」到底该如何回答：vue数据绑定的实现原理？](https://mp.weixin.qq.com/s/8eo4frdB-zMA7nD_1wdnLw)

### 4、算法

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 5、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)

