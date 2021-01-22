# 【每日一题】(31题)面试官:你对图论了解多少？

关注「松宝写代码」，精选好文，每日一题

>作者： Overstars
> https://shuangxunian.gitee.io/2020/08/24/graphTheory/

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

***

## 一、前言

今天我们约来了`Overstars`的图论总结，ACM打比赛，他的方向是思维数论图论。下文是他和他队友四年刷图论的总结。其实本身就是个笔记，以后方便打板子的。

> 原文地址：https://shuangxunian.gitee.io/2020/08/24/graphTheory/

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法等领域。

本文是：【每日一题】(31题)面试官:你对图论了解多少？

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)


## 二、图论

作者 Overstars

https://shuangxunian.gitee.io/2020/08/24/graphTheory/

![算法图论](https://img-blog.csdnimg.cn/20181119190833309.PNG)

### 1、常见概念

- 简单图：不含有平行边和环的图。
- 多重图：含有平行边（同向）的图。
- 完全图：每一对节点之间都有边的简单图，$n$个节点无向完全图记为$K_n$。
- 平面图：能将所有点和边画在平面上，且边与边不相交的**无向**图。
- 补图：由$G$中**所有节点**和所有能使$G$成为完全图的**添加边**组成的图。
- 生成子图(Spanning Subgraph)：含有原图$G$中所有结点的子图。
- 图同构的**必要条件**：
  1. 节点数相同。
  2. 边数相同。
  3. 度数相同的结点数相同。

#### 网络流常用概念

- 连通图：只有一个连通分支（极大连通子图）的图。
- 割点：无向连通图中一个顶点$v$,，若删除它以及关联的边后，得到的新图至少包含两个连通分支。
- 桥：无向连通图中的一条边$e$，删除它得到的新图包含两个连通分量。
- 团(Clique)：原图$G$的一个**完全**子图。
- 极大团(Maximal Clique)：不是其它团的子图的团。
- 最大团(Maximum Clique)：顶点最多的极大团。
- 诱导子图(Induced Subgraph)：所有节点在原图$G$上连接的边都被包含在内的子图。
- 独立集：在图上选出一些节点，这些**节点间两两无边**的点集。
- 路径覆盖：在图中找一些路径，这些路径覆盖图中所有的顶点，每个顶点都只与一条路径相关联。
- 最小染色数：用最少的颜色个数给点染色且任意两点相邻点颜色不同，最少的颜色个数。

#### 弦图常用概念

- 弦：连接环上两个不相邻节点的边。
- 弦图：图上任意一个点数大于三的环都至少存在一条弦的无向图。
- 单纯点：节点$v$与相邻节点的诱导子图是一个团。
- 完美消除序列：有$n$个点的排列$v_1,v_2,\dots,v_n$，该排列满足$v_i$在$\{v_i,v_{i+1},\dots,v_n\}$的诱导子图中是一个单纯点。
- **一个无向图是弦图当且仅当它有一个完美消除序列**

### 2、常见结论

- 每个图中节点**度数和**等于边数的二倍，$\sum\limits_{v\in V} deg(v)=2\left| E \right|$。
- 任何图中度数为奇数的节点必定有偶数个。
- 完全图$K_n$的边数$=\frac{n(n-1)}{2}$
- 最大团中顶点数量 = 补图的最大独立集中顶点数量
- 最大团数 ≤ 最小染色数，最大独立集 ≤ 最小团覆盖
- 弦图中：最大团数 = 最小染色数，最大独立集 = 最小团覆盖
- 平面图边数$m\le 3n-6$。
- git config --global core.autocrlf false和git config --global core.safecrlf true还有git init

### 3、弦图

#### 最大势算法求消除序列并判定弦图

判断一个消除序列是否为完美消除序列：从后向前枚举序列中的点$v_i$，设序列中在$v_i$后且与$v_i$相邻的点集**依次**为$\{v_{j1},v_{j2},\dots,v_{jk}\}$，判断$v_j1$是否与$\{v_{j2},\dots,v_{jk}\}$相邻即可。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn=1005;
struct edge
{
	int v,nex;
	edge(int v=0,int n=-1):
		v(v),nex(n){}
} e[maxn*maxn];
int cnt=0,head[maxn];
inline void add(int u,int v)
{
	e[++cnt].v=v;
	e[cnt].nex=head[u];
	head[u]=cnt;
}
int label[maxn],id[maxn],order[maxn];//id[i]表示节点i在序列中的编号
bool vis[maxn];//order[i]为完美消除序列第i个节点,label[x]表示x点与多少个已标号节点相邻
vector<int> vec[maxn];//vec[x]存储*与x个已标号节点相邻*的节点
void mcs(int n)//节点数量
{//复杂度O(n+m)
	memset(vis,0,sizeof(vis));
	memset(label,0,sizeof(label));
	for(int i=1;i<=n;i++)
		vec[0].push_back(i);
	int maxx=0,now=0;
	for(int i=1;i<=n;i++)
	{//从前往后,每轮必定会找出一个
		bool flag=0;
		while(!flag)
		{
			for(int j=vec[maxx].size()-1;j>=0;j--)
			{//从后往前找
				if(vis[vec[maxx][j]])//该节点已经标记过
					vec[maxx].pop_back();
				else{
					flag=1;//找到个未访问的节点
					now=vec[maxx][j];
					break;
				}
			}
			if(!flag)
				maxx--;
		}
		vis[now]=1;//
		order[n-i+1]=now;
		id[now]=n-i+1;//节点x在序列中的位置
		for(int j=head[now];~j;j=e[j].nex)
		{//遍历与now节点相邻的节点
			int v=e[j].v;
			if(!vis[v])
			{
				label[v]++;//v节点与已标号节点数++
				vec[label[v]].push_back(v);
				maxx=max(maxx,label[v]);//找出最大的那个节点
			}
		}
	}
}
int bucket[maxn];
bool isperfect(int n)
{//复杂度O(n+m)
	mcs(n);//计算消除序列并判断是否为完美消除序列
	memset(vis,0,sizeof(vis));//判断序列中的点v_i是否与其后所有点相接
	for(int i=n;i>0;i--)//序列从后向前
	{
		int tot=0,ret=1;//每轮桶清空
		for(int j=head[order[i]];~j;j=e[j].nex)
			if(id[e[j].v]>i)//排在序列编号x后面与x相邻的点集记为:N(x)
				vis[bucket[++tot]=e[j].v]=1;//序列中x后且与x邻接点标记并放入桶中
        for(int j=head[bucket[1]];~j;j=e[j].nex)//buc[1]的id为N(x)中最小？
		{//bucket[1]=0...
			int v=e[j].v;
			if(v!=bucket[1]&&vis[v])
			{//判断N(x)中排在最前面的点是否与N(x)其他点相邻
				ret++;
			}
		}
		for(int j=1;j<=tot;j++)
			vis[bucket[j]]=0;//防止每次memset超时
		if(tot&&ret!=tot)//不全部邻接
			return 0;
	}
	return 1;
}
int main()
{
	int n,m,u,v;
	while(cin>>n>>m&&n&&m)
	{
		memset(head,-1,sizeof(head));
		memset(order,0,sizeof(order));
		cnt=0;
		for(int i=1;i<=n;i++)
			vec[i].clear();
		for(int i=1;i<=m;i++)
		{
			cin>>u>>v;
			add(u,v);
			add(v,u);
		}
		cout<<(isperfect(n)?"Perfect\n\n":"Imperfect\n\n");
	}
	return 0;
}
```



### 4、三元环

#### 步骤

1. 对原无向图进行定向，对任何一条边，从度数大的点连向度数小的点，如果度数相同，从编号小的点连向编号大的点。得到一个有向无环图。
2. 枚举每一个节点$u$，将$u$所有相邻节点打上$u$的标记。再枚举$u$的相邻节点$v$，枚举$v$的相邻节点的相邻节点$w$，如果$w$上有被标记为$u$，则$(u,v,w)$就是一个三元环。

统计图上三元环数量，复杂度$O(m\sqrt{m})$。

```cpp
vector G[maxn];//新图
int vis[maxn],deg[maxn];
int cycle3(int n)
{
    int ans=0;
    for(auto &e:edges)
    {//统计原无向图度数
        deg[e.u]++;
        deg[e.v]++;
    }
    for(auto &e:edges)//建立新图
		if(deg[e.u]<deg[e.v]||(deg[e.u]==deg[e.v]&&e.u<e.v))
			G[e.u].push_back(edge(e.u,e.v));
		else
			G[e.v].push_back(edge(e.v,e.u));
    for(int u=1;u<=n;u++)
    {
        for(int v:G[u])
            vis[v]=u;//相邻节点打上u的标记
        for(int v:G[u])
            for(int w:G[v])
                if(vis[w]==u)
                    ans++;
    }
    return ans;
}
```

### 5、最短路

#### Dijkstra堆优化

复杂度$O(ElgE)$，稠密图中有时不如普通版优秀，但比SPFA快。


```cpp
const int MAXN=1050;
struct qnode{
	int v,c;
	qnode(int _v=0,int _c=0):v(_v),c(_c){}
	bool operator <(const qnode &r)const{
		return c>r.c;//重载运算符<
	}
};
struct Edge{
	int v,cost;
	Edge(int _v=0,int _cost=0):v(_v),cost(_cost){}
};
vector<Edge>E[MAXN];//使用前必须清空0~n
bool vis[MAXN];
int dist[MAXN];//到这个点的最近队员的
void Dijkstra(int n,int start)//传入总数及起点
{//点的编号从 1 开始
	memset(vis,false,sizeof(vis));
	for(int i=1;i<=n;i++)
		dist[i]=inf;
	priority_queue<qnode>que;
	while(!que.empty())
		que.pop();
	dist[start]=0;
	que.push(qnode(start,0));
	while(!que.empty())
	{
		qnode now=que.top();
		que.pop();
		int u=now.v;
		if(vis[u])
			continue;
		vis[u]=true;
		for(int i=0;i<E[u].size();i++)
		{
			int v=E[u][i].v;
			int cost=E[u][i].cost;
			if(!vis[v]&&dist[v]>dist[u]+cost){
				dist[v]=dist[u]+cost;
				que.push(qnode(v,dist[v]));
			}
		}
	}
}
void addedge(int u,int v,int w)
{
	E[u].push_back(Edge(v,w));
}
```

####  SPFA

最坏复杂度$O(VE)$，V为节点数，不适用于稠密图

检测负环：当存在一个点入队大于等于$V$次，则有负环

##### BFS实现（求最短路）

```cpp
const int inf=0x3f3f3f3f,MAXN=5051;
struct node
{
	int v,w,next;
} e[MAXN];
int cnt,dist[MAXN],head[MAXN],num[MAXN];
bool vis[MAXN];
void add(int u,int v,int w)//链式前向星存图,无向则双向添加
{
	e[cnt].v=v;//边的结尾节点
	e[cnt].w=w;
	e[cnt].next=head[u];//去找以u为起始的上一个节点(相当于链表,起始为-1)
	head[u]=cnt++;//保存该边(最后的边)在e[i]中的编号
}
bool SPFA(int n,int x)//节点数量n,起点编号x
{
	memset(dist,inf,sizeof(dist));
	memset(vis,0,sizeof(vis));
	memset(num,0,sizeof(num));
	dist[x]=0;//该题起点任意
	num[x]++;//入队次数++
	queue<int> QAQ;
	QAQ.push(x);
	while(!QAQ.empty())
	{
		int now=QAQ.front();
		QAQ.pop();
		vis[now]=0;//从队列中取出
		for(int i=head[now];i!=-1;i=e[i].next)
		{//遍历以now开头的所有边,尝试以x->now->to松弛x->to
			int to=e[i].v;//尝试松弛x->to的当前距离
			if(dist[to]>dist[now]+e[i].w)
			{
				dist[to]=dist[now]+e[i].w;//成功用x->now->to松弛x->to
				if(!vis[to])//x->to被成功松弛且to不在队列
				{
					vis[to]=1;//标记to加入队列
					QAQ.push(to);
					num[to]++;//to加入队列次数++
					if(num[to]>n)
						return 1;//有负权回路,无法求最短路径
				}
			}
		}
	}
	return 0;
}
```

##### DFS优化（负环检测）

请先用前向星加边。因为图有可能不连通，检测负环要枚举每个起点。

```cpp
bool spfa(int x)//DFS优化
{
	vis[x]=1;
	for(int i=head[x];~i;i=e[i].next){
		int v=e[i].v;
		if(dist[v]>dist[x]+e[i].w)//求最短路
		{
			dist[v]=dist[x]+e[i].w;
			if(vis[v])//存在一点在一条路径上出现多次，存在负权环
				return 0;
			if(!spfa(v))//搜到了存在负权环
				return 0;
		}
	}
	vis[x]=0;
	return 1;//未找到负权环
}
```

#### Floyd

```cpp
long long path[805][805];
void floyd(int n)//节点编号1~n
{
    for(int k=1;k<=n;k++)
        for(int i=1;i<=n;i++)
            for(int j=1;j<=n;j++)
                if(path[i][k]+path[k][j]<path[i][j])
                {//当i，j的原来的边的最短距离，大于经过k点所到达的距离就替换
                    path[i][j]=path[i][k]+path[k][j];
                }
}
```

## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)


## 字节内推福利
+ 回复「校招」获取内推码
+ 回复「社招」获取内推
+ 回复「实习生」获取内推

后续会有更多福利

## 学习资料福利
回复「算法」获取算法学习资料

## 往期「每日一题」

### 1、JavaScript && ES6

+ 第 28 题：[【每日一题】(28题)面试官:原型链与构造函数结合方法继承与原型式继承的区别？](https://mp.weixin.qq.com/s/uPUxo8gIGyHv-b_aWdgzaw)

+ 第 22 题：[【每日一题】(22题)面试官问：var与const,let的主要区别是什么？](https://mp.weixin.qq.com/s/wJ1cG7eQw85fpqpk_fHq7w)

+ 第 21 题：[【每日一题】(21题)面试官问：谈谈JS中的 this 的绑定？](https://mp.weixin.qq.com/s/WvDIjv_FNfDsD9OmB6SirA)

+ 第 20 题：[【每日一题】(20题)面试官问：谈谈JS中的 webSockets 的理解？](https://mp.weixin.qq.com/s/GA-Wl03ZDLhnBCAG0wTi0w)

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

### 4、HTML5
+ 第 29 道[【每日一题】(29题)面试官:HTML-HTML5新增标签属性的理解？](https://mp.weixin.qq.com/s/Lx5-bF-xliB9TBuEtE7dLw)

### 5、算法
+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 6、Node

+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

### 7、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)


