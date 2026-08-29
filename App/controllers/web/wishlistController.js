const wishlistModel = require("../../model/wishlistModel");
const jwt = require("jsonwebtoken");

let wishlistController = {
  toggleWishlist: async (req, res) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send({ status: 0, message: "No token provided" });
      }

      let token = req.headers.authorization.split(" ")[1];
      if (!token || token === "null" || token === "undefined") {
        return res.status(401).send({ status: 0, message: "Please Login First" });
      }

      let { id } = jwt.verify(token, process.env.TOKENKEY);
      let { productId } = req.body;

      let existingItem = await wishlistModel.findOne({ userID: id, productId: productId });

      if (existingItem) {
        await wishlistModel.deleteOne({ _id: existingItem._id });
        return res.send({ status: 1, message: "Product Removed from wishlist", action: "removed" });
      } else {
        let wishlistObj = { ...req.body, userID: id };
        await wishlistModel.create(wishlistObj);
        return res.send({ status: 1, message: "Product Added to wishlist", action: "added" });
      }
    } catch (error) {
      res.status(500).send({ status: 0, message: "Something went wrong", error: error.message });
    }
  },

  viewWishlist: async (req, res) => {
    try {
      let token = req.headers.authorization.split(" ")[1];
      let { id } = jwt.verify(token, process.env.TOKENKEY);

      let data = await wishlistModel.find({ userID: id });
      res.send({ status: 1, data });
    } catch (error) {
      res.status(500).send({ status: 0, error: error.message });
    }
  }
};

module.exports = wishlistController;