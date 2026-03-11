type OrderItem = {
  id?: number;
  name?: string;
  price?: number;
  currency?: string;
};

type Customer = {
  id?: number;
  name?: string;
  city?: string;
  longitude?: number;
  latitude?: number;
  phoneNumber?: string;
};

export type Order = {
  id?: number;
  items?: OrderItem[];
  totalPrice?: number;
  currency?: string;
  customer?: Customer;
  subscriber?: string;
  extraField?: unknown;
  totalPriceWithTax?: number;
  shippingZone?: string;
};
