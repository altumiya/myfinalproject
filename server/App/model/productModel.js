let mongoose = require("mongoose");
let productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Fill Product Name"],
    minLength: [2, "Product Name Must Be Atleast 2 Character"],
    maxLength: [100, "Product Name Must Be Atmost 100 Character"],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
  },
  subsubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subsubcategory",
  },
  color: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "color",
    },
  ],
  material: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "material",
    },
  ],
  productType: {
    type: String,
    enum: ["Featured", "New Arrivals", "On Sale"],
  },
  bestSelling: {
    type: Boolean,
    default: true,
  },
   topRated: {
    type: Boolean,
    default: true,
  },
  upSell: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, "Please Fill Product Price"],
  },
  salePrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, "Please Fill Product Stock"],
  },
  image: String,
  backImage: String,
  gallery: [],
  description: String,
  slug:String,
  status: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    required: [true, "Please Fill Product Order"],
  },
});

let productModel = mongoose.model("product", productSchema)
module.exports = productModel