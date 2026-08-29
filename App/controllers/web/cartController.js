const cartModel = require("../../model/cartModel");
const jwt= require("jsonwebtoken")

let cartController = {
  addToCart: async (req, res) => {
    try {
      let cartObj = { ...req.body };

      // 1. Check if the header exists
      if (!req.headers.authorization) {
        return res.status(401).send({ status: 0, message: "No token provided" });
      }

      let token = req.headers.authorization.split(" ")[1];

      // 2. Prevent the string "null" from reaching jwt.verify
      if (!token || token === "null" || token === "undefined") {
        return res.status(401).send({ status: 0, message: "Please Login First" });
      }

      // 3. Verify the token safely
      let { id } = jwt.verify(token, process.env.TOKENKEY);
      cartObj['userID'] = id;

      // 4. Save to database using Mongoose .create()
      let cartRes = await cartModel.create(cartObj);
      
      res.send({
        status: 1,
        message: "Data Added in Cart"
      });

    } catch (error) {
      console.log("Cart Error:", error.message);
      res.status(500).send({
        status: 0,
        message: "Failed to add to cart. Token might be invalid.",
        error: error.message
      });
    }
  },

  viewCart: async (req, res) => {
    try {
      // 1. Check if the header exists
      if (!req.headers.authorization) {
        return res.send({ status: 0, message: "No token", data: [] });
      }

      let token = req.headers.authorization.split(" ")[1];

      // 2. Prevent the string "null" from reaching jwt.verify
      if (!token || token === "null" || token === "undefined") {
        return res.send({ status: 0, message: "User not logged in", data: [] });
      }

      // 3. Verify safely
      let { id } = jwt.verify(token, process.env.TOKENKEY);

      let data = await cartModel.find({ userID: id });
      res.send({
        status: 1,
        data,
      });

    } catch (error) {
      console.log("View Cart Error:", error.message);
      // We send back an empty array so the frontend doesn't crash if the token is bad
      res.send({ status: 0, message: "Invalid token", data: [] }); 
    }
  },

  deleteCart: async (req, res) => {
    try {
      let { cartId } = req.params;
      let data = await cartModel.deleteOne({ _id: cartId });
      res.send({
        status: 1,
        data,
      });
    } catch (error) {
      res.status(500).send({ status: 0, error: error.message });
    }
  },

  updateQty: async (req, res) => {
    try {
      let { cartId } = req.params;
      let { qty } = req.body;
      
      await cartModel.updateOne({ _id: cartId }, { $set: { qty: qty } });
      
      res.send({ status: 1, message: "Quantity updated successfully" });
    } catch (error) {
      res.status(500).send({ status: 0, error: error.message });
    }
  }
};

module.exports = cartController;