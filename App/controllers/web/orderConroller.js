const jwt = require("jsonwebtoken");
const orderModels = require("../../model/orderModel");
const cartModel = require("../../model/cartModel");
const crypto = require("crypto");

const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_TRbHzv8ucjrMyi",
  key_secret: "d4t6RidkbcXszN0c9qmU2xCp",
});

let orderController = {
 save: async (req, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send({ status: 0, message: "Please login first" });
      }

      let token = req.headers.authorization.split(" ")[1];
      let { id } = jwt.verify(token, process.env.TOKENKEY);
      let orderObj = { ...req.body };

      if (orderObj.paymentMethod == "cod") {
        orderObj["status"] = "processing";
        orderObj["userId"] = id; 

        let orderRes = await orderModels.create(orderObj);
        
        // Delete All in Cart
        await cartModel.deleteMany({ userID: id });

        res.send({
          status: 1,
          msg: "Order Placed ",
          orderRes,
        });
      } else {
        // Online Payment
        orderObj["status"] = "pending";
        orderObj["paymentStatus"] = "pending";
        orderObj["userId"] = id; // Attach user ID for online as well

        let orderRes = await orderModels.create(orderObj);

        const options = {
          amount: orderObj.totalAmount * 100, // Amount in paise
          currency: "INR",
          receipt: `receipt_order_${Date.now()}`,
        };
        let razorPayRes = await instance.orders.create(options);

        await orderModels.updateOne(
          { _id: orderRes._id },
          {
            $set: {
              razorpayOrderId: razorPayRes.id,
            },
          }
        );

        res.send({
          status: 1,
          razorPayRes,
        });
      }
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error.message);
      res.status(500).send({
        status: 0,
        message: "Unable to place order",
      });
    }
  },
  orderVerfiy: async (req, res) => {
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (!req.headers.authorization) {
      return res.status(401).send({ status: 0, message: "Please login first" });
    }

    let token = req.headers.authorization.split(" ")[1];
    let { id } = jwt.verify(token, process.env.TOKENKEY);
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", "d4t6RidkbcXszN0c9qmU2xCp")
      .update(text)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      await orderModels.updateOne(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          $set: {
            status: "processing",
            paymentStatus: "success",
            razorpayPaymentId: razorpay_payment_id,
            userId: id,
          },
        },
      );
      //Cart Data Delete
      await cartModel.deleteMany({ userID: id });

      res.send({ status: 1, message: "Payment verified successfully" });
    } else {
       res.send({ status: 0, message: "Invalid payment signature" });
    }
  },
  // Add this inside let orderController = { ... }

  viewOrders: async (req, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send({ status: 0, message: "Please login first" });
      }

      let token = req.headers.authorization.split(" ")[1];
      let { id } = jwt.verify(token, process.env.TOKENKEY);

      // Fetch orders for this user and sort by newest first
      let orders = await orderModels.find({ userId: id }).sort({ createdAt: -1 });

      res.send({
        status: 1,
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).send({
        status: 0,
        message: "Unable to fetch orders",
      });
    }
  },
};

module.exports = { orderController };
