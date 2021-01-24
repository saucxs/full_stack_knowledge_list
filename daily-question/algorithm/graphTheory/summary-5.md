
### 树链剖分

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

#### 通用模板

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



#### [P3384 树链剖分 ](https://www.luogu.org/problem/P3384)

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

### 点分治

#### 树的重心

- 也叫树的质心。找到一个点,其所有的子树中最大的子树节点数最少,那么这个点就是这棵树的重心,删去重心后，生成的多棵树尽可能平衡。

#### 流程

1. 找出当前树的重心
   - 因为分治步骤二需要将sum赋值为当前树大小(siz[v])，所以getrt要跑两遍
2. 处理经过中心的路径
   - 点分治运算的核心，经常会出现变形
3. 删除树的重心
4. 对新得到的子树重复上述步骤

#### 例题

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



### 树上启发式合并（DSU on tree）

解决**离线子树查询**问题，即统计树上一个节点的子树中具有某种特征的节点数。

一般也可以使用DFS序莫队或DFS序主席树做。

时间复杂度$O(nlogn)$，空间复杂度$O(n)$。

#### 流程

1. 先用dfs处理出重儿子
2. 使用DFS处理各子树信息，设当前子树根节点为x
   - **遍历**x的轻儿子，计算轻儿子子树贡献，**记录到ans数组**，信息不做保留。
   - 处理x的重儿子子树贡献，**记录到ans数组**，并保留。
   - 暴力统计节点x及所有轻儿子子树贡献，与x的重儿子子树贡献汇总，一同**回溯**到上一级，以便处理出以x节点的父节点为根的子树的贡献。

### 二分图

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




### 网络流

注意反向思考，添加新节点进行限流。

#### 模板部分

##### dinic

```cpp
struct Dinic
{//复杂度O(n^2m)
	struct Edge
	{
		int from, to, cap, flow;
		Edge(int u, int v, int c, int f):
			from(u), to(v), cap(c), flow(f) {}
	};
	int n, m, s, t; //结点数,边数(包括反向弧),源点编号和汇点编号
	vector<Edge> edges; //边表。edge[e]和edge[e^1]互为反向弧
	vector<int> G[maxn]; //邻接表，G[i][j]表示节点i的第j条边在e数组中的序号
	bool vis[maxn]; //BFS使用
	int d[maxn]; //从起点到i的距离
	int cur[maxn]; //当前弧下标
	void init(int n)
	{
		this->n = n;
		for (int i = 0; i < n; i++) G[i].clear();
		edges.clear();
	}
	void AddEdge(int from, int to, int cap)
	{
		edges.push_back(Edge(from, to, cap, 0));
		edges.push_back(Edge(to, from, 0, 0));//反向弧,初始容量为0
		m = edges.size();
		G[from].push_back(m - 2);
		G[to].push_back(m - 1);
	}
	bool BFS()
	{
		memset(vis, 0, sizeof(vis));
//		memset(d, 0, sizeof(d));
		queue<int> q;
		q.push(s);
		d[s] = 0;
		vis[s] = 1;
		while (!q.empty())
		{
			int x = q.front();
			q.pop();
			for (int i = 0; i < G[x].size(); i++)
			{
				Edge& e = edges[G[x][i]];
				if (!vis[e.to] && e.cap > e.flow)
				{//只考虑残量网络中的弧
					vis[e.to] = 1;
					d[e.to] = d[x] + 1;//构造分层图
					q.push(e.to);
				}
			}
		}
		return vis[t];//有无增广路,s->t
	}
	int DFS(int x, int a)//x为当前点,a为当前边上流量
	{//在层次图上向t延伸,多路增广
		if(x==t||a==0)//到达目标/流量为0断流
			return a;
		int flow = 0, f;
		for(int& i=cur[x];i<G[x].size();i++)//从上一次x遍历跑到的点开始跑
		{//从上次考虑的弧
			Edge& e = edges[G[x][i]];
			if(d[x]+1==d[e.to]&&(f=DFS(e.to,min(a,e.cap-e.flow))) > 0)
			{//只从层数编号较小的点到下一层的点
				e.flow += f;//该路径上边流量都增加f
				edges[G[x][i]^1].flow -= f;//方便反悔
				flow += f;
				a -= f;//用去可增广量
				if(a==0)//a等于0及时退出
					break;//当a!=0,说明当前节点还存在另一个增广路分支。
			}
		}
		if(!flow)//增广后容量满了
			d[x] = -1;//炸点优化,不必要的点下一次就不用遍历
		return flow;//返回x节点最大流量,传递到上一级
	}
	int Maxflow(int s, int t)
	{
		this->s = s, this->t = t;
		int flow = 0;
		while (BFS())//不停地用bfs构造分层网络，然后用dfs沿着阻塞流增广
		{
			memset(cur, 0, sizeof(cur));//建完分层图后cur也要初始化
			flow += DFS(s,inf);
		}
		return flow;
	}
} di;
```

