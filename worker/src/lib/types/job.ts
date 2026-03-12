export type OrderItem = {
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
  id?: number | string;
  items?: OrderItem[];
  totalPrice?: number;
  currency?: string;
  customer?: Customer;
  subscriber?: Subscriber;
  extraField?: unknown;
  totalPriceWithTax?: number;
  shippingZone?: string;
};

export type Subscriber = { id: string; name: string; url: string };

export type Job = {
  id: string;
  pipelineId: string | number;
  payload: Order;
  status: string;
  attempts: number;
};
