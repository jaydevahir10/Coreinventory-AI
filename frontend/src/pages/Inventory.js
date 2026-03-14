import React, { useState, useEffect } from 'react';
import { Layout, useToast } from '../App';
import api from '../services/api';

export default function Inventory() {
  const toast = useToast();
  const [products,  setProducts]  = useState([]);
  const [showAdj,   setShowAdj]   = useState(false);
  const [adjForm,   setAdjForm]   = useState({ productId:'', actualStock:'', note:'' });

  const load = async () => {
    try { const { data } = await api.get('/products'); setProducts(data); }
    catch { toast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const adjust = async e => {
    e.preventDefault();
    try {
      await api.post('/adjustment', { productId: adjForm.productId, actualStock: +adjForm.actualStock, note: adjForm.note });
      toast('Stock adjusted!'); setShowAdj(false); load();
    } catch (err) { toast(err.response?.data?.msg || 'Error', 'error'); }
  };

  const totalStock  = products.reduce((s, p) => s + p.stock, 0);
  const lowCount    = products.filter(p => p.stock < p.reorderLevel).length;
  const healthScore = products.length ? Math.round((products.filter(p=>p.stock>=p.reorderLevel).length / products.length) * 100) : 0;

  return (
    <Layout title="Inventory" subtitle="Full stock overview & adjustments"
      actions={<button className="btn btn-ghost" onClick={()=>setShowAdj(true)}>⚙ Adjust Stock</button>}>

      {/* Mini KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {[
          {label:'Total Units',    val:totalStock,   color:'var(--accent)'},
          {label:'Low Stock Items',val:lowCount,     color:'var(--red)'},
          {label:'Health Score',   val:`${healthScore}%`, color:'var(--green)'},
        ].map(k=>(
          <div className="kpi-card" key={k.label}>
            <div className="kpi-val" style={{color:k.color}}>{k.val}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>In Stock</th><th>Reorder At</th><th>Health</th></tr></thead>
            <tbody>
              {products.map(p => {
                const pct = Math.min(100, Math.round(p.stock / Math.max(p.reorderLevel * 2, 1) * 100));
                const color = p.stock===0?'var(--red)':p.stock<p.reorderLevel?'var(--amber)':'var(--green)';
                return (
                  <tr key={p._id}>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td><span className="sku-tag">{p.sku}</span></td>
                    <td><span className="badge badge-info">{p.category||'—'}</span></td>
                    <td style={{fontFamily:"'DM Mono',monospace",color}}>{p.stock} {p.unit}</td>
                    <td style={{fontSize:12,color:'var(--txt2)'}}>{p.reorderLevel}</td>
                    <td style={{minWidth:120}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div className="stock-bar" style={{flex:1}}>
                          <div className="stock-fill" style={{width:`${pct}%`,background:color}}/>
                        </div>
                        <span style={{fontSize:11,color,minWidth:32}}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAdj && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setShowAdj(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Stock Adjustment</div><button className="modal-close" onClick={()=>setShowAdj(false)}>×</button></div>
            <div className="modal-subtitle" style={{fontSize:12,color:'var(--txt3)',marginBottom:16}}>Use when physical count differs from system count.</div>
            <form onSubmit={adjust}>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <select className="form-select" value={adjForm.productId} onChange={e=>setAdjForm({...adjForm,productId:e.target.value})} required>
                  <option value="">Select product…</option>
                  {products.map(p=><option key={p._id} value={p._id}>{p.name} (current: {p.stock})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Actual Stock Count *</label>
                <input type="number" className="form-input" placeholder="Enter real physical count" value={adjForm.actualStock} onChange={e=>setAdjForm({...adjForm,actualStock:e.target.value})} min="0" required/>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input className="form-input" placeholder="Damaged, miscounted…" value={adjForm.note} onChange={e=>setAdjForm({...adjForm,note:e.target.value})}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowAdj(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Apply Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
