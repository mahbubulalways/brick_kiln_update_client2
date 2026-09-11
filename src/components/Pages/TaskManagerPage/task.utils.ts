export const getDateRange = (
    type: "today" | "week" | "month" | "all"
) => {
    const now = new Date();

    // Today start — UTC
    const start = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0,
            0,
            0,
            0
        )
    );

    // Today end — UTC
    const todayEnd = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            23,
            59,
            59,
            999
        )
    );

    // =========================
    // Today
    // =========================
    if (type === "today") {
        return `${new Date().toISOString()}`;
    }

    // =========================
    // Today + 6 days
    // =========================
    if (type === "week") {
        const end = new Date(start);

        end.setUTCDate(end.getUTCDate() + 6);
        end.setUTCHours(23, 59, 59, 999);

        return `${start.toISOString()}_${end.toISOString()}`;
    }

    // =========================
    // Today + 30 days
    // =========================
    if (type === "month") {
        const end = new Date(start);

        end.setUTCDate(end.getUTCDate() + 30);
        end.setUTCHours(23, 59, 59, 999);

        return `${start.toISOString()}_${end.toISOString()}`;
    }

    // =========================
    // All
    // =========================
    return "";
};