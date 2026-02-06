export interface Variant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  variants: Variant[];
  isAvailable: boolean;
  image: string; // Made mandatory for the new strategy
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  itemId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string; // Carry image to cart for display
}

export type OrderStatus = 'new' | 'cooking' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressArea: string; // "منية الساع", "نقباس", "أخرى"
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: number;
  cancellationReason?: string;
}
