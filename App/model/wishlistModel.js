const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    productId: {
      type: String, // Keeping as String to match your cart logic
      required: true
    },
    productName: String,
    productPrice: Number,
    productImage: String,
    productCategory: String
  },
  
);

let wishlistModel = mongoose.model("wishlist", wishlistSchema);
module.exports= wishlistModel