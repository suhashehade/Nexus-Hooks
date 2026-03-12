import { mergeDup } from "./actions/mergeDup.js";
import { normalize } from "./actions/normalize.js";
import { fork } from "./actions/fork.js";
import { transform } from "./actions/transform.js";
import { enrich } from "./actions/enrich.js";
import { recalculate } from "./actions/recalculate.js";
import { route } from "./actions/routing.js";
import { Order } from "./lib/types/job.js";
import { Job } from "db";
import { filter } from "./actions/filter.js";

export const runJob = async (job: Job, pipeline: any) => {
  let orders: Order[] = [job.payload!];
  console.log("start");

  for (const action of pipeline.actions) {
    console.log(`action type: ${action.name}`);
    switch (action.name) {
      case "mergeDup": // action.config = { "by": "id" }
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await mergeDup(order, pipeline.id, job.id!, action);
            return result.order ?? order;
          }),
        );
        break;
      case "filter": //  "config": { "price": true, "minPrice": 20 }
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await filter(order, pipeline.id, job.id!, action);

            return result.order ?? order;
          }),
        );
        break;
      case "normalize": // "config": { "phoneNumber": true, "prefixes": ['+972', '+970'] },
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await normalize(order, pipeline.id, job.id!, action);
            return result.order ?? order;
          }),
        );
        break;
      case "recalculate": // "config": { "totalPrice": true }
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await recalculate(
              order,
              pipeline.id,
              job.id!,
              action,
            );
            return result.order ?? order;
          }),
        );
        break;

      case "fork":
        const forked = await fork(
          orders[0],
          {
            subscribers: pipeline.subscribers,
          },
          pipeline.id,
          job.id!,
          action,
        );
        orders = forked?.orders;
        break;
      case "transform":
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await transform(order, pipeline.id, job.id!, action);
            return result.order ?? order;
          }),
        );
        break;
      case "enrich":
        orders = await Promise.all(
          orders.map(async (order: Order) => {
            const result = await enrich(order, pipeline.id, job.id!, action);
            return result.order ?? order;
          }),
        );
        break;
    }
  }
  console.log("end");
  return orders;
};
