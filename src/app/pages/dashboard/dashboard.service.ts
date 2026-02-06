// Dashboard API Service
export const dashboardService = {
    getStats: async () => {
        // TODO: Implement API call
        return {
            totalInward: 245,
            totalOutward: 180,
            pendingItems: 32,
            activeUsers: 12,
        };
    },
};
