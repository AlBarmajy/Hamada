import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, MenuItem } from '../types';
import { AlertCircle, Clock, Check, Truck, X, Edit, EyeOff, Eye } from 'lucide-react';

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
  const { menu, toggleStock, updateMenuPrice } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const startEdit = (id: string, variant: string, currentPrice: number) => {
    setEditingId(id);
    setEditingVariant(variant);
    setTempPrice(currentPrice);
  };

  const saveEdit = () => {
    if (editingId && editingVariant) {
      updateMenuPrice(editingId, editingVariant, tempPrice);
      setEditingId(null);
      setEditingVariant(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menu.map(item => (
        <div key={item.id} className={`bg-white rounded-lg shadow border p-4 ${!item.isAvailable ? 'bg-red-50' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{item.name}</h3>
            <button 
              onClick={() => toggleStock(item.id)}
              className={`p-1 rounded ${item.isAvailable ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}
              title="تغيير التوفر"
            >
              {item.isAvailable ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          
          <div className="space-y-2 mt-4">
            {item.variants.map((variant, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span>{variant.name}</span>
                
                {editingId === item.id && editingVariant === variant.name ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      className="w-16 border rounded px-1 py-0.5"
                      value={tempPrice}
                      onChange={e => setTempPrice(Number(e.target.value))}
                    />
                    <button onClick={saveEdit} className="text-green-600"><Check size={16}/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{variant.price}</span>
                    <button 
                      onClick={() => startEdit(item.id, variant.name, variant.price)}
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
  );
};

export default AdminDashboard;
