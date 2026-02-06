import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Trash2 size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">السلة فارغة</h2>
        <p className="text-gray-500 mb-6">أنت لسه مطلبتش حاجة من حمادة؟</p>
        <Link to="/" className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
          تصفح المنيو
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-brand-red">سلة الطلبات</span>
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {cart.map((item, idx) => (
          <div key={`${item.itemId}-${item.variantName}`} className={`p-4 flex items-center gap-4 ${idx !== cart.length - 1 ? 'border-b border-gray-100' : ''}`}>
            {/* Image Placeholder */}
            <div className="w-16 h-16 bg-[#F8A45E] rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-white text-xs text-center font-bold p-1">
               {item.name}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.variantName}</p>
              <div className="text-brand-red font-bold mt-1">{item.price * item.quantity} ج.م</div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={() => updateQuantity(item.itemId, item.variantName, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-red"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.itemId, item.variantName, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600"
              >
                <Plus size={16} />
              </button>
            </div>

            <button 
              onClick={() => removeFromCart(item.itemId, item.variantName)}
              className="text-gray-400 hover:text-red-500 p-2"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center text-lg mb-2">
          <span className="text-gray-600">المجموع الفرعي:</span>
          <span className="font-bold">{totalAmount} ج.م</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <span>* السعر غير شامل خدمة التوصيل</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={clearCart}
            className="px-4 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-bold"
          >
            إفراغ
          </button>
          <button 
            onClick={() => navigate('/checkout')}
            className="flex-1 bg-brand-gold text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex justify-center items-center gap-2"
          >
            إتمام الطلب <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;