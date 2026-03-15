export async function normalize(order, action) {
    const { config } = action;
    const prefixes = config?.prefixes ?? ["+970", "+972"];
    try {
        const phone = order.customer?.phoneNumber;
        if (!phone)
            return { status: "skipped", reason: "no phone number", order };
        let phoneNumber = phone.replace(/\s+/g, "");
        for (const prefix of prefixes) {
            if (phoneNumber.startsWith(prefix)) {
                phoneNumber = phoneNumber.slice(prefix.length);
                break;
            }
        }
        if (phoneNumber.startsWith("0"))
            phoneNumber = phoneNumber.slice(1);
        let matchedPrefix = null;
        for (const prefix of prefixes) {
            if (prefix === "+972" &&
                ["2", "3", "4", "8", "9"].includes(phoneNumber[0])) {
                matchedPrefix = prefix;
                break;
            }
            if (prefix === "+970") {
                matchedPrefix = prefix;
                break;
            }
        }
        if (!matchedPrefix)
            return { status: "skipped", reason: "unknown pattern", order };
        const newOrder = {
            ...order,
            customer: { ...order.customer, phoneNumber: matchedPrefix + phoneNumber },
        };
        return { status: "success", order: newOrder };
    }
    catch (err) {
        return { status: "failed", reason: err.message, order };
    }
}
