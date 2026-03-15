export async function filter(order, action) {
    const price = order.totalPrice;
    const { config } = action;
    try {
        if (price < config.minPrice) {
            return {
                status: "skipped",
                reason: `Order price ${price} is less than minimum ${config.minPrice}`,
            };
        }
        return {
            status: "success",
            order: order,
        };
    }
    catch (err) {
        return {
            status: "failed",
            error: err.message || "Unknown error",
            order: order,
        };
    }
}
