const orderModels = require("../../model/orderModel"); // Ensure this path matches your structure

let adminorderController = {
  viewOrders: async (req, res) => {
    try {
      let orders = await orderModels
        .find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      res.send({
        status: 1,
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).send({ status: 0, message: "Unable to fetch orders" });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { orderId, status } = req.body;

      let updatedOrder = await orderModels.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: status } },
        { returnDocument: "after" }, // Fixes the Mongoose warning
      );

      res.send({
        status: 1,
        message: "Status updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating status:", error.message);
      res.status(500).send({ status: 0, message: "Unable to update status" });
    }
  },

  multiDelete: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
        return res.send({ status: 0, message: "No orders selected" });
      }

      await orderModels.deleteMany({ _id: { $in: ids } });

      res.send({
        status: 1,
        message: "Orders deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting orders:", error.message);
      res.status(500).send({ status: 0, message: "Unable to delete orders" });
    }
  },
};

module.exports = { adminorderController };
