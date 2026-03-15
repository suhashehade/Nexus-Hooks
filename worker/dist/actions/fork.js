export async function fork(order, config) {
    try {
        if (!order) {
            return {
                status: "failed",
                reason: "no order",
                orders: [order],
            };
        }
        if (!config.subscribers || config.subscribers.length === 0) {
            return {
                status: "skipped",
                reason: "no subscribers",
                orders: [order],
            };
        }
        const orders = config.subscribers.map((subscriber) => {
            const copy = structuredClone(order);
            copy.subscriber = subscriber;
            return copy;
        });
        return {
            status: "success",
            orders,
        };
    }
    catch (err) {
        return {
            status: "failed",
            reason: err.message,
            orders: [order],
        };
    }
}
