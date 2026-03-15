import { DeliveryAttempt } from "../schema.js";
export declare const createDeliveryAttempt: (
  deliveryAttempt: DeliveryAttempt,
) => Promise<{
  id: string;
  createdAt: Date;
  subscriberId: string;
  status: string;
  jobId: string;
  attempt: number | null;
}>;
