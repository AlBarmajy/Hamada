import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, placeOrder } = useStore();
  const navigate = useNavigate();
  const totalAmount = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'منية الساع'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    placeOrder(formData);
    navigate('/track');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-black text-brand-red mb-6 text-center">بيانات التوصيل</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">الاسم بالكامل</label>
            <input 
              required
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:outline-none"
              placeholder="مثال: أحمد محمد"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">رقم الهاتف</label>
            <input 
              required
              type="tel" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:outline-none"
              placeholder="01xxxxxxxxx"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">المنطقة</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:outline-none bg-white"
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value})}
            >
              <option value="منية الساع">منية الساع</option>
              <option value="نقباس">نقباس</option>
              <option value="أخرى">أخرى (تواصل معنا هاتفيًا للتأكيد)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">العنوان بالتفصيل</label>
            <textarea 
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-gold focus:outline-none"
              placeholder="الشارع، رقم المنزل، علامة مميزة..."
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
            <div className="flex justify-between font-bold text-lg mb-1">
              <span>الإجمالي المطلوب:</span>
              <span>{totalAmount} ج.م</span>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2 font-medium">
              * السعر غير شامل خدمة التوصيل (يتم تحديده عند الاستلام)
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-red text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-red-700 transition-colors mt-6"
          >
            تأكيد الطلب
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
