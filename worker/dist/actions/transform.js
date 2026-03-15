export async function transform(order) {
    try {
        if (!order.subscriber) {
            return {
                status: "skipped",
                reason: "no subscriber",
                order,
            };
        }
        if (order.subscriber.name.toLocaleLowerCase() === "accounting") {
            return {
                status: "success",
                order: {
                    id: order.id,
                    customer: order.customer,
                    subscriber: order.subscriber,
                    totalPrice: (order.totalPrice || 0) * 2,
                    items: order.items,
                },
            };
        }
        if (order.subscriber.name.toLocaleLowerCase() === "shipping") {
            return {
                status: "success",
                order: {
                    id: order.id,
                    customer: order.customer,
                    subscriber: order.subscriber
                },
            };
        }
        return {
            status: "skipped",
            reason: "unknown subscriber",
            order,
        };
    }
    catch (err) {
        return {
            status: "failed",
            error: err.message || "transform failed",
            order,
        };
    }
}
