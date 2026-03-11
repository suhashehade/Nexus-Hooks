// execute pipeline's actions in orders:
// filter -> dedup -> normalize -> validate -> transform -> currencyChange -> labeling -> enrich -> routing

// mergeDup;
// filterPrice;
// normalize;
// recalcTotalPrice;
// fork;
// transform;
// enrich;
// routing;

// worker/src/executor.mock.ts
import { mergeDup } from "./actions/mergeDup";
import { filterPrice } from "./actions/filterPrice";
import { normalizePhone } from "./actions/normalizePhone";
import { fork } from "./actions/fork";
import { transform } from "./actions/transform";
import { enrich } from "./actions/enrich";
import { recalculateTotalPrice } from "./actions/recalcTotalPrice";
import { route } from "./actions/routing";

type Order = any; // استبدلي بـ type صحيح
type Subscriber = { id: string; name: string; url: string };

interface Job {
  id: string;
  pipelineId: string;
  payload: Order;
  status: string;
  attempts: number;
}

// Mock executor
export const runJob = async (job: Job, subscribers: Subscriber[]) => {
  let orders: Order[] = [job.payload]; // نبدأ بواحد order

  // mergeDup
  orders = await Promise.all(
    orders.map(async (order) => (await mergeDup(order)).order),
  );

  // filterPrice
  orders = (
    await Promise.all(
      orders.map(async (order) => {
        const result = await filterPrice(order, { minPrice: 10 });
        return result.status === "success" ? result.order : null;
      }),
    )
  ).filter(Boolean);

  // normalize
  orders = await Promise.all(
    orders.map(async (order) => (await normalizePhone(order)).order),
  );

  // recalcTotalPrice
  orders = await Promise.all(
    orders.map(async (order) => (await recalculateTotalPrice(order)).order),
  );

  // fork
  const forked = await fork(orders[0], {
    subscribers: subscribers.map((s) => s.name),
  }); // fork واحد → Order[] لكل subscriber
  orders = forked?.orders;

  // transform
  orders = await Promise.all(
    orders.map(async (order) => (await transform(order)).order),
  );

  // enrich
  orders = await Promise.all(
    orders.map(async (order) => (await enrich(order)).order),
  );

  // routing
  await Promise.all(orders.map(async (order) => await route(order)));

  return orders;
};

// ===== Usage Example =====
const mockJob: Job = {
  id: "17a81e5d-ae3d-48ec-84fe-806876c10765",
  pipelineId: "6a73df67-a2d8-431e-b85f-926af1012930",
  payload: {
    id: 1,
    items: [{ id: 1, name: "tuna", price: 12, currency: "ILS" }],
    currency: "ILS",
    customer: {
      id: 1,
      city: "Nablus",
      name: "Ahmed",
      latitude: 32,
      longitude: 32,
      phoneNumber: "0599876543",
    },
    totalPrice: 12,
  },
  status: "pending",
  attempts: 0,
};

const mockSubscribers: Subscriber[] = [
  {
    id: "e91e4e7c-9810-4cc7-a433-e612fabcda78",
    name: "Accounting",
    url: "http://localhost:8081/api/subscribers/accounting",
  },
  {
    id: "b6620bbb-a067-487a-86da-fee37f93b893",
    name: "Shipping",
    url: "http://localhost:8082/api/subscribers/shipping",
  },
];

(async () => {
  const result = await runJob(mockJob, mockSubscribers);
  console.log(JSON.stringify(result, null, 2));
})();
