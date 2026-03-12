import {
  createDeliveryAttempt,
  getJob,
  getPipelineByID,
  updateJobStatus,
} from "db";
import { runJob } from "./executor.js";
import axios from "axios";
import { Order, Subscriber } from "./lib/types/job.js";

async function runMockWorker() {
  try {
    console.log("Starting worker with mock job...");
    const job = await getJob();
    if (!job) {
      throw new Error("no found");
    }

    const pipelineId: string = job.pipelineId;
    const pipeline = await getPipelineByID(pipelineId);

    const orders = await runJob(job, pipeline);
    const promises = orders.map(async (order: Order) => {
      try {
        const res = await axios.post(order.subscriber!.url, order);

        await createDeliveryAttempt({
          jobId: job!.id!,
          subscriberId: order.subscriber!.id,
          status: "success",
          attempt: 1,
        });

        return { success: true, res };
      } catch (err: any) {
        await createDeliveryAttempt({
          jobId: job!.id!,
          subscriberId: order.subscriber!.id,
          status: "failed",
          attempt: 1,
        });

        console.log(`Delivery failed for ${order.subscriber!.name}`);

        return { success: false };
      }
    });

    const responses = await Promise.all(promises);
    try {
      console.log("Processed result:", JSON.stringify(orders, null, 2));
      for (const res of responses) {
        if (!res.success) {
          await updateJobStatus(job!.id!, "failed");
        } else {
          await updateJobStatus(job!.id!, "completed");
          console.log(
            "response:",
            JSON.stringify({
              data: res.res?.data,
              status: res.res?.status,
              statusText: res.res?.statusText,
            }),
          );
        }
      }
    } catch (err: any) {
      await updateJobStatus(job!.id!, "failed");
      console.log("Error: ", err.message);
    }
  } catch (err: any) {
    console.log("Error: ", err.message);
  }
}

await runMockWorker();

// const mockJob: any = {
//   id: "17a81e5d-ae3d-48ec-84fe-806876c10765",
//   pipelineId: "6a73df67-a2d8-431e-b85f-926af1012930",
//   payload: {
//     id: 1,
//     items: [
//       { id: 1, name: "tuna", price: 12, currency: "ILS" },
//       { id: 1, name: "tuna", price: 23, currency: "ILS" },
//     ],
//     currency: "ILS",
//     customer: {
//       id: 1,
//       city: "Nablus",
//       name: "Ahmed",
//       latitude: 32,
//       longitude: 32,
//       phoneNumber: "0599876543",
//     },
//     totalPrice: 35,
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
