import React, { useState, useEffect } from 'react';
import { Layout, useToast } from '../App';
import api from '../services/api';

export default function Transfers() {
  const toast = useToast();
  const [transfers,  setTransfers]  = useState([]);
  const [products,   setProducts]   = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [form, setForm] = useState({ productId:'', quantity:'', fromLocation:'', toLocation:'', note:'' });

  const load = async () => {
    try {
      const [t, p, w] = await Promise.all([api.get('/transfer'), api.get('/products'), api.get('/warehouse')]);
      setTransfers(t.data); setProducts(p.data); setWarehouses(w.data);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const create = async e => {
    e.preventDefault();
    try {
      await api.post('/transfer', { productId:form.productId, quantity:+form.quantity, fromLocation:form.fromLocation, toLocation:form.toLocation, note:form.note });
      toast('Transfer created!'); setShowModal(false); load();
    } catch (err) { toast(err.response?.data?.msg || 'Error', 'error'); }
  };

  return (
    <Layout title="Transfers" subtitle="Internal warehouse transfers"
      actions={<button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ New Transfer</button>}>
      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>From</th><th>To</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {transfers.map(t=>(
                <tr key={t._id}>
                  <td style={{fontWeight:500}}>{t.productId?.name||'—'}</td>
                  <td style={{fontFamily:"'DM Mono',monospace"}}>{t.quantity}</td>
                  <td style={{fontSize:12,color:'var(--txt2)'}}>{t.fromLocation?.name||'—'}</td>
                  <td style={{fontSize:12,color:'var(--txt2)'}}>{t.toLocation?.name||'—'}</td>
                  <td><span className={`status-badge status-${t.status}`}>{t.status}</span></td>
                  <td style={{fontSize:12,color:'var(--txt3)'}}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {transfers.length===0&&<tr><td colSpan={6} style={{textAlign:'center',color:'var(--txt3)',padding:40}}>No transfers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">New Transfer</div><button className="modal-close" onClick={()=>setShowModal(false)}>×</button></div>
            <form onSubmit={create}>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <select className="form-select" value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})} required>
                  <option value="">Select product…</option>
                  {products.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input type="number" className="form-input" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} min="1" required/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">From Warehouse</label>
                  <select className="form-select" value={form.fromLocation} onChange={e=>setForm({...form,fromLocation:e.target.value})}>
                    <option value="">Select…</option>
                    {warehouses.map(w=><option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">To Warehouse</label>
                  <select className="form-select" value={form.toLocation} onChange={e=>setForm({...form,toLocation:e.target.value})}>
                    <option value="">Select…</option>
                    {warehouses.map(w=><option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <input className="form-input" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Reason for transfer…"/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
