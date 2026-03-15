import { mergeDup } from "./actions/mergeDup.js";
import { normalize } from "./actions/normalize.js";
import { fork } from "./actions/fork.js";
import { transform } from "./actions/transform.js";
import { enrich } from "./actions/enrich.js";
import { recalculate } from "./actions/recalculate.js";
import { filter } from "./actions/filter.js";
import { createLogger } from "./utils/logger.js";
const logger = createLogger("worker");
export const runJob = async (job, pipeline) => {
    let orders = [job.payload];
    for (const action of pipeline.actions) {
        logger.info("⚙️ Executing Action", {
            jobName: job.name,
            action: action.name,
            description: action.description,
        });
        switch (action.name) {
            case "mergeDup":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await mergeDup(order, action);
                    return result.order ?? order;
                }));
                break;
            case "filter":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await filter(order, action);
                    return result.order ?? order;
                }));
                break;
            case "normalize":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await normalize(order, action);
                    return result.order ?? order;
                }));
                break;
            case "recalculate":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await recalculate(order, action);
                    return result.order ?? order;
                }));
                break;
            case "fork":
                const forked = await fork(orders[0], {
                    subscribers: pipeline.subscribers,
                });
                orders = forked?.orders;
                break;
            case "transform":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await transform(order);
                    return result.order ?? order;
                }));
                break;
            case "enrich":
                orders = await Promise.all(orders.map(async (order) => {
                    const result = await enrich(order);
                    return result.order ?? order;
                }));
                break;
        }
    }
    console.log("end");
    return orders;
};
