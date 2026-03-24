import React, { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export default function LiveAnalytics() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  // Fetch analytics data
  const dashboardQuery = trpc.analytics.getDashboard.useQuery(undefined, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const recentPageViewsQuery = trpc.analytics.getRecentPageViews.useQuery({ limit: 20 }, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const recentInteractionsQuery = trpc.analytics.getRecentInteractions.useQuery({ limit: 20 }, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const data = dashboardQuery.data;
  const recentPageViews = recentPageViewsQuery.data || [];
  const recentInteractions = recentInteractionsQuery.data || [];

  // Prepare data for charts
  const topPagesData = (data?.topPages || []).map((item: any) => ({
    name: item.page || 'Unknown',
    views: item.count || 0,
  }));

  const topEventsData = (data?.topEvents || []).map((item: any) => ({
    name: item.eventType || 'Unknown',
    count: item.count || 0,
  }));

  const todayStats = data?.todayStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Live Analytics</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            Auto Refresh
          </label>
          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="px-3 py-2 bg-gray-800 text-white rounded border border-gray-700"
            >
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Page Views"
          value={todayStats?.totalPageViews || 0}
          icon="👁️"
        />
        <MetricCard
          title="Unique Visitors"
          value={todayStats?.uniqueVisitors || 0}
          icon="👥"
        />
        <MetricCard
          title="Add to Cart"
          value={todayStats?.totalAddToCart || 0}
          icon="🛒"
        />
        <MetricCard
          title="Checkouts"
          value={todayStats?.totalCheckouts || 0}
          icon="💳"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Chart */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Top Pages</h3>
          {topPagesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#999" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
                <Bar dataKey="views" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>

        {/* Top Events Chart */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Top Events</h3>
          {topEventsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topEventsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {topEventsData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Page Views */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Recent Page Views</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentPageViews.length > 0 ? (
              recentPageViews.map((view: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded text-sm">
                  <div>
                    <p className="text-white font-medium">{view.page}</p>
                    <p className="text-gray-400 text-xs">{view.deviceType} • {new Date(view.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <span className="text-gray-400">{view.country || 'Unknown'}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No recent page views</p>
            )}
          </div>
        </div>

        {/* Recent Interactions */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Recent Interactions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentInteractions.length > 0 ? (
              recentInteractions.map((interaction: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded text-sm">
                  <div>
                    <p className="text-white font-medium">{interaction.eventType.replace(/_/g, ' ')}</p>
                    <p className="text-gray-400 text-xs">{interaction.page} • {new Date(interaction.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <span className="text-cyan-400">●</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No recent interactions</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {todayStats && (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 rounded">
              <p className="text-gray-400 text-sm">Avg Session Duration</p>
              <p className="text-2xl font-bold text-white">{todayStats.averageSessionDuration}s</p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <p className="text-gray-400 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-white">{todayStats.bounceRate}%</p>
            </div>
            <div className="p-4 bg-gray-800 rounded">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">£{(todayStats.totalRevenue / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value.toLocaleString()}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
