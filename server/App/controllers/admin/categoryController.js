const categoryModel = require("../../model/categoryModel");

const { createSlug } = require("../../config/helper");

let categoryController = {
  create: async (req, res) => {
    let { name, order } = req.body;

    let insertObj = {
      name,

      order,
    };

    if (req.file && req.file.filename) {
      insertObj["image"] = req.file.filename;
    }

    try {
      insertObj["slug"] = createSlug(insertObj.name);

      let checkSameCategory = await categoryModel.findOne({ name });

      if (checkSameCategory) {
        return res.status(409).json({
          status: false,

          message: "Category Error",

          error: {
            name: "Category Name Already Exists...",
          },
        });
      }

      let categoryRes = await categoryModel.create(insertObj);

      let obj = {
        status: true,

        message: "Category Added",

        categoryRes,
      };

      return res.status(201).json(obj);
    } catch (err) {
      console.error("Category create error:", err);

      let error = {};

      for (let key in err.errors || {}) {
        error[key] = err.errors[key].message;
      }

      return res.status(500).json({
        status: false,

        message: err.message || "Unable to add category",

        error,
      });
    }
  },

  update: async (req, res) => {
    let { id } = req.params;

    let updateObj = { ...req.body };

    if (req.file && req.file.filename) {
      updateObj.image = req.file.filename;
    }

    try {
      if (updateObj.name) {
        const existingCategory = await categoryModel.findOne({
          name: updateObj.name,

          _id: { $ne: id },
        });

        if (existingCategory) {
          return res.status(409).json({
            status: false,

            message: "Category Error",

            error: { name: "Category Name Already Exists..." },
          });
        }
      }

      let updateRes = await categoryModel.updateOne(
        { _id: id },

        {
          $set: updateObj,
        },
      );

      return res.status(200).json({
        status: true,

        message: "Category Updated Successfully",

        updateRes,
      });
    } catch (err) {
      console.error("Category update error:", err);

      const error = {};

      for (const [key, value] of Object.entries(err.errors || {})) {
        error[key] = value.message;
      }

      return res.status(500).json({
        status: false,

        message: err.message || "Unable to update category",

        error,
      });
    }
  },

  view: async (req, res) => {
    const orCondition = [];

    if (req.query.name) {
      orCondition.push({ name: new RegExp(req.query.name, "i") });
    }

    let filter = {};

    if (orCondition.length >= 1) {
      filter.$or = orCondition;
    }

    let data = await categoryModel.find(filter);

    let obj = {
      status: true,

      path: process.env.CATEGORYSTATICPATH,

      data,

      message: "Category Found",
    };

    res.send(obj);
  },

  details: async (req, res) => {
    let { id } = req.params;

    let data = await categoryModel.findOne({ _id: id });

    let obj = {
      status: true,

      path: process.env.CATEGORYSTATICPATH,

      data,

      message: "Category Found",
    };

    res.send(obj);
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await categoryModel.deleteOne({ _id: id });

    let obj = {
      status: true,

      message: "Category Delete",

      delRes,
    };

    res.send(obj);
  },

  multiDelete: async (req, res) => {
    let { ids } = req.body;

    let delRes = await categoryModel.deleteMany({ _id: { $in: ids } });

    let obj = {
      status: true,

      message: "Category Delete",

      delRes,
    };

    res.send(obj);
  },

  changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await categoryModel
        .findOne({ _id: v })
        .select("status");

      if (oldStatusObj) {
        let { status } = oldStatusObj;

        await categoryModel.updateOne(
          {
            _id: v,
          },

          {
            $set: {
              status: !status,
            },
          },
        );
      }
    }

    let obj = {
      status: true,

      message: "Category Status Updated",
    };

    res.send(obj);
  },
};

module.exports = categoryController;
