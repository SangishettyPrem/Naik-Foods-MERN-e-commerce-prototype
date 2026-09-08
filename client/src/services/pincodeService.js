import api from "./api";

export const pincodeService = {
  checkPincode: async (pincode) => {
    return await api.post("/pincode/check", { pincode });
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    return await api.post("/orders", orderData);
  },
  getOrderByNumber: async (orderNumber) => {
    return await api.get(`/orders/${orderNumber}`);
  },
};
