"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatMoney } from "@deer-drone/utils";

import { useState, useEffect } from 'react';

interface DashboardChartsProps {
  chartData: any[];
  statusData: any[];
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e', '#ef4444'];

export default function DashboardCharts({ chartData, statusData }: DashboardChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: 340, background: 'var(--admin-surface)', borderRadius: '12px' }} />;

  return (
    <div className="admin-grid" style={{ marginBottom: '24px' }}>
      <article className="admin-panel">
        <h2>Орлогын хандлага (Сүүлийн 30 хоног)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--admin-muted)' }}
                interval={6}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'var(--admin-muted)' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--admin-border)',
                  background: 'var(--admin-card)',
                  boxShadow: 'var(--admin-shadow-md)',
                  color: 'var(--admin-text)'
                }}
                itemStyle={{ color: 'var(--admin-text)' }}
                labelStyle={{ color: 'var(--admin-muted)' }}
                formatter={(value: any) => [formatMoney(value), 'Орлого']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563EB" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="admin-panel">
        <h2>Захиалгын төлөв</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--admin-border)',
                  background: 'var(--admin-card)',
                  color: 'var(--admin-text)'
                }}
                itemStyle={{ color: 'var(--admin-text)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
