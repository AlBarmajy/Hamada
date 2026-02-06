import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '../types';
import { initialMenu } from '../data/menu';

interface StoreContextType {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  addToCart: (item: MenuItem, variantName: string, price: number) => void;
  removeFromCart: (itemId: string, variantName: string) => void;
  updateQuantity: (itemId: string, variantName: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string; phone: string; address: string; area: string }) => void;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  updateMenuPrice: (itemId: string, variantName: string, newPrice: number) => void;
  toggleStock: (itemId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('hamada_menu');
    return saved ? JSON.parse(saved) : initialMenu;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hamada_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hamada_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('hamada_admin') === 'true';
  });

  useEffect(() => { localStorage.setItem('hamada_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('hamada_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('hamada_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hamada_admin', String(isAdmin)); }, [isAdmin]);

  const addToCart = (item: MenuItem, variantName: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.id && i.variantName === variantName);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item.id, name: item.name, variantName, price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string, variantName: string) => {
    setCart(prev => prev.filter(i => !(i.itemId === itemId && i.variantName === variantName)));
  };

  const updateQuantity = (itemId: string, variantName: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.itemId === itemId && i.variantName === variantName) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customer: { name: string; phone: string; address: string; area: string }) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName: customer.name,
      customerPhone: customer.phone,
      address: customer.address,
      addressArea: customer.area,
      items: [...cart],
      totalAmount: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
      status: 'new',
      timestamp: Date.now()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const loginAdmin = (pass: string) => {
    if (pass === 'hamada012') { // Prompt specified login
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, cancellationReason: reason } : o));
  };

  const updateMenuPrice = (itemId: string, variantName: string, newPrice: number) => {
    setMenu(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          variants: item.variants.map(v => v.name === variantName ? { ...v, price: newPrice } : v)
        };
      }
      return item;
    }));
  };

  const toggleStock = (itemId: string) => {
    setMenu(prev => prev.map(item => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  return (
    <StoreContext.Provider value={{
      menu, cart, orders, isAdmin,
      addToCart, removeFromCart, updateQuantity, clearCart,
      placeOrder, loginAdmin, logoutAdmin, updateOrderStatus,
      updateMenuPrice, toggleStock
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
