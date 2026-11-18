const categoryModel = require("../../model/categoryModel");
const subcategoryModel = require("../../model/subcategoryModel");
const subsubcategoryModel = require("../../model/subsubcategoryModel");
const { createSlug } = require("../../config/helper");

const subsubcategoryController = {
  create: async (req, res) => {
    const insertObj = { ...req.body };

    if (req.file) {
      insertObj.image = req.file.filename;
    }

    try {
      insertObj["slug"] = createSlug(insertObj.name)

      const existingSubSubCategory = await subsubcategoryModel.findOne({ name: insertObj.name });

      if (existingSubSubCategory) {
        return res.status(409).json({
          status: false,
          message: "Sub-subcategory name already exists",
          error: { name: "Sub-subcategory name already exists." },
        });
      }

      const subsubcategory = await subsubcategoryModel.create(insertObj);

      return res.status(201).json({
        status: true,
        message: "Sub-subcategory created successfully",
        data: subsubcategory,
      });
    } catch (err) {
      console.error("Sub-subcategory create error:", err);

      const error = {};
      for (const [key, value] of Object.entries(err.errors || {})) {
        error[key] = value.message;
      }

      return res.status(500).json({
        status: false,
        message: err.message || "Failed to create sub-subcategory",
        error,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;
    let updateObj = { ...req.body };

    if (req.file) {
      updateObj.image = req.file.filename;
    }

    try {
      // Check if the updated name already exists for ANOTHER sub-subcategory
      if (updateObj.name) {
        const existingSubSubCategory = await subsubcategoryModel.findOne({
          name: updateObj.name,
          _id: { $ne: id }, // Exclude current item
        });

        if (existingSubSubCategory) {
          return res.status(409).json({
            status: false,
            message: "Sub-subcategory name already exists",
            error: { name: "Sub-subcategory name already exists." },
          });
        }
      }

      // Perform the update
      let updateRes = await subsubcategoryModel.updateOne(
        { _id: id },
        {
          $set: updateObj,
        }
      );

      return res.status(200).json({
        status: true,
        message: "Sub-subcategory Updated Successfully",
        updateRes,
      });
    } catch (err) {
      console.error("Sub-subcategory update error:", err);

      const error = {};
      for (const [key, value] of Object.entries(err.errors || {})) {
        error[key] = value.message;
      }

      return res.status(500).json({
        status: false,
        message: err.message || "Unable to update sub-subcategory",
        error,
      });
    }
  },

  view: async (req, res) => {
    try {
      const filter = {};

      if (req.query.name) {
        filter.name = new RegExp(req.query.name, "i");
      }

      const data = await subsubcategoryModel
        .find(filter)
        .populate("parent", "name")
        .populate("subcategory", "name");

      return res.status(200).json({
        status: true,
        path: process.env.SUBSUBCATEGORYSTATICPATH,
        data,
        message: "Sub-subcategories found",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch sub-subcategories",
        error: err.message,
      });
    }
  },

  details: async (req, res) => {
    try {
      let { id } = req.params;
      let data = await subsubcategoryModel
        .findOne({ _id: id })
        .populate("parent", "name")
        .populate("subcategory", "name");

      return res.status(200).json({
        status: true,
        path: process.env.SUBSUBCATEGORYSTATICPATH,
        data,
        message: "Sub-subcategory Found",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch sub-subcategory details",
        error: err.message,
      });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;
    let delRes = await subsubcategoryModel.deleteOne({ _id: id });

    return res.status(200).json({
      status: true,
      message: "Sub-subcategory Deleted",
      delRes,
    });
  },

  multiDelete: async (req, res) => {
    let { ids } = req.body;
    let delRes = await subsubcategoryModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      status: true,
      message: "Sub-subcategories Deleted",
      delRes,
    });
  },

  changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await subsubcategoryModel.findOne({ _id: v }).select("status");
      if (oldStatusObj) {
        await subsubcategoryModel.updateOne(
          { _id: v },
          { $set: { status: !oldStatusObj.status } }
        );
      }
    }

    return res.status(200).json({
      status: true,
      message: "Sub-subcategory Status Updated",
    });
  },

  parent: async (req, res) => {
    try {
      let data = await categoryModel.find({ status: true }).select("name");
      return res.status(200).json({
        status: true,
        message: "Category found",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Category error",
        error: err.message,
      });
    }
  },

  subcategory: async (req, res) => {
    try {
      const parentId = req.params.parentID || req.params.parentId;

      if (!parentId) {
        return res.status(400).json({ status: false, message: "Parent ID is required" });
      }

      const data = await subcategoryModel
        .find({ parent: parentId }) // Removed strict status filter in edit mode to ensure saved item shows up
        .select("name");

      return res.status(200).json({
        status: true,
        message: "SubCategory found",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Error fetching subcategories",
        error: err.message,
      });
    }
  },
};

module.exports = subsubcategoryController;