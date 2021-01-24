
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
[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


## 二、汇总
+ 强连通分量
	+ 1、Tarjan缩点+DAG 拓扑排序dp
	+ 2、Tarjan无向图求割点
	+ 3、无向图求桥
+ 2-SAT问题
	+ 1、流程
	+ 2、建图方式
+ 最近公共祖先(LCA)
	+ 1、倍增
	+ 2、应用
+ 树上差分
	+ 1、性质
	+ 2、点的差分
	+ 3、边的差分



## 三、强连通分量

### 1、Tarjan缩点+DAG 拓扑排序dp

n个点m条边的有向图，每个点有一个权值，求一条路径，使路径经过的点权值之和最大。

思路：使用**Tarjan缩点**建立新图DAG，在DAG上进行拓扑排序并进行DP。

```cpp
const int maxn=100005;
int tot=0,Index=0,cnt=0;
int stk[maxn],dfn[maxn],low[maxn],belong[maxn];
int val[maxn],rec[maxn];//每个强连通分量的值
bool vis[maxn];
vector<int> G[maxn];//邻接表
void tarjan(int x)//标准的Tarjan缩点
{
	dfn[x]=low[x]=++tim;//dfs序
	stk[++Index]=x;
	vis[x]=1;
	for(int &v:G[x])
	{
		if(!dfn[v])//v未被访问
		{
			tarjan(v);
			low[x]=min(low[x],low[v]);//回溯时更新low
		}//low[x]为x所在强连通分量最早起始节点
		else if(vis[v])//v在栈中,说明有环
			low[x]=min(low[x],dfn[v]);//更新起点为最早的那个
	}
	if(low[x]==dfn[x])
	{//以x为起点的强连通分量
		cnt++;//新图节点++
		do{
			belong[stk[Index]]=cnt;
			rec[cnt]+=val[stk[Index]];//缩点后的权值
			vis[stk[Index]]=0;
			Index--;
		}while(stk[Index+1]!=x);
	}
}
vector<int> Gra[maxn];
int dp[maxn],top[maxn],into[maxn];
int topsort(void)
{
	queue<int> QAQ;
	for(int i=1;i<=cnt;i++)
	{
		if(!into[i])
			QAQ.push(i);
		dp[i]=rec[i];
	}
	int flag=0;
	while(!QAQ.empty())
	{
		int x=QAQ.front();
		QAQ.pop();
		top[x]=++flag;
		for(int i=0;i<Gra[x].size();i++)
		{
			dp[Gra[x][i]]=max(dp[Gra[x][i]],dp[x]+rec[Gra[x][i]]);
			if(--into[Gra[x][i]]==0)
				QAQ.push(Gra[x][i]);
		}
	}
	int ans=0;
	for(int i=1;i<=cnt;i++)
		ans=max(ans,dp[i]);
	return ans;
}
int main()
{
	int n,m;
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		cin>>val[i];//每个点的值
	for(int i=0;i<m;i++)
	{
		int u,v;
		cin>>u>>v;
		G[u].push_back(v);
	}
	for(int i=1;i<=n;i++)//Tarjan缩点部分
		if(!dfn[i])
			tarjan(i);//缩点
	for(int i=1;i<=m;i++)//拓扑排序部分
		for(int j=0;j<G[i].size();j++)
		{
			int x=belong[i],y=belong[G[i][j]];
			if(x!=y)
			{
				Gra[x].push_back(y);//建立新图DAG
				into[y]++;
			}
		}
	cout<<topsort()<<endl;
	return 0;
}
```

### 2、Tarjan无向图求割点

```cpp
int tot=0,Index=0,ans=0,cnt=0;
int dfn[maxn],low[maxn],stk[maxn];
bool vis[maxn],isc[maxn];
void tarjan(int x,int fa)
{
	dfn[x]=low[x]=++tot;
	int child=0;
	for(int i=0;i<G[x].size();i++)
	{
		int v=G[x][i];
		if(!dfn[v])
		{
			tarjan(v,x);
			low[x]=min(low[x],low[v]);
			if(x==fa)
				child++;
			if(x!=fa&&low[v]>=dfn[x])
				isc[x]=1;
		}
		else if(v!=fa)//不同之处
			low[x]=min(low[x],dfn[v]);
	}
	if(x==fa&&child>=2)
		isc[x]=1;
}
```

### 3、无向图求桥

```cpp
void tarjan(int x,int fa)
{
	dfn[x]=low[x]=++tot;
	bool vis=0;//处理重边要加上,表示这个节点还没有被子树搜到
	for(int i=0;i<G[x].size();i++)
	{
		int v=G[x][i].v,no=G[x][i].no;
		if(!dfn[v])
		{
			tarjan(v,x);
			if(low[v]>dfn[x])//讨论桥是大于
			{
				bri[no]=1;//法1，对桥的编号做标记
//				pair<int,int> tem;//法二，将桥存到新的数组中
//				tem.first=x,tem.second=v;
//				ans[flag++]=tem;
			}
			low[x]=min(low[x],low[v]);
		}
		else if(dfn[x]>dfn[v])//可改为无条件？
		{
			if(v==fa&&!vis)
				vis=1;//除了第一次，每次回到父节点都用父节点的值更新当前结点的值
			else//之前是v!=fa时才用父节点值更新该点的值
				low[x]=min(low[x],dfn[v]);
		}
	}
}
```

## 4、2-SAT问题

### 流程

1. 将点$i$拆成$i$与$n+i$两个点，分别表示点$i$状态为$0$或$1$，二者必须且只能取其一。
2. 根据所给逻辑关系建图，将$2n$个点进行缩点。
3. 若存在一对拆点位于同一个强连通分量，则无解。
4. 否则对于每个点对，选择**分量编号**较小的点（即拓扑序较大的那个）。

### 建图方式

| 逻辑表达式                    | 连接的有向边(推导关系)                                       |
| ----------------------------- | ------------------------------------------------------------ |
| $a\land b=1$                  | $\lnot a\rightarrow a,\lnot b \rightarrow b$                 |
| $a\land b=0$                  | $a\rightarrow \lnot b,b \rightarrow \lnot a$                 |
| $a \lor b=1$                  | $\lnot a\rightarrow b,\lnot b \rightarrow a$                 |
| $a \lor b=0$                  | $a\rightarrow \lnot a,b \rightarrow \lnot b$                 |
| $a\oplus b=1$                 | $\lnot a\rightarrow b,b \rightarrow \lnot a,\lnot b \rightarrow a,a\rightarrow \lnot b$ |
| $a\oplus b=0$，或$a\odot b=1$ | $a\rightarrow b,b\rightarrow a,\lnot a\rightarrow \lnot b,\lnot b\rightarrow \lnot a$ |
| $a\rightarrow b$              | $a\rightarrow b,\lnot b\rightarrow\lnot a$                   |
| $\lnot a\rightarrow\lnot b$   | $\lnot a\rightarrow\lnot b,b\rightarrow a$                   |

## 五、最近公共祖先(LCA)

因为LCA只适用于树，所以经常和生成树在一起考。

### 1、倍增

```cpp
const int maxn=100005;
const int maxl=30;
vector<int> G[maxn];//无权边,也可以选择链式前向星存图
int gene[maxn][maxl],depth[maxn],lg[maxn];
int nodes[maxn];//子树结点的数量
void dfs(int x,int fa)
{
	depth[x]=depth[fa]+1;
	gene[x][0]=fa;
	nodes[x]=1;
	for(int i=1;(1<<i)<=depth[x];i++)//倍增
		gene[x][i]=gene[gene[x][i-1]][i-1];
	for(int i=0;i<G[x].size();i++)
		if(G[x][i]!=fa)
		{
			dfs(G[x][i],x);//在dfs前后加语句可以求出许多有趣的东西
			nodes[x]+=nodes[G[x][i]];
		}
}
int lca(int x,int y)
{
	if(depth[x]<depth[y])//保证x深度≥y
		swap(x,y);
	while(depth[x]>depth[y])//将x提到同一高度
		x=gene[x][lg[depth[x]-depth[y]-1]];
	if(x==y)//是同一个节点
		return x;
	for(int i=lg[depth[x]];i>=0;i--)
		if(gene[x][i]!=gene[y][i])
		{//二分思想,直到跳到LCA的下面一层
			x=gene[x][i];
			y=gene[y][i];
		}
	return gene[x][0];
}
int dist(int x,int y)//x节点到y结点的距离
{
	int tem=lca(x,y);
	return (int)(abs(depth[x]-depth[tem])+abs(depth[y]-depth[tem]));
}
void init(int s,int n)
{
	memset(nodes,0,sizeof(nodes));
//	memset(gene,0,sizeof(gene));
	depth[s]=1;
    for(int i=1;i<=n;i++)//预处理出log2(i)+1的值
		lg[i]=lg[i-1]+((1<<(lg[i-1]+1))==i);//不要写错
	dfs(s,0);
}
```

### 2、应用

- 次小生成树：[P4180严格次小生成树](https://www.luogu.org/problem/P4180)

- 树上两条路径是否相交：[仓鼠找sugar ](https://www.luogu.org/problem/P3398)

  ```cpp
  u=lca(a,b),v=lca(c,d);
  if(dist(u,c)+dist(u,d)==dist(c,d)||dist(v,a)+dist(v,b)==dist(a,b))
  	cout<<"Yes"<<endl;
  ```

- 给定节点，求以它为LCA的节点有多少种组合：[找祖先 ](https://www.luogu.org/problem/P5002)，DFS回溯求出

- 分类讨论求树上到任意两点距离相等的点的个数（重点讨论中节点与LCA关系）：[A and B and Lecture Rooms ](https://www.luogu.org/problem/CF519E)

- 求两节点路径上最大/最小边的权值，若求最小即为求容量：[货车运输 ](https://www.luogu.org/problem/P1967)，DFS时倍增求出路径上min

## 六、树上差分

用于求解一些**树上路径**问题。

常见问法：将一棵树上从u到v路径上的**点/边**的权值加上x，询问**某点/边**的权值。

$O(1)$修改，$O(n)$查询，复杂度决定要离线。

强行在线可用**树链剖分**$O(logn \times logn)$修改，$O(logn \times logn)$查询。

修改差分数组之前先用DFS倍增求出各节点LCA。

差分数组记为power[maxn]，直接修改即可，查询时调用DFS


### 1、性质

- 树上任意两点之间有且只有一条路径
- 一个节点只有一个父节点
- $x$节点到$y$结点的路线为：$x→lca(x,y)→y$

### 2、点的差分

#### 操作

每次修改使$u$到$v$的路径上所有节点权值+1（包括端点），询问某一节点权值。

#### 修改

```
$power[u]++,\ power[v]++,\ power[lca(u,v)]--,\ power[father[lca(u,v)]]--$
```

### 2、边的差分

#### 操作

**以点代边**，$power[x]$代表$x$节点到父节点的边的权值。

若查询边的权值，则需要按输入顺序对每条边进行编号。

每次修改使节点$u$与节点$v$之间**所有边**权值+1，询问某一条边权值。

#### 修改
```
$power[u]++,\ power[v]++,\ power[lca(u,v)]-=2$
```

### 3、查询

```cpp
int power[maxn];//power[x]即为x节点权值
void dfs(int x)//查询，求出所有节点权值
{
	for(int i=head[x];~i;i=G[i].nex)//枚举x所有子节点
		if(G[i].v!=gene[x][0])//不为x父节点
		{
			dfs(G[i].v);//
			power[x]+=power[G[i].v];
		}
	ans=max(ans,power[x]);
}
```


#### 更多阅读
+ [【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ [【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ [[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


## 谢谢支持

1、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

2、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)

3、文章喜欢的话**可以「分享，点赞，在看」三连**哦。
