import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/menu';
import { Plus, Check } from 'lucide-react';
import { MenuItem } from '../types';

const Home: React.FC = () => {
  const { menu, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filterMenu = (catId: string) => menu.filter(item => item.categoryId === catId);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-brand-red text-white py-12 px-4 text-center shadow-lg">
        <h1 className="text-4xl md:text-6xl font-black mb-2 text-brand-gold">كشري حمادة</h1>
        <p className="text-lg md:text-xl opacity-90">أصل الكشري والطواجن في مصر</p>
      </div>

      {/* Category Nav - Sticky */}
      <div className="sticky top-16 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar whitespace-nowrap py-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`ml-3 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-red text-brand-gold shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 border-r-4 border-brand-gold pr-3">
          {categories.find(c => c.id === activeCategory)?.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterMenu(activeCategory).map(item => (
            <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual cards
const MenuItemCard: React.FC<{ item: MenuItem; onAdd: any }> = ({ item, onAdd }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const variant = item.variants[selectedVariantIndex];
    onAdd(item, variant.name, variant.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const currentVariant = item.variants[selectedVariantIndex];

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${!item.isAvailable ? 'opacity-60 grayscale' : ''}`}>
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${item.id}/400/200`} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
            غير متاح
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <span className="text-brand-red font-bold text-lg">{currentVariant.price} ج.م</span>
        </div>
        
        {item.description && (
          <p className="text-xs text-gray-500 mb-3">{item.description}</p>
        )}

        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-500 block mb-1">الحجم / النوع:</label>
          <select 
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none mb-3"
            value={selectedVariantIndex}
            onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
            disabled={!item.isAvailable}
          >
            {item.variants.map((v, idx) => (
              <option key={idx} value={idx}>
                {v.name} - {v.price} ج.م
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              added 
                ? 'bg-green-600 text-white' 
                : 'bg-brand-red text-white hover:bg-red-700'
            } disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <Check size={18} /> تم الإضافة
              </>
            ) : (
              <>
                <Plus size={18} /> أضف للسلة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
