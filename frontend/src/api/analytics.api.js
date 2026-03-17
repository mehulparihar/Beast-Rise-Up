import api from "./axios";

/**
 * Get /analytics
 */

export const analytics = async () => {
  const res = await api.get("/analytics");
  return res.data;
};