#### dijkstra费用流

```cpp
struct MCMF {
	struct Edge {
		ll v, cap, cost, rev;
	};
	const ll INF=0x3f3f3f3f3f3f3f3f;
	ll flow, cost, s, t, n;//前驱结点和对应边
	ll dist[maxn], H[maxn], pv[maxn], pe[maxn];//H为节点势函数
	std::vector<Edge> G[maxn];//因为要记录前驱,不能用前向星
	void init(int n){
		this->n = n;
		for (int i = 0; i <= n; ++i) G[i].clear();
	}
	void addEdge(int u, int v, int cap, ll cost){//dojk费用流中两节点间流向单向
		G[u].push_back({v,cap,cost,G[v].size()});
		G[v].push_back({u,0,-cost,G[u].size()-1});
	}
	bool dijkstra()//这里是单路增广
	{//复杂度相对SPFA稳定
		std::priority_queue<pair<ll,ll>, std::vector<pair<ll,ll>>, std::greater<pair<ll,ll>> > q;
		std::fill(dist, dist + n + 1, INF);
		dist[s] = 0; q.push({ 0, s });
		while (!q.empty())
		{//到x距离即为到x的单位花费之和
			pair<ll,ll> x = q.top(); q.pop();
			ll& u = x.second;
			if (dist[u] < x.first) continue;//不能优化距离
			for (int i = 0; i < G[u].size(); ++i)
			{
				Edge& e = G[u][i];//当前边
				ll& v = e.v;
				pair<ll,ll> y(dist[u] + e.cost + H[u] - H[v], v);
				if (e.cap > 0 && dist[v] > y.first)
				{
					dist[v] = y.first;
					pv[v] = u,pe[v] = i;//前驱点与前驱边
					q.push(y);
				}
			}
		}
		if (dist[t] == INF)//无法增广
			return false;
		for (int i = 0; i <= n; ++i)//更新每轮的势函数
			H[i] += dist[i];
		ll f = INF;
		for (int v = t; v != s; v = pv[v])//沿增广路回到起点
			f = std::min(f, G[pv[v]][pe[v]].cap);
		flow += f;//每次增广一条路径,这条路径增广量就是新增的流量
		cost += f * H[t];//h[t]-h[s]即为s到t的路径长
		for (int v = t; v != s; v = pv[v])
		{//更新增广路容量信息
			Edge& e = G[pv[v]][pe[v]];
			e.cap -= f;
			G[v][e.rev].cap += f;
		}
		return true;
	}
	ll solve(int s, int t)
	{
		this->s = s, this->t = t;
		flow = cost = 0;
		std::fill(H, H + n + 1, 0);//初始网络为0非负,势函数也为0
		while (dijkstra());//每次选择最小费用增广路径一定是当前残留图的最小增广路径
		return flow;
	}
} mcmf;
```



#### 最大流

##### 太空飞行计划问题（最小割,收益最大问题）

 **最优收益 = 所有实验的报酬总和 - 该图的最大流**

```cpp
	int m,n;//实验数,仪器数
	scanf("%d%d",&m,&n);
	int s=0,t=m+n+1,sum=0;
	di.init(t);
	for(int i=1;i<=m;i++)
	{
		int profit,equ;
		scanf("%d",&profit);
		sum+=profit;//sum为所有收益之和
		di.AddEdge(s,i,profit);//源点到实验
		while(1)
		{
			char ch;
			scanf("%d%c",&equ,&ch);
			di.AddEdge(i,m+equ,inf);//实验到器材
			if(ch=='\r'||ch=='\n')
				break;
		}
	}
	for(int i=1;i<=n;i++)
	{
		int cost;
		scanf("%d",&cost);
		di.AddEdge(m+i,t,cost);//器材到汇点
	}
	int ans=di.Maxflow(s,t);
	for(int i=1;i<=m;i++)
	{
		if(di.d[i])//选择去做的实验编号
			printf("%d ",i);
	}
	putchar('\n');
	for(int i=1;i<=n;i++)
	{
		if(di.d[m+i])//需要购买的器材编号
			printf("%d ",i);
	}
	printf("\n%d\n",sum-ans);
```
建图后跑最大流求出最小割，满流的实验边割掉，满流的设备边也在割集里(但是这是需要购买的)，该最小割即为最小亏损。
所以最后一次BFS，所有未被割掉的实验为非饱和弧，可以求出深度。
所以未被割掉的实验(及选择去做的实验)所连接的设备同样可以求出深度。

