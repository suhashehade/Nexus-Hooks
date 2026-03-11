// import { executor } from "./executor";

// // worker picks jobs from DB queue
// const mockJobPayload = {
//   id: 1,
//   items: [{ id: 1, name: "tuna", price: 12, currency: "ILS" }],
//   totalPrice: 12,
//   currency: "ILS",
//   customer: {
//     id: 1,
//     name: "Ahmed",
//     city: "Nablus",
//     longitude: 32,
//     latitude: 32,
//     phoneNumber: "0599876543",
//   },
// };
// const mockPipeline = ["rateLimit", "filterStructure", "dedup"];

// async function runMockWorker() {
//   console.log("Starting worker with mock job...");
//   const result = await executor(mockJobPayload, mockPipeline);
//   console.log("Processed result:", result);
// }

// runMockWorker();
