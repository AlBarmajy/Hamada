import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

const OrderTracker: React.FC = () => {
  const { orders } = useStore();
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState<Order[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.filter(o => o.customerPhone === phone).sort((a, b) => b.timestamp - a.timestamp);
    setResults(found);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-brand-dark mb-4">تتبع طلبك</h1>
        <p className="text-gray-600">أدخل رقم هاتفك لمتابعة حالة طلباتك الحالية والسابقة</p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="tel" 
            placeholder="رقم الهاتف" 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button type="submit" className="bg-brand-gold text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-yellow-500">
            <Search size={20} />
          </button>
        </form>
      </div>

      {results && results.length === 0 && (
        <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-xl">
          لا توجد طلبات مسجلة بهذا الرقم.
        </div>
      )}

      <div className="space-y-6">
        {results?.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'new': return { color: 'bg-yellow-100 text-yellow-800', label: 'قيد المراجعة', icon: Clock };
      case 'cooking': return { color: 'bg-blue-100 text-blue-800', label: 'جاري التحضير', icon: Package };
      case 'out_for_delivery': return { color: 'bg-orange-100 text-orange-800', label: 'خرج للتوصيل', icon: Truck };
      case 'delivered': return { color: 'bg-green-100 text-green-800', label: 'تم الاستلام', icon: CheckCircle };
      case 'cancelled': return { color: 'bg-red-100 text-red-800', label: 'ملغي', icon: XCircle };
      default: return { color: 'bg-gray-100', label: 'غير معروف', icon: Clock };
    }
  };

  const config = getStatusConfig(order.status);
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500 block">رقم الطلب #{order.id.slice(-6)}</span>
          <span className="text-xs text-gray-400 block">{new Date(order.timestamp).toLocaleString('ar-EG')}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${config.color}`}>
          <StatusIcon size={16} />
          {config.label}
        </div>
      </div>
      
      <div className="p-4">
        {order.status === 'cancelled' && order.cancellationReason && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold border border-red-200">
            سبب الإلغاء: {order.cancellationReason}
          </div>
        )}

        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name} <span className="text-gray-400">({item.variantName})</span>
              </span>
              <span className="font-semibold">{item.price * item.quantity} ج.م</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-600">الإجمالي</span>
          <span className="font-black text-xl text-brand-red">{order.totalAmount} ج.م</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
