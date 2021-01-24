# 【每日一题】(32题)面试官:你对图论了解多少？(二)

关注「松宝写代码」，精选好文，每日一题

今天我们约来了`Overstars`的图论总结，ACM打比赛，他的方向是思维数论图论。下文是他和他队友四年刷图论的总结。其实本身就是个笔记，以后方便打板子的。

> 作者： Overstars
> https://shuangxunian.gitee.io/2020/08/24/graphTheory/

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

***

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法与数据结构等领域。

本文是：【每日一题】(32题)面试官:你对图论了解多少？(二)

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

我们接上一篇：[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


### 二、汇总
+ 最大团
	+ 1、最大团大小
+ 差分约束
	+ 1、定义
	+ 2、解法
+ 最小生成树（MST）
	+ 1、Prim算法
	+ 2、Kruskal
	+ 3、Boruvka
	+ 4、典型例题

### 三、最大团

#### 1、[最大团大小](https://www.luogu.com.cn/problem/P4212)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn=60;
int G[maxn][maxn],tmp[maxn][maxn];//tmp[i][j]搜到第i层
int n,ans,tot,f[maxn];
bool dfs(int dep,int num)//深度(团大小),备选集合
{
	if(num==0){
		if(dep>ans){
			ans=dep;
			return 1;
		}
		return 0;
	}
	for(int i=1;i<=num;i++){
		if(dep+num-i+1<=ans)
			return 0;
		int v=tmp[dep][i];
		if(dep+f[v]<=ans)
			return 0;
		int cnt=0;
		for(int j=i+1;j<=num;j++){
			int vv=tmp[dep][j];
			if(G[v][vv])
				tmp[dep+1][++cnt]=vv;
		}
		if(dfs(dep+1,cnt))
			return 1;
	}
	return 0;
}
int maxClique(int n)
{
	if(n==0)
		return 0;
	memset(f,0,sizeof(f));
	f[n]=ans=1;
	for(int i=n-1;i>=1;i--){
		tot=0;
		for(int j=i+1;j<=n;j++)
			if(G[i][j])
				tmp[1][++tot]=j;
		dfs(1,tot);
		f[i]=ans;
	}
	return ans;
}
int main()
{//回溯法求最大团
	scanf("%d",&n);
	int u,v;
	while(~scanf("%d%d",&u,&v))
		G[u][v]=G[v][u]=1;
	printf("%d\n",maxClique(n));
	return 0;
}
```

### 四、差分约束

#### 定义

如果一个系统是由n个变量和**m个约束条件**组成，并且每个约束条件能够形成形如$x_i−x_j\le c_k$的形式，我们就称该系统为差分约束系统。

#### 解法

先将不等号方向统一，统一为如上形式时，从$x_j$向$x_i$连一条权值为$c_k$的边。

### 五、最小生成树(MST)

#### 1、Prim算法

复杂度：邻接矩阵:$O(V^2)$，邻接表:$O(ElogV)$

```cpp
const int inf=0x3f3f3f3f,maxn=105;
int dist[maxn][maxn],closest[maxn],lowcost[maxn];
bool tree[maxn];
int prim(int n,int u0)
{
	memset(tree,0,sizeof(tree));
	tree[u0]=1;//加入树
	int i,j;
	for(i=1;i<=n;i++)//① 初始化,
		if(i!=u0){
			lowcost[i]=dist[u0][i];
			closest[i]=u0;//一开始只有u0
		}
		else
			lowcost[u0]=0;
	for(i=1;i<=n;i++)//② 每次选出来一个最近的节点
	{
		int temp=inf,t;
		for(j=1;j<=n;j++)//③ 在V-u中寻找最近的节点t
		{
			if(!tree[j]&&lowcost[j]<temp)
			{
				t=j;
				temp=lowcost[j];
			}
		}
		if(t==u0)//找不到t,没有可加入的节点,跳出
			break;
		tree[t]=1;//找到了就加入tree
		for(j=1;j<=n;j++)//④ 根据加入的t节点更新lowcost和closest
		{
			if(!tree[j]&&dist[t][j]<lowcost[j])
			{
				lowcost[j]=dist[t][j];
				closest[j]=t;
			}
		}
	}
	int ans=0;
	for(i=1;i<=n;i++)
		ans+=lowcost[i];
	return ans;
}
```

#### 2、Kruskal

使用并查集优化，复杂度$O(mlogm)$

这个不能忘吧……就先不贴了

#### 3、Boruvka

因为没有$kruskal$好写，所以一般不用于MST裸题。

适于处理**边权由连接的两个点的点权通过某种计算方式得出**的情况。

平均 $O(V+E)$，最坏 $O((V+E)logV)$。 

流程：

 1. 对每个连通块，处理出与其他连通块连接的最小代价，并记录这条边。

 2. 连接所有连通块与其最小连接代价的连通块，并将该边边权计入。

 3. 若剩余连通块数量大于1，重复上述步骤。

代码

```cpp
struct edge{
	int u,v,w;
};
vector<edge> E;
int boruvka(int n)
{
	for(int i=1;i<=n;i++)//n个连通块
		fa[i]=i;
	int ans=0;
	vector<int> cost(n+1),rec(n+1);
	vector<bool> vis(E.size(),false);
	while(1)
	{
		for(int i=1;i<=n;i++)
			cost[i]=inf;//初始化为inf
		int cur=0;//统计不同连通块
		for(int i=0;i<E.size();i++)
		{
			int a=findfa(E[i].u),b=findfa(E[i].v),w=E[i].w;
			if(a==b)
				continue;
			cur++;//记录a,b两个连通块连接的最小代价
			if(w<cost[a])
				cost[a]=w,rec[a]=i;//记录最小联通代价与相应边
			if(w<cost[b])
				cost[b]=w,rec[b]=i;
		}
		if(cur==0)
			break;
		for(int i=1;i<=n;i++)
		{//最坏情况是连接的连通块数目/2
			if(cost[i]<inf&&!vis[rec[i]])//与i相接的权值最小的边未加入
			{
				Merge(E[rec[i]].u,E[rec[i]].v);//连接两个连通块
				ans+=E[rec[i]].w;
				vis[rec[i]]=true;//标记该边已加入,避免重复计算
			}
		}
	}
	return ans;
}
```

#### 4、典型例题

- [打井问题 ](https://www.luogu.org/problem/P1550)：将地下水源缩成一个点，添加到图中，建立MST。
- 无根MDST：建立超级源点s，向每一个节点连接一条值为INF的边，以s为根跑MDST，s的出边即为答案MDST的树根。
- [异或生成树](https://www.luogu.com.cn/problem/CF888G)：字典树合并连通块




## 谢谢支持

1、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

2、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

3、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

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
+ 第 31 道[[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)

+ 第 27 道[【每日一题】(27题)算法题:如何使用多种解决方案来实现跳一跳游戏？](https://mp.weixin.qq.com/s/EY99dnyjjTvdBflpE5T2Fw)

+ 第 26 道[【每日一题】(26题)算法题:最长公共前缀？](https://mp.weixin.qq.com/s/1TzP0JgrzqXbQes1jzzwFg)

+ 第 25 道[【每日一题】(25题)算法题:堆数据结构-前 K 个高频元素？](https://mp.weixin.qq.com/s/desqLK9Wst9v7XPcNyvwlQ)

+ 第 24 道[【每日一题】(24题)算法题:贪心算法-环游世界之如何加油？](https://mp.weixin.qq.com/s/ST6pf00iBZiDs4GpGK0eOw)

+ 第 4 道[「每日一题」与面试官手撕代码：如何科学高效的寻找重复元素？](https://mp.weixin.qq.com/s/jFZ_2f272LhBBPuuLaWnyg)

### 6、Node

+ 第 23 道[【每日一题】(23题)面试官问：详细描述事件循环Event Loop？](https://mp.weixin.qq.com/s/hE-tK_PbSYkMms8P9b2H7A)

### 7、Http

+ 第 1 道[「一道面试题是如何引发深层次的灵魂拷问？」](https://mp.weixin.qq.com/s/O8j9gM5tD5rjLz1kdda3LA)
