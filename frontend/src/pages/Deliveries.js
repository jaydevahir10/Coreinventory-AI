import React, { useState, useEffect } from 'react';
import { Layout, useToast } from '../App';
import api from '../services/api';

export default function Deliveries() {
  const toast = useToast();
  const [deliveries, setDeliveries] = useState([]);
  const [products,   setProducts]   = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [form, setForm] = useState({ productId:'', quantity:'', note:'' });

  const load = async () => {
    try {
      const [d, p] = await Promise.all([api.get('/delivery'), api.get('/products')]);
      setDeliveries(d.data); setProducts(p.data);
    } catch { toast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const create = async e => {
    e.preventDefault();
    try {
      await api.post('/delivery', { productId: form.productId, quantity: +form.quantity, note: form.note });
      toast('Delivery created!'); setShowModal(false); setForm({productId:'',quantity:'',note:''}); load();
    } catch (err) { toast(err.response?.data?.msg || 'Error', 'error'); }
  };

  const validate = async (id) => {
    try { await api.put(`/delivery/${id}/validate`); toast('Delivery validated — stock reduced!'); load(); }
    catch (err) { toast(err.response?.data?.msg || 'Insufficient stock', 'error'); }
  };

  return (
    <Layout title="Deliveries" subtitle="Outgoing stock management"
      actions={<button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ New Delivery</button>}>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Status</th><th>Date</th><th>Note</th><th>Action</th></tr></thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d._id}>
                  <td style={{fontWeight:500}}>{d.productId?.name || '—'}</td>
                  <td><span className="sku-tag">{d.productId?.sku || '—'}</span></td>
                  <td style={{fontFamily:"'DM Mono',monospace"}}>{d.quantity}</td>
                  <td><span className={`status-badge status-${d.status}`}>{d.status}</span></td>
                  <td style={{fontSize:12,color:'var(--txt2)'}}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{fontSize:12,color:'var(--txt3)'}}>{d.note || '—'}</td>
                  <td>{d.status==='pending'&&<button className="btn btn-primary btn-sm" onClick={()=>validate(d._id)}>Validate</button>}</td>
                </tr>
              ))}
              {deliveries.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:'var(--txt3)',padding:40}}>No deliveries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">New Delivery</div><button className="modal-close" onClick={()=>setShowModal(false)}>×</button></div>
            <form onSubmit={create}>
              <div className="form-group">
                <label className="form-label">Product *</label>
                <select className="form-select" value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})} required>
                  <option value="">Select product…</option>
                  {products.map(p=><option key={p._id} value={p._id}>{p.name} — stock: {p.stock}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input type="number" className="form-input" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} min="1" required/>
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <input className="form-input" placeholder="Customer, order ref…" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Delivery</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