#####  最小路径覆盖问题(最大流,最小不相交路径覆盖模型,要求路径数最少,路径输出)

二分图定理之一：最小路径覆盖数=顶点数-最大匹配

不要使用炸点优化！！！

```cpp
//#pragma G++ optimize("O2")
const int maxn = 13005;//上大的模板
const int inf=0x3f3f3f3f;
int nex[maxn];
bool vist[maxn];
int all;
struct Dinic
{
	struct Edge
	{
		int from, to, cap, flow;
		Edge(int u, int v, int c, int f):
			from(u), to(v), cap(c), flow(f) {}
	};
	int n, m, s, t; //结点数,边数(包括反向弧),源点编号和汇点编号
	vector<Edge> edges; //边表。edge[e]和edge[e^1]互为反向弧
	vector<int> G[maxn]; //邻接表，G[i][j]表示节点i的第j条边在e数组中的序号
	bool vis[maxn]; //BFS使用
	int d[maxn]; //从起点到i的距离
	int cur[maxn]; //当前弧下标
	void init(int n)
	{
		this->n = n;
		for (int i = 0; i <= n; i++)
			G[i].clear();
		edges.clear();
	}
	inline void AddEdge(int from, int to, int cap)
    {
        edges.emplace_back(Edge(from, to, cap, 0));//魔改蔡队模板
        edges.emplace_back(Edge(to, from, 0, 0)); //反向弧
        this->m = edges.size();
        G[from].push_back(m - 2);
        G[to].push_back(m - 1);
    }
	bool BFS()
	{
		memset(vis, 0, sizeof(vis));
		memset(d, 0, sizeof(d));
		queue<int> q;
		q.push(s);
		d[s] = 0;
		vis[s] = 1;
		while (!q.empty())
		{
			int x = q.front();
			q.pop();
			for (int i = 0; i < G[x].size(); i++)
			{
				Edge& e = edges[G[x][i]];
				if (!vis[e.to] && e.cap > e.flow)
				{
					vis[e.to] = 1;
					d[e.to] = d[x] + 1;
					q.push(e.to);
				}
			}
		}
		return vis[t];
	}
	int DFS(int x, int a)//x为当前点,a为当前边上流量
	{
		if (x == t || a == 0)//到达目标/流量为0
			return a;
		int flow = 0, f;
		for (int& i = cur[x]; i < G[x].size(); i++)
		{ //从上次考虑的弧
			Edge& e = edges[G[x][i]];
			if (d[x] + 1 == d[e.to] && (f = DFS(e.to, min(a, e.cap - e.flow))) > 0)
			{
				if(x!=s)//为了输出路径，添加此语句
				{
					nex[x]=e.to;//记录下一个节点,便于输出
					vist[e.to-all]=1;//打标记,找起点
				}
				e.flow += f;
				edges[G[x][i] ^ 1].flow -= f;
				flow += f;
				a -= f;
				if (a == 0)
					break;
			}
		}//这题不能乱用炸点优化！！！
		return flow;
	}
	int Maxflow(int s, int t)
	{
		this->s = s, this->t = t;
		int flow = 0;
		while (BFS())
		{
			memset(cur, 0, sizeof(cur));
			flow += DFS(s,inf);
		}
		return flow;
	}
} di;
int main()
{//给定DAG图G
	int n,m;//n为DAG顶点数，m为边数
	memset(vist,0,sizeof(vist));
	cin>>n>>m;
	all=n;
	int s=0,t=2*n+1;
	di.init(t);
	for(int i=1;i<=n;i++)//拆点，分别连接s和t
	{
		di.AddEdge(s,i,1);
		di.AddEdge(n+i,t,1);
	}
	for(int i=1;i<=m;i++)
	{
		int u,v;
		cin>>u>>v;
		di.AddEdge(u,n+v,1);//容量为1
	}
	int ans=di.Maxflow(s,t);
	for(int i=1;i<=n;i++)
	{
		if(!vist[i])//没标记的就是起点
		{
			int now=i;
			cout<<now<<' ';
			while(nex[now]&&nex[now]!=t)
			{
				cout<<nex[now]-n<<' ';
				now=nex[now]-n;
			}
			cout<<endl;
		}
	}
	cout<<n-ans<<endl;//最少路径数
	return 0;
}

```

##### P2774 方格取数问题(最大流，最小割)

 m*n 个方格棋盘中，每个方格中有一个正整数。从方格中取数，使任意 2 个数所在方格没有公共边，且取出的数的总和最大。

