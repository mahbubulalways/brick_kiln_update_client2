export const getMovementTypeBangla = (type: string) => {
    const typeMap: Record<string, string> = {
        RAWENTRY: "কাঁচা ইট এন্ট্রি",

        FIELD_TO_CHULLI: "মাঠ থেকে চুল্লিতে",

        STOCK_TO_CHULLI: "স্টক থেকে চুল্লিতে",

        CHULLI_TO_FINISHED: "চুল্লি থেকে পাকা ইটে",

        FIELD_TO_STOCK: "মাঠ থেকে স্টকে",
        RAW_TO_FIELD: "কাঁচা ইট মাঠে",

    };

    return typeMap[type] || type;
};