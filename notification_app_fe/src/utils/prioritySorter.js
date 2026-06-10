// notification_app_fe/src/utils/prioritySorter.js

const TYPE_WEIGHTS = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

/**
 * Ranks notifications based on categorical weight and time freshness metrics.
 * @param {Array} notifications - Array of raw notification objects
 * @param {number} limit - Max items to slice
 */
export function processPriorityInbox(notifications, limit = 10) {
  if (!notifications || !Array.isArray(notifications)) return [];

  return [...notifications]
    .sort((a, b) => {
      const weightA = TYPE_WEIGHTS[a.Type] || 0;
      const weightB = TYPE_WEIGHTS[b.Type] || 0;

      // 1. Sort by Priority Weight (Highest first)
      if (weightB !== weightA) {
        return weightB - weightA;
      }

      // 2. Tie-breaker: Sort by Recency (Newest timestamp first)
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, limit);
}