# 【每日一题】(33题)面试官:你对图论了解多少？(三)

关注「松宝写代码」，精选好文，每日一题

前两期的图论已经介绍完了，今天我们介绍第三期。

今天带来的是`Overstars`的图论总结，ACM打比赛，他的方向是思维数论图论。下文是他和他队友四年刷图论的总结。其实本身就是个笔记，以后方便打板子的。

> 作者： Overstars
> https://shuangxunian.gitee.io/2020/08/24/graphTheory/

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

***

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法等领域。

本文是：【每日一题】(33题)面试官:你对图论了解多少？(三)

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

前两期：

[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


## 二、汇总
+ 次小生成树
	+ 1、严格次小生成树(洛谷P4180)
	+ 2、有向图最小生成树（MDST，最小树形图）
	+ 3、朱刘算法（Edmonds 算法）
	+ 4、流程
	+ 5、模板
+ 虚树
	+ 1、步骤
	+ 2、代码示例
+ 拓扑排序
+ 补图搜索
	+ 1、补图连通块 0-1 MST


## 三、次小生成树

### 1、严格次小生成树(洛谷P4180)

建立最小生成树MST，倍增维护MST上任一点到LCA最大值与次大值。

记录树的重量val，并对边集中选中边进行标记。倍增算出每个节点到祖先的路径最大边与严格次大边权值。枚举每一条不在MST上的的边u->v(权值w)，分别计算新树上u->lca(u,v)与v->lca(u,v)的路径**最大边权M**与**严格次大边权m**，记录**最小非零**增量inc=w-M(当M==w时inc=w-m)。最后val+inc即为次小生成树重量。

复杂度瓶颈在排序，$O(mlogm)$
### 2、有向图最小生成树（MDST，最小树形图）


- 树形图：有向图$G=(V,E)$中，选定根节点$root$，$G$的一个以$root$为根节点的子图$T$，$T$中$root$到任意其他节点路径**存在且唯一**。则$T$称为有向图生成树/树形图DST。
- 最小树形图：带权有向图$G=(V,E,w)$中边权总和最小的DST，即Minimum Directed Spanning Trees。
- 特点：

  - MDST上一定有且仅有$n-1$条边
  - 根节点入度为0，其他节点入度为1
### 3、朱刘算法（Edmonds 算法）

### 4、流程

1. 对每个非根节点，找出权值最小的入边（n-1条），记为集合$E$。若$E$不存在，则MDST一定不存在。
2. 判断E中是否成环，成环转到步骤3，否则转到步骤4。
3. 若成环则进行**缩点**，同时更新指向该环的所有边的权值，此更新等效于删去环上的一条边。
   - 记该环为$C$，在新图$G_1$中收缩为点$u$，则对于在$G$图中不在环上的且指向该环上任一点$v$的一条边$<v_1,v>$，该边权值记为$w$，在$G_1$中存在边$<v_1,u>$与之对应，且该边权值$W_{G_1}(<v_1,u>)$=$W_{G}(<v_1,v>)-w$。
   - 因为任何一个节点入度都不会大于1，在环$C$上已经为点$v$选择了一条入边，所以要根据改边权值更新其他点$v$入边权值，当接下来选择了其他指向$v$的边时，相当于删去了$C$上指向$v$的边。
   - 转到步骤1，直到证明不存在或者求得。
4. 不成环则展开收缩点，获得MDST。若仅须获得MDST的权值，则不需要展开。

### 5、模板

朱刘算法，不包括展开部分，未优化，复杂度$O(VE)$

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int maxn=1005,inf=0x3f3f3f3f;
struct edge
{
	int u,v,w;
	edge(int u,int v,int w):
		u(u),v(v),w(w){}
};
vector<edge> G;//该算法会修改边
int id[maxn],in[maxn],pre[maxn],vis[maxn];//in[x]表示x入边最小权,pre[x]表示x最小入边的出点
ll zltree(int root,int n)//id[x]为x节点在G图上的编号
{
	ll ans=0;
	while(1)
	{
		fill(in,in+n+1,inf);
		for(auto &e:G)
			if(e.u!=e.v&&e.w<in[e.v])
			{
				pre[e.v]=e.u;//记录最小入边出点
				in[e.v]=e.w;//记录最小入边权
			}
		for(int i=1;i<=n;i++)
			if(i!=root&&in[i]==inf)
				return -1;//存在非根点没有入边,无MDST
		fill(id,id+n+1,0);
		memset(vis,0,sizeof(vis));
		int tn=0,v;//tn记录环的数量
		in[root]=0;//根节点无入边,权为0(这样不用特判)
		for(int i=1;i<=n;i++)//找环
		{
			ans+=in[v=i];//加v入边贡献
			while(vis[v]!=i&&!id[v]&&v!=root)//
				vis[v]=i,v=pre[v];//检查v的最小入边出点,并标记vis为i
			if(v!=root&&!id[v])
			{
				id[v]=++tn;//标记环的编号
				for(int u=pre[v];u!=v;u=pre[u])
					id[u]=tn;//将v所在环打上同一个标记
			}
		}
		if(tn==0)//无环
			break;
		for(int i=1;i<=n;i++)
			if(!id[i])//给不在环上的点新编号
				id[i]=++tn;
		for(int i=0;i<(int)G.size();)//更新为新图G1
		{
			auto &e=G[i];
			v=e.v;
			e.u=id[e.u],e.v=id[e.v];
			if(e.u!=e.v)//更新指向环的边权
				e.w-=in[v],i++;
			else
			{
				swap(e,G.back());
				G.pop_back();
			}
		}
		n=tn;//更新新图的点数
		root=id[root];//更新新图上根节点编号
	}
	return ans;
}
int main()
{
	int n,m,r,u,v,w;
	cin>>n>>m>>r;//n节点,m条边,根节点r
	for(int i=1;i<=m;i++)
	{
		cin>>u>>v>>w;
		G.push_back(edge(u,v,w));//有向
	}
	cout<<zltree(r,n)<<endl;
	return 0;
}
```

## 四、虚树

虚树是在树形dp中使用的一种特殊优化，适用于树中仅有**少量关键节点**且普通节点很多的情况。可以将关键点和他们的LCA拿出来另建一棵树，并在这棵树上另外进行树形dp。

### 1、步骤

 1. 在原树上进行dfs，进行LCA预处理，同时得到原树上的dfs序，方便之后虚树构造，此外还可以进行一些dp预处理，便于进行虚树上的第二次dp。
 2. 确定关键节点集合，并按照dfs序排序。
 3. 通过单调栈及LCA算法构建出虚树。
 4. 在虚树上进行树形dp求解。

### 2、代码示例

```cpp
sort(h+1,h+k+1,[](const int &x,const int &y){
    return dfn[x]<dfn[y];//按dfs序排序
});
stk[top=1]=h[1];
cnt2=0;
for(int i=2;i<=k;i++)
{
    int now=h[i];
    int lc=lca(now,stk[top]);//最近公共祖先
    //printf("lca(%d,%d)=%d\n",now,stk[top],lc);
    while(top>1&&dfn[lc]<=dfn[stk[top-1]])//情况4,=是情况3
    {//不断将top送入虚树
        adde(stk[top-1],stk[top]);//前向星加边,构建新树
        top--;
    }
    if(dfn[lc]<dfn[stk[top]])//情况2
    {//加边,top出栈,lc和now入栈
        adde(lc,stk[top]);
        stk[top]=lc;
    }//否则为情况1
    stk[++top]=now;
}
while(--top)
    adde(stk[top],stk[top+1]);
```



## 五、拓扑排序

只适用于DAG。

使用队列（要求字典序时使用优先队列），在邻接表存边时统计每个结点的入度，入度为0则入队。按出队顺序编号，删除以该节点为尾的边，该边边头**入度减1**，若变为0则入队。直到队列为空，得到top数组与node数组。

```cpp
const int maxn=105;
vector<int> G[maxn];
int n,m,top[maxn],node[maxn];//节点i拓扑顺序为top[i]
void topsort(void)
{//要求字典序：优先队列，小根堆
	priority_queue<int,vector<int>,greater<int> > QAQ;//若要求字典序用优先队列
	for(int i=1;i<=n;i++)
		if(G[i][0]==0)//G[i][0]表示入度
			QAQ.push(i);
	int cnt=0;
	while(!QAQ.empty())
	{
		int x=QAQ.top();
		top[x]=++cnt;//top[x]表示x号节点的次序编号
		QAQ.pop();
		for(int i=1;i<G[x].size();i++)
		{
			if(--G[G[x][i]][0]==0)//节点入度为0时入队
				QAQ.push(G[x][i]);
		}
	}
	if(cnt!=n)//
		return;
	for(int i=1;i<=n;i++)
		node[top[i]]=i;//node[i]表示排序为i的节点为node[i]
//	for(int i=1;i<=n;i++)
//		printf("%d%c",node[i],i<n?' ':'\n');//输出拓扑排序后的节点
	return;
}
int main()
{
	while(cin>>n>>m&&(n||m)){
		for(int i=1;i<=n;i++){
			G[i].clear();//注意清空
			G[i].push_back(0);//G[i][0]用来统计节点i的入度
		}
		for(int i=0;i<m;i++){
			int u,v;
			cin>>u>>v;
			G[u].push_back(v);//向G中加边
			G[v][0]++;//v的入度+1
		}
		topsort();
	}
	return 0;
}
```


## 六、补图搜索

也是很套路的题了，使用$set$数组来代替邻接表，用$set.find(v)$来确定边是否在图中。并查集、DFS、BFS都可以做。

### 1、补图连通块 [0-1 MST ](https://codeforc.es/contest/1243/problem/D)

初始化$ans=0$，并将所有的点放进一个未访问集合$unvis$中，当集合非空时，取出$unvis.begin()$记为$now$并从集合中去掉，并从该点开始BFS，遍历$nuvis$集，并在邻接表$set[now]$中查询，若$set.find()$未找到，则说明该边为补边。

```cpp
set<int> G[maxn];//使用set存原图,加快速度
int bfs(int n)
{
	int ans=0;
	set<int> unvis;//已访问节点,从原图上删除
	for(int i=1;i<=n;i++)
		unvis.insert(i);//将所有点加入到nuvis集合中
	while(!unvis.empty())//BFS求连通块个数
	{
		ans++;//从未访问集里拿出新的元素,新增一个连通块
		int now=*(unvis.begin());//取出第一个
		unvis.erase(now);
		queue<int> QwQ;
		QwQ.push(now);
		while(!QwQ.empty())//找出与now联通的节点,并从unvis中删去
		{
			int nex=QwQ.front();//与now联通的点之一
			QwQ.pop();
			vector<int> v1;//记录要删去的节点
			for(auto i:unvis)//遍历未访问集合
				if(G[nex].find(i)==G[nex].end())
				{//now与i由补边连接,权重为0
					v1.push_back(i);
					QwQ.push(i);//放进队列里,继续向下求联通点
				}
			for(int i=0;i<v1.size();i++)
				unvis.erase(v1[i]);//在集合中删去搜到的联通节点
		}
	}
	return ans;
}
```




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
+ 第 32 道[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

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
