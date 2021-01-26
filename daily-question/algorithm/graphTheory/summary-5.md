
# 【每日一题】(35题)算法题：你对图论了解多少？(五)

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

本文是：【每日一题】(35题)算法题：你对图论了解多少？(五)

![每日一题](https://raw.githubusercontent.com/saucxs/full_stack_knowledge_list/master/daily-question/daily_question.png?raw=true)

前4期：

[【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

[【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

[【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)



## 二、汇总
+ 树链剖分
	+ 1、通用模板
	+ 2、P3384 树链剖分
+ 点分治
	+ 1、树的重心
	+ 2、流程
	+ 3、例题

## 三、树链剖分

注意以点代边的思想

- 功能
  1. 更新/查询某个节点子树的权值
  2. 更新/查询树上两个节点间所有点的权值
- 性质
  1. 子树的时间戳一定全部小于父节点，并且连续（所以可用线段树维护）
  2. 任何一条路径都是由重链的一部分与重链间的叶子节点构成
  3. 任何父节点都一定在一条重链上（所以可用top的父节点跳链）
- 例题
  1. [P3384 树链剖分 ](https://www.luogu.org/problem/P3384)

### 1、通用模板

```cpp
int n,tot=0,head[maxn];
ll val[maxn];//给定的每个节点的权值
struct edge
{//边权一般不必记录到这里
	int v,w,nex;
} e[maxn<<1];
inline void add(int u,int v,int w=0)
{
	e[++tot].v=v;
	e[tot].w=w;
	e[tot].nex=head[u];
	head[u]=tot;
}
//以点代边:以节点的权值代表该节点到父节点边的权值,修改与查询跳过链顶点即可(最终的参数改为dfn[x]+1)
//使用前先初始化,然后加边,dfs1(rt,rt),dfs2(rt,rt),build(1,1,n),使用封装好的函数修改+查询
namespace hld{//heavy-light decomposition
	int father[maxn],son[maxn],depth[maxn],siz[maxn];//父节点,重儿子节点,深度,子树大小
	int tim=0,dfn[maxn],rk[maxn],top[maxn];//计数器,时间戳(节点编号),访问顺序,节点所在重链的顶部节点
	ll w[maxn];//节点dfs序对应权值
	void init()
	{
		tim=tot=0;
		memset(head,-1,sizeof(head));
		memset(depth,0,sizeof(depth));
//		memset(father,0,sizeof(father));
		memset(son,0,sizeof(son));
//		memset(top,0,sizeof(top));
//		memset(dfn,0,sizeof(dfn));
	}
	void dfs1(int x,int fa)
	{//预处理出深度,父节点,重儿子,子树大小
		depth[x]=depth[fa]+1;
		father[x]=fa;
		siz[x]=1;
		int maxsiz=-1;
		for(int i=head[x];~i;i=e[i].nex)
		{//遍历儿子节点
			int v=e[i].v;
			if(v==fa)
				continue;
//			val[v]=e[i].w;//以点代边:将边的权值赋给边头节点
			dfs1(v,x);
			siz[x]+=siz[v];//加上儿子的子树大小
			if(maxsiz<siz[v])
			{
				son[x]=v;
				maxsiz=siz[v];//记录重儿子
			}
		}
	}
	void dfs2(int x,int t)
	{//按dfs序对各节点重新编号,并记录对应权值到w数组
		dfn[x]=++tim;//记录dfs序
		rk[tim]=x;//记录访问节点的顺序,即dfn的反函数
		top[x]=t;//注意这里,top是在树外的
		w[tim]=val[x];//将x结点权值存到对应的时间戳
		if(!son[x])//没有儿子
			return;
		dfs2(son[x],t);//继续处理重儿子
		for(int i=head[x];~i;i=e[i].nex)//处理其他儿子
			if(e[i].v!=father[x]&&e[i].v!=son[x])
				dfs2(e[i].v,e[i].v);//开始另一条重链
	}
	int lca(int x,int y)
	{
		while(top[x]!=top[y])
		{
			if(depth[top[x]]<depth[top[y]])
				swap(x,y);
			x=father[top[x]];
		}
		return (depth[x]>depth[y])?y:x;
	}
	struct node//线段树按dfs序维护树上路径权值部分
	{
		ll val,Max,lazy;
	} tree[maxn<<2];
	inline void pushup(int root)
	{
		tree[root].val=tree[root<<1].val+tree[root<<1|1].val;
		tree[root].Max=max(tree[root<<1].Max,tree[root<<1|1].Max);
	}
	void build(int root,int l,int r)
	{
		tree[root].lazy=0;
		if(l==r)//注意这里是l
			tree[root].val=tree[root].Max=w[l];//按时间戳顺序的数组
		else{
			int mid=(l+r)>>1;
			build(root<<1,l,mid);
			build(root<<1|1,mid+1,r);
			pushup(root);
		}
	}
	inline void pushdown(int root,int l,int r)
	{
		if(tree[root].lazy)
		{
			int mid=(l+r)>>1;
			tree[root<<1].val=tree[root<<1].val+tree[root].lazy*(mid-l+1);
			tree[root<<1|1].val=tree[root<<1|1].val+tree[root].lazy*(r-mid);
			tree[root<<1].Max+=tree[root].lazy;//子节点最大值也要+更新值
			tree[root<<1|1].Max+=tree[root].lazy;
			tree[root<<1].lazy+=tree[root].lazy;
			tree[root<<1|1].lazy+=tree[root].lazy;
			tree[root].lazy=0;
		}
	}
	void modify(int root,int nst,int ned,int ust,int ued,ll num)
	{//区间更新
		if(ned<ust||ued<nst)
			return;
		if(ust<=nst&&ued>=ned)
		{
			tree[root].val=tree[root].val+(ned-nst+1)*num;
			tree[root].Max+=num;
			tree[root].lazy+=num;
			return;
		}
		pushdown(root,nst,ned);
		int mid=(nst+ned)>>1;
		modify(root<<1,nst,mid,ust,ued,num);
		modify(root<<1|1,mid+1,ned,ust,ued,num);
		pushup(root);
	}
	ll query(int root,int nst,int ned,int qst,int qed)
	{//查询区间和
		if(ned<qst||qed<nst)
			return 0;
		if(qst<=nst&&ned<=qed)
			return tree[root].val;
		pushdown(root,nst,ned);
		int mid=(nst+ned)>>1;
		return query(root<<1,nst,mid,qst,qed)+query(root<<1|1,mid+1,ned,qst,qed);
	}
	ll qmax(int root,int nst,int ned,int qst,int qed)
	{//查询区间和
		if(ned<qst||qed<nst)
			return LLONG_MIN;
		if(qst<=nst&&ned<=qed)
			return tree[root].Max;
		pushdown(root,nst,ned);
		int mid=(nst+ned)>>1;
		return max(qmax(root<<1,nst,mid,qst,qed),qmax(root<<1|1,mid+1,ned,qst,qed));
	}
	inline void mson(int x,int n,ll addnum)
	{//将以x为根的子树全部加上一个数
		modify(1,1,n,dfn[x],dfn[x]+siz[x]-1,addnum);//子树节点编号是连续的
	}
	inline ll sonsum(int x,int n)
	{//查询以x为根子树权值和
		return query(1,1,n,dfn[x],dfn[x]+siz[x]-1);//同上
	}
	ll sonmax(int x,int n)
	{
		return qmax(1,1,n,dfn[x],dfn[x]+siz[x]-1);
	}
	void mchain(int x,int y,int n,ll addnum)
	{
		while(top[x]!=top[y])//不在同一条链上时
		{
			if(depth[top[x]]<depth[top[y]])
				swap(x,y);//保证x所在链顶部更低
			modify(1,1,n,dfn[top[x]],dfn[x],addnum);//更新顶部节点较低的重链(顶部节点到当前点部分)
			x=father[top[x]];//跳到链顶节点的父节点
		}
		if(depth[x]>depth[y])//直到最后在同一条重链上
			swap(x,y);//此时保证x节点在y上面
		modify(1,1,n,dfn[x],dfn[y],addnum);
	}
	ll chainsum(int x,int y,int n)
	{
		ll ret=0;
		while(top[x]!=top[y])
		{
			if(depth[top[x]]<depth[top[y]])
				swap(x,y);
			ret+=query(1,1,n,dfn[top[x]],dfn[x]);
			x=father[top[x]];
		}
		if(depth[x]>depth[y])
			swap(x,y);
		return ret+query(1,1,n,dfn[x],dfn[y]);
	}
	ll chainmax(int x,int y,int n)
	{
		ll ret=LLONG_MIN;
		while(top[x]!=top[y])
		{
			if(depth[top[x]]<depth[top[y]])
				swap(x,y);
			ret=max(ret,qmax(1,1,n,dfn[top[x]],dfn[x]));
			x=father[top[x]];
		}
		if(depth[x]>depth[y])
			swap(x,y);
		return max(ret,qmax(1,1,n,dfn[x],dfn[y]));
	}
}
```



### 2、[P3384 树链剖分 ](https://www.luogu.org/problem/P3384)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int inf=0x3f3f3f3f;
const int maxn=100005;
int mod=100000007;
int head[maxn],cnt=0;
struct edge
{
	int v,nex;
} e[maxn<<1];
int father[maxn],son[maxn];//父节点,重儿子节点
int depth[maxn],siz[maxn],top[maxn];//深度,子树大小,节点所在重链的顶部节点
int tim=0,dfn[maxn],rk[maxn],w[maxn];//计数器,时间戳(节点编号),访问顺序
int val[maxn];//给定的每个节点的权值
void add(int u,int v)
{
	e[++cnt].v=v;
	e[cnt].nex=head[u];
	head[u]=cnt;
}
void dfs1(int x,int fa)
{
	father[x]=fa;
	depth[x]=depth[fa]+1;
	siz[x]=1;
	int maxsize=-1;
	for(int i=head[x];~i;i=e[i].nex)//遍历儿子节点
	{
		int v=e[i].v;
		if(v==fa)
			continue;
		dfs1(v,x);
		siz[x]+=siz[v];//加上儿子的子树大小
		if(siz[v]>maxsize)
		{
			maxsize=siz[v];
			son[x]=v;//记录重儿子
		}
	}
}
void dfs2(int x,int t)//当前节点与重链顶节点
{
	top[x]=t;//记录该节点所在重链的顶部节点
	dfn[x]=++tim;//记录该节点的访问时间(给节点编号,方便线段树操作)
	rk[tim]=x;//记录访问节点的顺序
	w[tim]=val[x];//将x结点权值存到对应的时间戳
	if(!son[x])
		return;//没有儿子
	dfs2(son[x],t);//继续处理重儿子
	for(int i=head[x];~i;i=e[i].nex)
	{//处理其他儿子
		if(e[i].v!=son[x]&&e[i].v!=father[x])
			dfs2(e[i].v,e[i].v);//开始另一条重链
	}
}
struct node
{
	int val,lazy;
} tree[maxn<<2];
inline void pushup(int root)
{
	tree[root].val=(tree[root<<1].val+tree[root<<1|1].val)%mod;
}
void build(int root,int l,int r)
{
	tree[root].val=tree[root].lazy=0;
	if(l==r)//注意这里是l
		tree[root].val=w[l]%mod;//按时间戳顺序的数组
	else{
		int mid=(l+r)>>1;
		build(root<<1,l,mid);
		build(root<<1|1,mid+1,r);
		pushup(root);
	}
}
inline void pushdown(int root,int l,int r)
{
	if(tree[root].lazy)
	{
		int mid=(l+r)>>1;
		tree[root<<1].val=(tree[root<<1].val%mod+(tree[root].lazy%mod*(mid-l+1))%mod)%mod;
		tree[root<<1|1].val=(tree[root<<1|1].val%mod+(tree[root].lazy%mod*(r-mid)%mod))%mod;
		tree[root<<1].lazy=(tree[root<<1].lazy%mod+tree[root].lazy%mod)%mod;
		tree[root<<1|1].lazy=(tree[root<<1|1].lazy%mod+tree[root].lazy%mod)%mod;
		tree[root].lazy=0;
	}
}
void modify(int root,int nst,int ned,int ust,int ued,int num)
{
	if(ned<ust||ued<nst)
		return;
	if(ust<=nst&&ued>=ned)
	{
		tree[root].lazy=(tree[root].lazy%mod+num%mod)%mod;
		tree[root].val=(tree[root].val%mod+((ned-nst+1)%mod*(num%mod))%mod)%mod;
		return;
	}
	pushdown(root,nst,ned);
	int mid=(nst+ned)>>1;
	modify(root<<1,nst,mid,ust,ued,num);
	modify(root<<1|1,mid+1,ned,ust,ued,num);
	pushup(root);
}
int query(int root,int nst,int ned,int qst,int qed)
{
	if(ned<qst||qed<nst)
		return 0;
	if(qst<=nst&&qed>=ned)
	{
		return tree[root].val%mod;
	}
	pushdown(root,nst,ned);
	int mid=(nst+ned)>>1;
	return (query(root<<1,nst,mid,qst,qed)+query(root<<1|1,mid+1,ned,qst,qed))%mod;
}
inline void mson(int x,int n,int addnum)
{//将以x为根的子树全部加上一个数
	modify(1,1,n,dfn[x],dfn[x]+siz[x]-1,addnum);//子树节点编号是连续的
}
inline int qson(int x,int n)
{
	return query(1,1,n,dfn[x],dfn[x]+siz[x]-1)%mod;//同上
}
void mchain(int x,int y,int n,int addnum)
{
	addnum%=mod;
	while(top[x]!=top[y])//不在同一条链上时
	{
		if(depth[top[x]]<depth[top[y]])
			swap(x,y);//保证x所在链顶部更低
		modify(1,1,n,dfn[top[x]],dfn[x],addnum);//更新顶部节点较低的重链(顶部节点到当前点部分)
		x=father[top[x]];//跳到链顶节点的父节点
	}
	if(depth[x]>depth[y])//直到最后在同一条重链上
		swap(x,y);//此时保证x节点在y上面
	modify(1,1,n,dfn[x],dfn[y],addnum);
}
int qchain(int x,int y,int n)
{
	int ret=0;
	while(top[x]!=top[y])
	{
		if(depth[top[x]]<depth[top[y]])
			swap(x,y);
		ret=(ret+query(1,1,n,dfn[top[x]],dfn[x]))%mod;
		x=father[top[x]];
	}
	if(depth[x]>depth[y])
		swap(x,y);
	return (ret+query(1,1,n,dfn[x],dfn[y]))%mod;
}
int main()
{
//	freopen("P3384.in","r",stdin);
	int n,m,p,r;
	scanf("%d%d%d%d",&n,&m,&r,&mod);
	memset(head,-1,sizeof(head));
	for(int i=1;i<=n;i++)
		scanf("%d",&val[i]);
	for(int i=1;i<n;i++)
	{
		int u,v;
		scanf("%d%d",&u,&v);
		add(u,v);
		add(v,u);
	}
	dfs1(r,r);
	dfs2(r,r);
	build(1,1,n);
	while(m--)
	{
		int ope,x,y,z;
		scanf("%d",&ope);
		if(ope==1)
		{//链x->y修改,全部加上z
			scanf("%d%d%d",&x,&y,&z);
			mchain(x,y,n,z);
		}
		else if(ope==2)
		{//链x->y查询
			scanf("%d%d",&x,&y);
			printf("%d\n",qchain(x,y,n));
		}
		else if(ope==3)
		{//x子树修改
			scanf("%d%d",&x,&z);
			mson(x,n,z);
		}
		else{//x子树查询
			scanf("%d",&x);
			printf("%d\n",qson(x,n));
		}
	}
//	for(int i=1;i<=n;i++)
//		printf("%d:%d\n",i,tree[i].val);
	return 0;
}
/*
 *功能：
 *1.更新/查询某个节点子树的权值
 *2.更新/查询树上两个节点间所有点的权值
 *性质：
 *1.子树的时间戳一定全部小于父节点，并且连续
 *2.任何一条路径都是由重链的一部分与重链间的叶子节点构成
 *3.任何父节点都一定在一条重链上
*/
```

## 四、点分治

### 1、树的重心

- 也叫树的质心。找到一个点,其所有的子树中最大的子树节点数最少,那么这个点就是这棵树的重心,删去重心后，生成的多棵树尽可能平衡。

### 2、流程

1. 找出当前树的重心
   - 因为分治步骤二需要将sum赋值为当前树大小(siz[v])，所以getrt要跑两遍
2. 处理经过中心的路径
   - 点分治运算的核心，经常会出现变形
3. 删除树的重心
4. 对新得到的子树重复上述步骤

### 3、例题

一棵n节点的树，询问树上距离为k的点对是否存在。离线操作。

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int maxn=10005;
const int maxk=10000005;
int tot=0,head[maxn];
struct edge
{
	int v,nex,w;
} e[maxn<<1];
inline void add(int u,int v,ll w)
{
	e[++tot].v=v;
	e[tot].nex=head[u];
	e[tot].w=w;
	head[u]=tot;
}
int n,m,root,sum=0;//重心,sum当前大小
int siz[maxn],maxp[maxn];
bool vis[maxn];
void getrt(int x,int fa)
{//DFS找重心
	siz[x]=1,maxp[x]=0;//maxp为最大子树大小
	for(int i=head[x];~i;i=e[i].nex)
	{
		int v=e[i].v;
		if(v==fa||vis[v])
			continue;
		getrt(v,x);
		siz[x]+=siz[v];
		if(siz[v]>maxp[x])
			maxp[x]=siz[v];//记录下面的最大子树大小
	}//无根树,sum-siz[x]为以x的父节点为根的大小
	//在以自身为根节点的子树大小和以x的父节点为根的大小中取较大的
	maxp[x]=max(maxp[x],sum-siz[x]);//sum为整棵树的大小
	if(maxp[x]<maxp[root])
		root=x;//最大子树最小的点为重心
}
int dist[maxn],tmp[maxn],cnt=0;//cnt计数器
void getdist(int x,int fa)
{//DFS求各点到root的距离,记录在tmp中
	tmp[++cnt]=dist[x];
	for(int i=head[x];~i;i=e[i].nex)
	{
		int v=e[i].v;
		if(v==fa||vis[v])
			continue;
		dist[v]=dist[x]+e[i].w;
		getdist(v,x);
	}
}
int q[105];//q记录询问距离
bool jud[maxk],ans[105];//存放之前子树中的存在路径长度,ans判断k是否存在
queue<int> QwQ;
void solve(int x)
{//处理经过根节点x的路径
	for(int i=head[x];~i;i=e[i].nex)
	{
		int v=e[i].v;
		if(vis[v])//该点已经被去掉
			continue;
		cnt=0;
		dist[v]=e[i].w;//设置root与儿子的距离
		getdist(v,x);
		for(int j=1;j<=cnt;j++)//遍历该子树上的距离
			for(int k=1;k<=m;k++)//遍历询问
				if(q[k]>=tmp[j])//有拼出来的可能性
					ans[k]|=jud[q[k]-tmp[j]];//可以用之前以x为顶的距离拼起来
		for(int j=1;j<=cnt;j++)//将这棵子树的距离存起来
		{//供之后的以x为节点的子树拼路径使用
			QwQ.push(tmp[j]);
			jud[tmp[j]]=1;
		}
	}
	while(!QwQ.empty())
	{
		jud[QwQ.front()]=0;
		QwQ.pop();
	}
}
void divide(int x)
{
	vis[x]=jud[0]=1;//去掉根节点x
	solve(x);//处理所有经过x的路径
	for(int i=head[x];~i;i=e[i].nex)
	{
		int v=e[i].v;
		if(vis[v])
			continue;
		maxp[root=0]=sum=siz[v];//重心置为0,maxp[0]置为最大值(所以要重新DFS计算siz)
		getrt(v,0);//在以v为根的子树上找重心
		getrt(root,0);//处理出以v为根的siz数组
		divide(root);
	}
}
int main()
{
	int k,u,v;
	ll w;
	memset(head,-1,sizeof(head));
	cin>>n>>m;
	for(int i=1;i<n;i++)
	{//点u到点v距离为w
		cin>>u>>v>>w;
		add(u,v,w);
		add(v,u,w);
	}
	for(int i=1;i<=m;i++)
		cin>>q[i];
	maxp[0]=sum=n;//置为最大值
	getrt(1,0);
	getrt(root,0);//更新以重心为根的siz数组
	divide(root);
	for(int i=1;i<=m;i++)
		cout<<(ans[i]?"AYE":"NAY")<<'\n';
	return 0;
}
```



#### 更多阅读
+ [【每日一题】(34题)面试官:你对图论了解多少？(四)](https://mp.weixin.qq.com/s/EJ_72u5S7KD4950IEO_CQg)

+ [【每日一题】(33题)面试官:你对图论了解多少？(三)](https://mp.weixin.qq.com/s/wRy1xAm4JzHCq1dRjMUuoA)

+ [【每日一题】(32题)面试官:你对图论了解多少？(二)](https://mp.weixin.qq.com/s/_aSMIEpBc2jvTFXxBaK7nQ)

+ [[【每日一题】(31题)面试官:你对图论了解多少？(一)](https://mp.weixin.qq.com/s/E6dh8A9dVxxB9jaRGm3kbg)


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
