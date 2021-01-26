

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