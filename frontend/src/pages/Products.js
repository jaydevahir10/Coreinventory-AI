import React, { useState, useEffect } from 'react';
import { Layout } from '../App';
import { useToast } from '../App';
import api from '../services/api';

export default function Products() {
  const toast = useToast();
  const [products, setProducts]   = useState([]);
  const [search,   setSearch]     = useState('');
  const [category, setCategory]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form, setForm] = useState({ name:'', sku:'', category:'', unit:'pcs', stock:0, reorderLevel:10 });

  const load = async () => {
    try {
      const params = {};
      if (search)   params.search   = search;
      if (category) params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch { toast('Failed to load products', 'error'); }
  };

  useEffect(() => { load(); }, [search, category]);

  const openAdd  = () => { setEditing(null); setForm({ name:'',sku:'',category:'',unit:'pcs',stock:0,reorderLevel:10 }); setShowModal(true); };
  const openEdit = (p)  => { setEditing(p); setForm({ name:p.name, sku:p.sku, category:p.category||'', unit:p.unit||'pcs', stock:p.stock, reorderLevel:p.reorderLevel }); setShowModal(true); };

  const save = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, form);
        toast('Product updated!');
      } else {
        await api.post('/products', form);
        toast('Product created!');
      }
      setShowModal(false); load();
    } catch (err) { toast(err.response?.data?.msg || 'Error saving', 'error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast('Product deleted'); load(); }
    catch { toast('Delete failed', 'error'); }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const statusColor = (p) => {
    if (p.stock === 0)                     return ['critical', '#f05b5b'];
    if (p.stock < p.reorderLevel)          return ['low',      '#f5a623'];
    return ['ok', '#22c987'];
  };

  return (
    <Layout title="Products" subtitle="Manage your product catalogue"
      actions={<button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>}>

      <div className="filter-bar">
        <input className="search-input" placeholder="Search by name or SKU…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="filter-select" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{marginLeft:'auto',fontSize:12,color:'var(--txt3)'}}>{products.length} products</span>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Product</th><th>SKU</th><th>Category</th>
              <th>Stock</th><th>Level</th><th>Reorder</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p => {
                const [status, color] = statusColor(p);
                const pct = Math.min(100, Math.round(p.stock / Math.max(p.reorderLevel * 2, 1) * 100));
                return (
                  <tr key={p._id}>
                    <td style={{fontWeight:500}}>{p.name}</td>
                    <td><span className="sku-tag">{p.sku}</span></td>
                    <td><span className="badge badge-info">{p.category || '—'}</span></td>
                    <td style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{p.stock} {p.unit}</td>
                    <td><div className="stock-bar"><div className="stock-fill" style={{width:`${pct}%`,background:color}}/></div></td>
                    <td style={{fontSize:12,color:'var(--txt2)'}}>{p.reorderLevel}</td>
                    <td><span className={`status-badge status-${status}`}>{status}</span></td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>del(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && <tr><td colSpan={8} style={{textAlign:'center',color:'var(--txt3)',padding:40}}>No products found. Add one!</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</div>
              <button className="modal-close" onClick={()=>setShowModal(false)}>×</button>
            </div>
            <form onSubmit={save}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input className="form-input" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} required/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Electronics, Apparel…"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                    {['pcs','kg','L','m','box','set'].map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Initial Stock</label>
                  <input type="number" className="form-input" value={form.stock} onChange={e=>setForm({...form,stock:+e.target.value})} min="0"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Reorder Level</label>
                  <input type="number" className="form-input" value={form.reorderLevel} onChange={e=>setForm({...form,reorderLevel:+e.target.value})} min="0"/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
