import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, Order, OrderStatus } from '../types';
import { initialMenu } from '../data/menu';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';

interface StoreContextType {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  addToCart: (item: MenuItem, variantName: string, price: number) => void;
  removeFromCart: (itemId: string, variantName: string) => void;
  updateQuantity: (itemId: string, variantName: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string; phone: string; address: string; area: string }) => Promise<void>;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  updateVariantPrice: (itemId: string, variantName: string, newPrice: number) => void;
  toggleStock: (itemId: string) => void;
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hamada_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('hamada_admin') === 'true');

  // مزامنة المنيو لحظياً
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
      if (!snapshot.empty) {
        const dbMenu = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as MenuItem[];
        setMenu(dbMenu);
      } else {
        // رفع المنيو الافتراضي في أول تشغيل
        initialMenu.forEach(async (item) => {
          await setDoc(doc(db, "menu", item.id), item);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // مزامنة الطلبات للأدمن فقط
  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const dbOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Order[];
        setOrders(dbOrders);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  useEffect(() => { localStorage.setItem('hamada_cart', JSON.stringify(cart)); }, [cart]);
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

  const placeOrder = async (customer: { name: string; phone: string; address: string; area: string }) => {
    const newOrder = {
      customerName: customer.name,
      customerPhone: customer.phone,
      address: customer.address,
      addressArea: customer.area,
      items: cart,
      totalAmount: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
      status: 'new' as OrderStatus,
      timestamp: Date.now()
    };
    await addDoc(collection(db, "orders"), newOrder);
    clearCart();
  };

  const loginAdmin = (pass: string) => {
    if (pass === 'hamada012') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  const updateOrderStatus = async (orderId: string, status: OrderStatus, reason?: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, cancellationReason: reason || null });
  };

  const updateVariantPrice = async (itemId: string, variantName: string, newPrice: number) => {
    const item = menu.find(i => i.id === itemId);
    if (item) {
      const updatedVariants = item.variants.map(v => v.name === variantName ? { ...v, price: newPrice } : v);
      await updateDoc(doc(db, "menu", itemId), { variants: updatedVariants });
    }
  };

  const toggleStock = async (itemId: string) => {
    const item = menu.find(i => i.id === itemId);
    if (item) {
      await updateDoc(doc(db, "menu", itemId), { isAvailable: !item.isAvailable });
    }
  };

  const addMenuItem = async (item: MenuItem) => {
    await setDoc(doc(db, "menu", item.id), item);
  };

  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    await updateDoc(doc(db, "menu", itemId), updates);
  };

  return (
    <StoreContext.Provider value={{
      menu, cart, orders, isAdmin,
      addToCart, removeFromCart, updateQuantity, clearCart,
      placeOrder, loginAdmin, logoutAdmin, updateOrderStatus,
      updateVariantPrice, toggleStock, addMenuItem, updateMenuItem
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