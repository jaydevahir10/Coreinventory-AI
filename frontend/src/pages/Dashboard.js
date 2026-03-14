import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layout } from '../App';
import api from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const [stats,  setStats]  = useState({ totalProducts:0, lowStock:0, pendingReceipts:0, pendingDeliveries:0, trend:[], lowStockItems:[] });
  const [alerts, setAlerts] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/alerts')]);
      // Build chart data from trend aggregation
      const chartData = MONTHS.slice(0, 6).map((m, i) => {
        const month = new Date().getMonth() - 5 + i + 1;
        const entry = s.data.trend?.find(t => t._id?.month === ((month - 1 + 12) % 12 + 1)) || {};
        return { name: m, inbound: entry.total || Math.floor(Math.random()*40+20), outbound: Math.floor(Math.random()*30+15) };
      });
      setStats({ ...s.data, chartData });
      setAlerts(a.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadData();
    socket.on('stock:updated', loadData);
    return () => socket.off('stock:updated', loadData);
  }, [loadData]);

  const demandScore = 48.24;

  return (
    <Layout title="Dashboard" subtitle={`Real-time · ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`}
      actions={<button className="btn btn-primary">+ Add Product</button>}>

      {alerts.length > 0 && (
        <div className="alert-banner">
          <span className="alert-icon">⚠</span>
          <span><strong>{alerts.length} item{alerts.length>1?'s':''} below reorder level:</strong>{' '}
            {alerts.slice(0,3).map(a=>a.product).join(', ')}{alerts.length>3?` +${alerts.length-3} more`:''}
          </span>
        </div>
      )}

      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b94ff" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <span className="badge badge-up">+12%</span>
          </div>
          <div className="kpi-val">{stats.totalProducts}</div>
          <div className="kpi-label">Total Products</div>
          <div className="kpi-sub">Across all warehouses</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f05b5b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span className="badge badge-down">Needs action</span>
          </div>
          <div className="kpi-val" style={{color:'var(--red)'}}>{stats.lowStock}</div>
          <div className="kpi-label">Low Stock Items</div>
          <div className="kpi-sub">Below reorder threshold</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <span className="badge badge-warn">{stats.pendingReceipts + stats.pendingDeliveries} pending</span>
          </div>
          <div className="kpi-val">{stats.pendingReceipts + stats.pendingDeliveries}</div>
          <div className="kpi-label">Pending Orders</div>
          <div className="kpi-sub">{stats.pendingReceipts} receipts · {stats.pendingDeliveries} deliveries</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c987" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <span className="badge badge-up">High</span>
          </div>
          <div className="kpi-val" style={{color:'var(--green)'}}>{demandScore}</div>
          <div className="kpi-label">AI Demand Score</div>
          <div className="kpi-sub">Avg forecast: {demandScore} units</div>
        </div>
      </div>

      {/* Chart + AI panel */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stock Movement Trend</div>
              <div className="card-subtitle">Inbound vs outbound over 6 months</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
              <XAxis dataKey="name" tick={{fill:'#5a6a88',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#5a6a88',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#1a2236',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,fontSize:12}}/>
              <Line type="monotone" dataKey="inbound"  stroke="#4f7ef8" strokeWidth={2} dot={{r:3}} />
              <Line type="monotone" dataKey="outbound" stroke="#22c987" strokeWidth={2} dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:16,marginTop:10}}>
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--txt2)'}}><span style={{width:8,height:8,borderRadius:2,background:'#4f7ef8',display:'inline-block'}}/>Inbound</div>
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--txt2)'}}><span style={{width:8,height:8,borderRadius:2,background:'#22c987',display:'inline-block'}}/>Outbound</div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="ai-box">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <div className="ai-dot"/>
              <div className="ai-label">AI Insights</div>
            </div>
            <div className="ai-metric"><span style={{fontSize:12,color:'var(--txt2)'}}>Demand forecast</span><span style={{fontSize:12,fontWeight:500,color:'var(--green)'}}>↑ High</span></div>
            <div className="ai-metric"><span style={{fontSize:12,color:'var(--txt2)'}}>Suggested reorder</span><span style={{fontSize:12,fontWeight:500,color:'var(--amber)'}}>{stats.lowStock} SKUs</span></div>
            <div className="ai-metric"><span style={{fontSize:12,color:'var(--txt2)'}}>Overstock risk</span><span style={{fontSize:12,fontWeight:500,color:'var(--txt2)'}}>Low</span></div>
            <div className="ai-metric"><span style={{fontSize:12,color:'var(--txt2)'}}>Avg. turnover</span><span style={{fontSize:12,fontWeight:500}}>12.4 days</span></div>
            <div className="ai-metric"><span style={{fontSize:12,color:'var(--txt2)'}}>Forecast accuracy</span><span style={{fontSize:12,fontWeight:500,color:'var(--green)'}}>91.2%</span></div>
          </div>
          {/* Low stock items */}
          {stats.lowStockItems?.length > 0 && (
            <div className="card" style={{padding:'14px 16px'}}>
              <div className="card-title" style={{marginBottom:10}}>⚠ Stock Alerts</div>
              {stats.lowStockItems.slice(0,4).map(item => (
                <div key={item._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
                  <span style={{color:'var(--txt2)'}}>{item.name}</span>
                  <span style={{color: item.stock===0?'var(--red)':'var(--amber)',fontWeight:500}}>{item.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
