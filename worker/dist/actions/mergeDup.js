export async function mergeDup(order, action) {
    const { config } = action;
    const items = order.items;
    try {
        const map = new Map();
        const mergeBy = config.mergeBy;
        if (items) {
            for (const item of items) {
                const key = item[mergeBy];
                if (map.has(key)) {
                    const existing = map.get(key);
                    existing.price = (existing.price || 0) + (item.price || 0);
                }
                else {
                    map.set(key, { ...item });
                }
            }
        }
        order.items = Array.from(map.values());
        return {
            status: "success",
            order,
        };
    }
    catch (err) {
        return {
            status: "failed",
            error: err.message || "unknown error",
            order,
        };
    }
}
