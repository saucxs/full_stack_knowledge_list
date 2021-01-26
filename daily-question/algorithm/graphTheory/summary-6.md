
# 【每日一题】(36题)算法题：你对图论了解多少？(六)

关注「松宝写代码」，精选好文，每日一题

前五期的图论已经介绍完了，今天我们介绍第六期。

今天带来的是`Overstars`的图论总结，ACM打比赛，他的方向是思维数论图论。下文是他和他队友四年刷图论的总结。其实本身就是个笔记，以后方便打板子的。

> 作者： Overstars
> https://shuangxunian.gitee.io/2020/08/24/graphTheory/

2020，实「鼠」不易

2021，「牛」转乾坤

风劲潮涌当扬帆，任重道远须奋蹄！

***

## 一、前言

2020.12.23 立的 flag，每日一题，题目类型不限制，涉及到JavaScript，Node，Vue，React，浏览器，http，算法等领域。

本文是：【每日一题】(35题)算法题：你对图论了解多少？(五)

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

前5期：

[【每日一题】(35题)面试官:你对图论了解多少？(五)](https://mp.weixin.qq.com/s/_ICHDWO4ma_CbEbbemkxZw)

[【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


## 二、汇总
+ 树上启发式合并（DSU on tree）
	+ 1、流程
+ 二分图
	+ 1、定义
	+ 2、常见二分图结论
	+ 3、适用任意图的结论
	+ 4、二分图判定（黑白染色法）
	+ 5、匈牙利算法
	+ 6、KM算法


## 三、树上启发式合并（DSU on tree）

解决**离线子树查询**问题，即统计树上一个节点的子树中具有某种特征的节点数。

一般也可以使用DFS序莫队或DFS序主席树做。

时间复杂度$O(nlogn)$，空间复杂度$O(n)$。

### 1、流程

1. 先用dfs处理出重儿子
2. 使用DFS处理各子树信息，设当前子树根节点为x
   - **遍历**x的轻儿子，计算轻儿子子树贡献，**记录到ans数组**，信息不做保留。
   - 处理x的重儿子子树贡献，**记录到ans数组**，并保留。
   - 暴力统计节点x及所有轻儿子子树贡献，与x的重儿子子树贡献汇总，一同**回溯**到上一级，以便处理出以x节点的父节点为根的子树的贡献。

## 四、二分图

~~二分图如果不考虑复杂度的话，可以用网络流来做。~~

#### 定义

- 最大匹配：二分图中边集的数目最大的匹配。
- 点覆盖：图$G=(V,E)$中的一个点覆盖为一个集合$S⊆V$使得**每条边至少有一个端点**在$S$中。
- 最小点覆盖：点个数最少的$S$集合。
- 最小边覆盖：用最少不相交简单路径覆盖DAG所有顶点。
- 最小点权覆盖：覆盖每个节点都需要一定代价，覆盖所有边总代价最小的点集。
- 最大独立集：在点集$V$中选出$M$个点，$M$中点与点两两无边，并使$M$最大。

#### 常见二分图结论

- **最小点覆盖=二分图最大匹配**
- 最小边覆盖=顶点数-最小顶点覆盖（二分图最大匹配）
- 最大独立集=顶点数-最大匹配数
- 所有回路长度均为偶数

#### 适用任意图的结论

- 对于不存在孤立点的图，最大匹配+最小边覆盖=顶点数

- 最大独立集+最小顶点覆盖=顶点数

#### 二分图判定（黑白染色法）

A、B集合分别染成不同颜色（由边链接的两节点颜色一定不同）

A集合中选取一个起始节点，将邻接的点染成与其不同的颜色，如果邻接的点有相同颜色的，则说明不是二分图


#### 匈牙利算法

##### 邻接表

时间复杂度O(nm)，有重边时使用邻接矩阵？

```cpp
const int maxn=205;//在主函数内向关系图G中加边
vector<int> G[maxn];//注意使用前clear()
int linker[maxn];
bool used[maxn];
bool dfs(int x)//
{
	for(auto &v:G[x])
		if(!used[v])//在右边找
		{
			used[v]=1;
			if(!linker[v]||dfs(linker[v]))
			{
				linker[v]=x;//记录右边v号匹配
				return 1;
			}
		}
	return 0;//未找到增广路
}
int hungry(int n)
{
	int ans=0;
	memset(linker,0,sizeof(linker));
	for(int i=1;i<=n;i++)//遍历左面
	{
		memset(used,0,sizeof(used));
		if(dfs(i))//能找到增广路
			ans++;
	}
	return ans;
}
```



#### KM算法

- 二分图最佳完美匹配：带权二分图，求一种**完备匹配**方案，使得所有**匹配边的权和最大**。

##### BFS，复杂度稳的一批

复杂度$O(n^3)$，使用时清空w数组，并且按照关系为w赋值，调用KM(n)即可得到匹配边权值和。

```cpp
const int maxn=1005;
int w[maxn][maxn];//二分图间的权值
int lx[maxn],ly[maxn];
int linker[maxn];//B图匹配到的A图节点
int slack[maxn];
bool visy[maxn];//记录每一轮B图匹配过
int pre[maxn];
void bfs(int k,int n)
{
    int x,y=0,yy=0,delta;
    memset(pre,0,sizeof(pre));
    for(int i=1;i<=n;i++)
		slack[i]=INF;
    linker[y]=k;
    while(1)
	{
        x=linker[y];
        delta=INF;
        visy[y]=true;
        for(int i=1;i<=n;i++)
		{
            if(!visy[i])
            {
                if(slack[i]>lx[x]+ly[i]-w[x][i])
                {
                    slack[i]=lx[x]+ly[i]-w[x][i];
                    pre[i]=y;
                }
                if(slack[i]<delta)
					delta=slack[i],yy=i;
            }
        }
        for(int i=0;i<=n;i++)
        {
            if( visy[i] )
				lx[linker[i]]-=delta,ly[i]+=delta;
            else
				slack[i]-=delta;
        }
        y=yy;
        if(linker[y]==-1)
			break;
    }
    while(y)
		linker[y]=linker[pre[y]],y=pre[y];
}
int KM(int n)
{
    memset(lx,0,sizeof(lx));
    memset(ly,0,sizeof(ly));
    memset(linker,-1,sizeof(linker));
    for(int i=1;i<=n;i++)
	{
        memset(visy,false,sizeof(visy));
        bfs(i,n);
    }
    int ans=0;
	for(int i=1;i<=n;i++)
	{
		if(linker[i]!=-1)
			ans+=w[linker[i]][i];
	}
	return ans;
}
```

#####  左右数目不等的模板

```cpp
int wx[maxn],wy[maxn],match[maxn];
int mp[maxn][maxn],slack[maxn],pre[maxn];
bool viy[maxn];
void bfs(int k,int n,int m)
{
	int py=0,px,yy=0,delta;
	match[py]=k;
	for(int i=0;i<=n;i++)pre[i]=0,slack[i]=inf;
	do
    {
		px=match[py],delta=inf,viy[py]=1;
		for(int i=1;i<=n;i++)
        {
            if(!viy[i])
            {
                if(wx[px]+wy[i]-mp[px][i]<slack[i])slack[i]=wx[px]+wy[i]-mp[px][i],pre[i]=py;
                if(slack[i]<delta)delta=slack[i],yy=i;
            }
        }
		for(int i=0;i<=n;i++)
        {
            if(viy[i])wx[match[i]]-=delta,wy[i]+=delta;
			else slack[i]-=delta;
        }
		py=yy;
	}while(match[py]!=0);
	while(py)match[py]=match[pre[py]],py=pre[py];
}
int km(int n,int m)
{//n>=m,mp[m][n]这样输入匹配权值
    for(int i=1;i<=n;i++)
		wy[i]=0,match[i]=0;
	for(int i=1;i<=m;i++)
    {
		wx[i]=0;
		for(int j=1;j<=n;j++)
			wx[i]=max(wx[i],mp[i][j]);
	}
	for(int i=1;i<=m;++i)
		memset(viy,0,sizeof(viy)),bfs(i,n,m);
	int ans=0;
	for(int i=1;i<=n;++i)
		ans+=wx[match[i]]+wy[i];
	return ans;
}
```



##### CSL的写法

  ```cpp
const int maxn = 305;
const int INF=0x3f3f3f3f;//KM算法:带权的二分图中寻找*权值和最大*的完备匹配
int cost[maxn][maxn];//A[i]连接B[j]的权值
int lx[maxn], ly[maxn];
int match[maxn], slack[maxn];//B[i]匹配到的A,
int previous[maxn];
bool vy[maxn];//匹配过
void augment(int root,int n)
{
	fill(vy + 1, vy + n + 1, false);
	fill(slack + 1, slack + n + 1, INF);
	int py;
	match[py = 0] = root;
	do
	{
		vy[py] = true;
		int x = match[py], yy;
		int delta = INF;
		for (int y = 1; y <= n; y++)
		{
			if (!vy[y])
			{
				if (lx[x] + ly[y] - cost[x][y] < slack[y])
					slack[y] = lx[x] + ly[y] - cost[x][y], previous[y] = py;
				if (slack[y] < delta)
					delta = slack[y], yy = y;
			}
		}
		for (int y = 0; y <= n; y++)
		{
			if (vy[y])
				lx[match[y]] -= delta, ly[y] += delta;
			else
				slack[y] -= delta;
		}
		py = yy;
	}
	while(match[py] != -1);
	do
	{
		int pre = previous[py];
		match[py] = match[pre], py = pre;
	} while (py);
}
int KM(int n)
{
	for (int i = 1; i <= n; i++)
	{
		lx[i] = ly[i] = 0;
		match[i] = -1;
		for (int j = 1; j <= n; j++)
			lx[i] = max(lx[i], cost[i][j]);
	}
	int answer = 0;
	for (int root = 1; root <= n; root++)
		augment(root,n);
	for (int i = 1; i <= n; i++)
		answer += lx[i], answer += ly[i];
	return answer;
}
  ```




#### 更多阅读
+ [【每日一题】(35题)面试官:你对图论了解多少？(五)](https://mp.weixin.qq.com/s/_ICHDWO4ma_CbEbbemkxZw)

+ [【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

+ [【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ [【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ [【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


## 谢谢支持

1、作者昵称：saucxs，songEagle，松宝写代码。「松宝写代码」公众号作者，每日一题，实验室等。一个爱好折腾，致力于全栈，正在努力成长的字节跳动工程师，星辰大海，未来可期。**内推字节跳动各个部门各个岗位。**

2、长按下面图片，关注「松宝写代码」，是获取开发知识体系构建，精选文章，项目实战，实验室，**每日一道面试题**，进阶学习，思考职业发展，涉及到JavaScript，Node，Vue，React，浏览器，http，算法，端相关，小程序等领域，希望可以帮助到你，我们一起成长～

![松宝写代码](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/dongtai.gif?raw=true)

3、文章喜欢的话**可以「分享，点赞，在看」三连**哦。

4、**红包🧧福利**

各位大佬们，用电脑PC和掘金App，帮我每天帮忙打卡投票领红包：

+ 1、PC：https://rank.juejin.cn/?u=saucxs&t=user，每天投我x票，然后截图。

+ 2、APP：下载掘金APP，打开后从首页活动页进入，搜索saucxs，投我x票，然后截图。

+ 3、在「松宝写代码」后台回复我截图，然后我们抽奖发红包，从1.27开始每天都投递的，有更多惊喜。
