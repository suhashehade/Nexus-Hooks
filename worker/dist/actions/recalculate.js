export async function recalculate(order, action) {
    const { config } = action;
    try {
        if (!config?.totalPrice) {
            return { status: "skipped", reason: "totalPrice recalc disabled", order };
        }
        const sum = order.items?.reduce((acc, item) => acc + (item.price ?? 0), 0) ?? 0;
        if (order.totalPrice !== sum) {
            order.totalPrice = sum;
        }
        return { status: "success", order };
    }
    catch (err) {
        return { status: "failed", reason: err.message, order };
    }
}
