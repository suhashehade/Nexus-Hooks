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

      // case "route":
      //   await Promise.all(
      //     orders.map(
      //       async (order) => await route(order, pipeline.id, job.id!, action),
      //     ),
      //   );
      //   break;
    }
  }
  console.log("end");
  return orders;
};

// ===== Usage Example =====
// const mockJob: Job = {
//   id: "17a81e5d-ae3d-48ec-84fe-806876c10765",
//   pipelineId: "6a73df67-a2d8-431e-b85f-926af1012930",
//   payload: {
//     id: 1,
//     items: [{ id: 1, name: "tuna", price: 12, currency: "ILS" }],
//     currency: "ILS",
//     customer: {
//       id: 1,
//       city: "Nablus",
//       name: "Ahmed",
//       latitude: 32,
//       longitude: 32,
//       phoneNumber: "0599876543",
//     },
//     totalPrice: 12,
//   },
//   status: "pending",
//   attempts: 0,
// };

// const mockPipeline = {
//   id: "6a73df67-a2d8-431e-b85f-926af1012930",
//   name: "pipeline fancy",
//   source: {
//     id: "7cddfd1b-48bc-4c70-a82b-1dee140cb396",
//     name: "Royal Restaurant",
//     url: "http://localhost:8080/api/webhooks/sources/royal",
//     address: "Nablus",
//   },
//   subscribers: [
//     {
//       id: "e91e4e7c-9810-4cc7-a433-e612fabcda78",
//       name: "Accounting",
//       url: "http://localhost:8081/api/subscribers/accounting",
//     },
//     {
//       id: "b6620bbb-a067-487a-86da-fee37f93b893",
//       name: "Shipping",
//       url: "http://localhost:8081/api/subscribers/shipping",
//     },
//   ],
//   actions: [
//     {
//       id: "e4758403-ec83-4ef8-99e6-c09029dae283",
//       name: "mergeDup",
//       editable: false,
//       required: false,
//       description: "Merge order items that have the same item id and item name",
//       order: 3,
//       config: {
//         mergeBy: "id",
//       },
//     },
//     {
//       id: "fa1161b4-9d24-474d-92c8-5d2e8121de65",
//       name: "filter",
//       editable: false,
//       required: false,
//       description: "Filter order by price = 10",
//       order: 4,
//       config: {
//         minPrice: 20,
//       },
//     },
//     {
//       id: "b7c80a6e-ee5a-4370-9220-bdb5580ecf88",
//       name: "normalize",
//       editable: true,
//       required: false,
//       description:
//         "Add Palestinian code to phone number and capitalize the city name",
//       order: 5,
//       config: {
//         phoneNumber: true,
//         prefixes: ["+970", "+972"],
//       },
//     },
//     {
//       id: "b7c80a6e-ee5a-4370-9220-bdb5580ecf85",
//       name: "fork",
//       editable: false,
//       required: true,
//       description:
//         "Add Palestinian code to phone number and capitalize the city name",
//       order: 6,
//       config: {},
//     },
//     {
//       id: "b7c80a6e-ee5a-4370-9220-bdb5580ecf81",
//       name: "transform",
//       editable: false,
//       required: true,
//       description:
//         "Add Palestinian code to phone number and capitalize the city name",
//       order: 7,
//       config: {},
//     },
//     {
//       id: "b7c80a6e-ee5a-4370-9220-bdb5580ecf82",
//       name: "enrich",
//       editable: false,
//       required: true,
//       description:
//         "Add Palestinian code to phone number and capitalize the city name",
//       order: 8,
//       config: {},
//     },
//     {
//       id: "b7c80a6e-ee5a-4370-9220-bdb5580ecf87",
//       name: "route",
//       editable: false,
//       required: true,
//       description:
//         "Add Palestinian code to phone number and capitalize the city name",
//       order: 9,
//       config: {},
//     },
//   ],
// };

// (async () => {
//   const result = await runJob(mockJob, mockPipeline);
//   console.log(JSON.stringify(result, null, 2));
// })();