思路：黑白染色，按奇偶性建立二分图，奇连s，偶连t。枚举每个奇数性质的方格，连接相邻的偶数性质的方格。跑dinic求出最小割，总值减去最小割即为答案。

```cpp
int main()
{
    int m,n;
	scanf("%d%d",&m,&n);//棋盘的行数和列数
    int s=0,t=m*n+1,sum=0;//sum为总价值
    di.init(t+1);
    for(int i=1;i<=m;i++)
	{
		for(int j=1;j<=n;j++)
		{
			int val,no;
			scanf("%d",&val);//i行j列的数值
			sum+=val;
			no=n*(i-1)+j;//重点：一行n个
			if((i+j)%2){//相邻的i+j奇偶性必定相斥
				di.AddEdge(s,no,val);//根据奇偶性连接
			}
			else{
				di.AddEdge(no,t,val);
			}
		}
	}//s与t的边插入结束
	int nx[4]={0,-1,0,1};//只枚举两个方向是不够的,因为是有向图
	int ny[4]={-1,0,1,0};
	for(int i=1;i<=m;i++)//m行
		for(int j=1;j<=n;j++)//n列
		{
			int no=n*(i-1)+j;
			if((i+j)%2){//二分图左边的节点,开始连接右面的节点
				for(int k=0;k<4;k++)//枚举方向,相邻的四个方格
				{
					int x=i+nx[k],y=j+ny[k];//x与m轴同方向
					if(x<=0||x>m||y<=0||y>n)
						continue;
					int no2=n*(x-1)+y;//相邻的方格编号
					di.AddEdge(no,no2,inf);
				}
			}
		}
	printf("%d\n",sum-di.Maxflow(s,t));
	return 0;
}
```

#### 费用流

##### P4012 深海机器人问题（物品在网格上）

物品在网格的边上，每条网格的边有权值，交叉点作为节点，在图上添加点和点之间的边，设容量为1，花费为-cost。

注意设置容量inf，费用为0的经过边，跑最小费用最大流，答案取负。

##### P3356 火星探险问题（物品在交叉点上）

物品在节点上，而且有障碍。

思路：拆点，若不为障碍，拆点间添加容量为inf，价值为0的边；若该点有所需物品，两点间额外添加一条容量为1价值为-val的边；

跑最小费用最大流即可，使用DFS输出路径。

```cpp
for(int i=1;i<=n;i++)
	{
		flag=0;
		mm.dfs(1,1,1,i);//起点(1,1),出点1,第i号机器人
	}
void MCMF::dfs(int x,int y,int u,int no)//第no号机器人到达了u节点
{
	int kx,ky,dir;//0向下,1向右
	int res=p*q+u;//u节点的拆点编号
	if(flag)//no号到达了终点
		return;
	for(int i=0;i<G[res].size();i++)
	{
		if(flag)
			return;
		if(edges[G[res][i]].flow>0&&(edges[G[res][i]].to==u+1||edges[G[res][i]].to==u+p))//残余流量大于0
		{//q行,p列,x与q同方向,表示第几行
			edges[G[res][i]].flow--;
			if(edges[G[res][i]].to==u+1)//向右
				dir=1;
			else
				dir=0;
			printf("%d %d\n",no,dir);
			if(dir==1)
                dfs(x,y+1,u+1,no);
//				printf("(%d,%d)->(%d,%d)\n",x,y,x,y+1);
			else
                dfs(x+1,y,u+p,no);
//				printf("(%d,%d)->(%d,%d)\n",x,y,x+1,y);
			if(edges[G[res][i]].to==p*q)
				flag=1;
		}
	}
}
```

##### [P2604 扩容费用问题 ](https://www.luogu.org/problem/P2604)

问题：给出DAG每条边的容量和扩容费用，1.求出1到n的最大流。2.求出1到n的最大流增加K所需的最小扩容费用。

先跑一个零费用最大流。利用残余网络进行费用流扩容，将原来的0费用网络添加新的费用边，并进行**限流**，cost即为扩容费用。

```cpp
int n,m,k;
cin>>n>>m>>k;
mm.init(n+10);
for(int i=1;i<=m;i++){
	cin>>e[i].u>>e[i].v>>e[i].c>>e[i].w;
	mm.AddEdge(e[i].u,e[i].v,e[i].c,0);//费用为0，跑最大流
}
ll cost;
cout<<mm.MincostMaxflow(1,n,cost)<<' ';
for(int i=1;i<=m;i++)//给原来每条边上添加新边,
	mm.AddEdge(e[i].u,e[i].v,inf,e[i].w);
int s=0;//超级源点s
mm.AddEdge(s,1,k,0);//s到1进行限流
mm.MincostMaxflow(s,n,cost);//费用流
cout<<cost<<endl;//扩容费用
```