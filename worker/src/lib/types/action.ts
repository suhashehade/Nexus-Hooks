import { Order } from "./job";

export type Action = {
  config: any;
  name: string;
};
export type ActionResult = {
  status: "skipped" | "success" | "failed";
  error?: string;
  order?: Order;
  reason?: string;
};

export type ForkResult = {
  status: "success" | "skipped" | "failed";
  orders: Order[];
  reason?: string;
};
