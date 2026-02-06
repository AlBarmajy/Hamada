import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, MenuItem, Variant } from '../types';
import { categories } from '../data/menu';
import { AlertCircle, Clock, Check, Truck, X, Edit, EyeOff, Eye, Plus, Save, Trash } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isAdmin, loginAdmin, logoutAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-brand-dark">دخول الإدارة</h2>
          <form onSubmit={(e) => { e.preventDefault(); loginAdmin(password); }} className="space-y-4">
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-red-700">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <div className="bg-white shadow border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-dark">لوحة تحكم حمادة</h1>
        <button onClick={logoutAdmin} className="text-red-500 font-semibold hover:underline">خروج</button>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'orders' ? 'bg-brand-red text-white' : 'bg-white text-gray-600'}`}
          >
            الطلبات الحية
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'menu' ? 'bg-brand-red text-white' : 'bg-white text-gray-600'}`}
          >
            إدارة المنيو
          </button>
        </div>

        {activeTab === 'orders' ? <LiveOrders /> : <MenuManager />}
      </div>
    </div>
  );
};

// 1. Live Orders Component
const LiveOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [now, setNow] = useState(Date.now());
  const [cancelModalOpen, setCancelModalOpen] = useState<string | null>(null); // holds order ID
  const [cancelReason, setCancelReason] = useState('أخرى');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000); // Update timers every second
    return () => clearInterval(interval);
  }, []);

  const getTimeElapsed = (timestamp: number) => {
    const diff = Math.floor((now - timestamp) / 1000 / 60); // minutes
    return `${diff} دقيقة`;
  };

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').sort((a, b) => b.timestamp - a.timestamp);

  const reasons = ["رقم الهاتف خاطئ", "العنوان غير واضح", "خارج النطاق", "تكرار الطلب", "أخرى"];

  const handleCancel = () => {
    if (cancelModalOpen) {
      updateOrderStatus(cancelModalOpen, 'cancelled', cancelReason);
      setCancelModalOpen(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-4">العميل</th>
              <th className="p-4">العنوان</th>
              <th className="p-4">الطلب</th>
              <th className="p-4">الإجمالي</th>
              <th className="p-4">الوقت</th>
              <th className="p-4">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded-md ml-1">{order.addressArea}</span>
                  <div className="text-sm mt-1 max-w-xs">{order.address}</div>
                </td>
                <td className="p-4">
                  <ul className="text-sm list-disc list-inside">
                    {order.items.map((i, idx) => (
                      <li key={idx}>{i.quantity}x {i.name} ({i.variantName})</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 font-bold text-brand-red">{order.totalAmount} ج.م</td>
                <td className="p-4 font-mono text-blue-600 font-bold">{getTimeElapsed(order.timestamp)}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <button onClick={() => updateOrderStatus(order.id, 'cooking')} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" title="بدء التحضير"><Clock size={16}/></button>
                    )}
                    {order.status === 'cooking' && (
                      <button onClick={() => updateOrderStatus(order.id, 'out_for_delivery')} className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600" title="خروج للتوصيل"><Truck size={16}/></button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="bg-green-500 text-white p-2 rounded hover:bg-green-600" title="تم التسليم"><Check size={16}/></button>
                    )}
                    
                    <button onClick={() => setCancelModalOpen(order.id)} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200" title="إلغاء">
                      <X size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeOrders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">لا توجد طلبات نشطة حالياً</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-4 text-red-600">سبب الإلغاء</h3>
            <select 
              className="w-full border border-gray-300 p-2 rounded mb-4"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            >
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={handleCancel} className="flex-1 bg-red-600 text-white py-2 rounded font-bold">تأكيد الإلغاء</button>
              <button onClick={() => setCancelModalOpen(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold">تراجع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Menu Manager Component
const MenuManager: React.FC = () => {
  const { menu, toggleStock, updateVariantPrice, updateMenuItem, addMenuItem } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit State
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editVariant, setEditVariant] = useState('');

  // Add State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<{name: string, category: string, desc: string, variants: Variant[]}>({
    name: '', category: categories[0].id, desc: '', variants: [{name: 'افتراضي', price: 0}]
  });

  const startEditPrice = (id: string, variant: string, currentPrice: number) => {
    setEditingId(id);
    setEditVariant(variant);
    setEditPrice(currentPrice);
    setEditName(''); // Clear name edit
  };

  const startEditName = (item: MenuItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditVariant(''); // Clear variant edit
  };

  const savePrice = () => {
    if (editingId && editVariant) {
      updateVariantPrice(editingId, editVariant, editPrice);
      setEditingId(null);
    }
  };

  const saveName = () => {
    if (editingId && editName) {
      updateMenuItem(editingId, { name: editName });
      setEditingId(null);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.variants.length === 0) return;
    
    const itemToAdd: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      categoryId: newItem.category,
      description: newItem.desc,
      isAvailable: true,
      variants: newItem.variants
    };

    addMenuItem(itemToAdd);
    setShowAddForm(false);
    setNewItem({ name: '', category: categories[0].id, desc: '', variants: [{name: 'افتراضي', price: 0}] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">قائمة الطعام</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} /> إضافة صنف جديد
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg m-4">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">إضافة صنف جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">اسم الصنف</label>
                <input 
                  type="text" className="w-full border p-2 rounded"
                  value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">القسم</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">الوصف (اختياري)</label>
                <textarea 
                  className="w-full border p-2 rounded"
                  value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">الأنواع والأسعار</label>
                {newItem.variants.map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input 
                      placeholder="الحجم/النوع" className="flex-1 border p-2 rounded"
                      value={v.name} 
                      onChange={e => {
                        const newV = [...newItem.variants];
                        newV[i].name = e.target.value;
                        setNewItem({...newItem, variants: newV});
                      }}
                    />
                    <input 
                      placeholder="السعر" type="number" className="w-24 border p-2 rounded"
                      value={v.price} 
                      onChange={e => {
                        const newV = [...newItem.variants];
                        newV[i].price = Number(e.target.value);
                        setNewItem({...newItem, variants: newV});
                      }}
                    />
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => setNewItem({...newItem, variants: [...newItem.variants, {name: '', price: 0}]})}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + إضافة حجم آخر
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleAddItem} className="flex-1 bg-green-600 text-white py-2 rounded font-bold">حفظ</button>
                <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <div key={item.id} className={`bg-white rounded-lg shadow border p-4 ${!item.isAvailable ? 'bg-red-50' : ''}`}>
            
            {/* Header: Name & Availability */}
            <div className="flex justify-between items-start mb-2">
              {editingId === item.id && editName !== '' ? (
                 <div className="flex items-center gap-2 flex-1">
                   <input 
                    type="text" className="border rounded px-2 py-1 w-full" 
                    value={editName} onChange={e => setEditName(e.target.value)}
                   />
                   <button onClick={saveName} className="text-green-600 bg-green-100 p-1 rounded"><Check size={16}/></button>
                   <button onClick={() => setEditingId(null)} className="text-red-600 bg-red-100 p-1 rounded"><X size={16}/></button>
                 </div>
              ) : (
                <div className="flex items-center gap-2">
                   <h3 className="font-bold text-lg">{item.name}</h3>
                   <button onClick={() => startEditName(item)} className="text-gray-400 hover:text-blue-500"><Edit size={14}/></button>
                </div>
              )}

              <button 
                onClick={() => toggleStock(item.id)}
                className={`p-1 rounded ${item.isAvailable ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}
                title="تغيير التوفر"
              >
                {item.isAvailable ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            
            <div className="w-full h-32 bg-[#F8A45E] flex items-center justify-center text-white font-bold text-xl rounded mb-3">
              {item.name}
            </div>

            {/* Variants */}
            <div className="space-y-2 mt-2">
              {item.variants.map((variant, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                  <span>{variant.name}</span>
                  
                  {editingId === item.id && editVariant === variant.name ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        className="w-20 border rounded px-1 py-0.5"
                        value={editPrice}
                        onChange={e => setEditPrice(Number(e.target.value))}
                      />
                      <button onClick={savePrice} className="text-green-600"><Check size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="text-red-600"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-red">{variant.price} ج.م</span>
                      <button 
                        onClick={() => startEditPrice(item.id, variant.name, variant.price)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;