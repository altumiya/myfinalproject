const { createSlug } = require("../../config/helper");
const categoryModel = require("../../model/categoryModel");
const colorModel = require("../../model/colorModel");
const materialModel = require("../../model/materialModel");
const subcategoryModel = require("../../model/subcategoryModel");
const subsubcategoryModel = require("../../model/subsubcategoryModel");
const productModel = require("../../model/productModel");

let productController = {
  create: async (req, res) => {
    const insertObj = { ...req.body };

    if (req.files?.image?.[0]) {
      insertObj.image = req.files.image[0].filename;
    }

    if (req.files?.backImage?.[0]) {
      insertObj.backImage = req.files.backImage[0].filename;
    }

    if (req.files?.gallery) {
      insertObj.gallery = req.files.gallery.map((file) => file.filename);
    }

    insertObj["slug"] = createSlug(insertObj.name)

    try {
      const existingProduct = await productModel.findOne({ name: insertObj.name });

      if (existingProduct) {
        return res.status(409).json({
          status: false,
          message: "Product name already exists",
          error: { name: "Product name already exists." },
        });
      }

      const product = await productModel.create(insertObj);

      return res.status(201).json({
        status: true,
        message: "Product added",
        data: product,
      });
    } catch (err) {
      console.error("Product create error:", err);

      const error = {};
      for (const [key, value] of Object.entries(err.errors || {})) {
        error[key] = value.message;
      }

      return res.status(500).json({
        status: false,
        message: err.message || "Unable to add product",
        error,
      });
    }
  },

  // --- NEW UPDATE LOGIC ADDED HERE ---
  update: async (req, res) => {
    let { id } = req.params;
    let updateObj = { ...req.body };

    // If new images were uploaded, update them. Otherwise, mongoose will just keep the old ones in the DB.
    if (req.files?.image?.[0]) {
      updateObj.image = req.files.image[0].filename;
    }
    if (req.files?.backImage?.[0]) {
      updateObj.backImage = req.files.backImage[0].filename;
    }
    if (req.files?.gallery) {
      updateObj.gallery = req.files.gallery.map((file) => file.filename);
    }
    


    try {
      // Check if the updated name already exists for ANOTHER product
      if (updateObj.name) {
        const existingProduct = await productModel.findOne({
          name: updateObj.name,
          _id: { $ne: id } // Exclude the current product we are editing
        });

        if (existingProduct) {
          return res.status(409).json({
            status: false,
            message: "Product name already exists",
            error: { name: "Product name already exists." },
          });
        }
      }

      // Perform the update
      let updateRes = await productModel.updateOne(
        { _id: id },
        {
          $set: updateObj,
        }
      );

      return res.status(200).json({
        status: true,
        message: "Product Updated Successfully",
        updateRes,
      });
    } catch (err) {
      console.error("Product update error:", err);

      const error = {};
      for (const [key, value] of Object.entries(err.errors || {})) {
        error[key] = value.message;
      }

      return res.status(500).json({
        status: false,
        message: err.message || "Unable to update product",
        error,
      });
    }
  },
  // -----------------------------------

  view: async (req, res) => {
    const orCondition = [];
    if (req.query.name) {
      orCondition.push({ name: new RegExp(req.query.name, "i") });
    }
    let filter = {};
    if (orCondition.length >= 1) {
      filter.$or = orCondition;
    }

    let data = await productModel
      .find(filter)
      .populate("parent", "name")
      .populate("subCategory", "name")
      .populate("subsubCategory", "name")
      .populate("color", "name")
      .populate("material", "name");
    let obj = {
      status: true,
      path: process.env.PRODUCTSTATICPATH,
      data,
      message: "Product Found",
    };

    res.send(obj);
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await productModel.deleteOne({ _id: id });

    let obj = {
      status: true,
      message: "product Delete",
      delRes,
    };

    res.send(obj);
  },

  multiDelete: async (req, res) => {
    let { ids } = req.body;

    let delRes = await productModel.deleteMany({ _id: { $in: ids } });
    let obj = {
      status: true,
      message: "product Delete",
      delRes,
    };

    res.send(obj);
  },

  changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await productModel.findOne({ _id: v }).select("status");

      let { status } = oldStatusObj;

      await productModel.updateOne(
        {
          _id: v,
        },
        {
          $set: {
            status: !status,
          },
        }
      );
    }

    let obj = {
      status: true,
      message: "product Status Updated",
    };
    res.send(obj);
  },

details: async (req, res) => {
    let { id } = req.params;
    
    const isValidObjectId = id.match(/^[0-9a-fA-F]{24}$/);

    let query = isValidObjectId ? { _id: id } : { slug: id };

    try {
      let data = await productModel
        .findOne(query)
        .populate("parent", "name")
        .populate("subCategory", "name")
        .populate("subsubCategory", "name")
        .populate("color", "name")
        .populate("material", "name");

      if (!data) {
        return res.status(404).send({ status: false, message: "Product Not Found" });
      }

      let obj = {
        status: true,
        path: process.env.PRODUCTSTATICPATH,
        data,
        message: "Product Found",
      };
      res.send(obj);
    } catch (error) {
      res.status(500).send({ status: false, message: "Server Error", error: error.message });
    }
  },
  parent: async (req, res) => {
    let data = await categoryModel.find({ status: true }).select("name");
    let obj = {
      status: true,
      data,
      message: "product Category Data Found",
    };
    res.send(obj);
  },

  subCategory: async (req, res) => {
    let { parentId } = req.params;
    let data = await subcategoryModel.find({ parent: parentId, status: true }).select("name");
    let obj = {
      status: true,
      data,
      message: "product SubCategory Data Found",
    };
    res.send(obj);
  },

  subsubCategory: async (req, res) => {
    let { parentId } = req.params;
    let data = await subsubcategoryModel.find({ subcategory: parentId, status: true }).select("name");
    let obj = {
      status: true,
      data,
      message: "product SubSubCategory Data Found",
    };
    res.send(obj);
  },

  color: async (req, res) => {
    let data = await colorModel.find({ status: true }).select("name");
    let obj = {
      status: true,
      data,
      message: "product Color Data Found",
    };
    res.send(obj);
  },

  material: async (req, res) => {
    let data = await materialModel.find({ status: true }).select("name");
    let obj = {
      status: true,
      data,
      message: "product Material Data Found",
    };
    res.send(obj);
  },
};

module.exports = productController;