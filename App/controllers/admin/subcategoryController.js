const subcategoryModel = require("../../model/subcategoryModel");
const categoryModel = require("../../model/categoryModel");
const { createSlug } = require("../../config/helper");

let subcategoryController = {
  create: async (req, res) => {
    let { name, order, parent } = req.body;
    let insertObj = {
      name,
      order,
      parent,
    };

    if (req.file) {
      if (req.file.filename) {
        insertObj["image"] = req.file.filename;
      }
    }

    try {
      insertObj["slug"] = createSlug(insertObj.name)

      let checkSamesubCategory = await subcategoryModel.findOne({ name });
      if (checkSamesubCategory) {
        res.status(200).json({
          status: 0,
          message: "subcategory Error",
          error: {
            name: "subcategory Name Already Exists...",
          },
        });
      } else {
        let subcategoryRes = await subcategoryModel.create(insertObj);

        let obj = {
          status: true,
          message: "subcategory Added",
          subcategoryRes,
        };
        res.status(200).json(obj);
      }
    } catch (err) {
      let error = {};
      for (let key in err.errors) {
        error[key] = err.errors[key].message;
      }

      res.send({
        status: 0,
        message: "subcategory Error",
        error,
      });
    }
  },

  view: async (req, res) => {
    try {
      const orCondition = [];
      if (req.query.name) {
        orCondition.push({ name: new RegExp(req.query.name, "i") });
      }

      let filter = {};
      if (orCondition.length >= 1) {
        filter.$or = orCondition;
      }

      let data = await subcategoryModel.find(filter).populate("parent", "name");
      let obj = {
        status: true,
        path: process.env.SUBCATEGORYSTATICPATH,
        data,
        message: "subCategory Found",
      };

      res.send(obj);
    } catch (err) {
      res.send({ status: false, message: err.message });
    }
  },

  details: async (req, res) => {
    try {
      let { id } = req.params;
      let data = await subcategoryModel.findById(id).populate("parent", "name");

      let obj = {
        status: true,
        data,
        message: "subcategory Details Found",
      };
      res.send(obj);
    } catch (err) {
      res.send({ status: false, message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      let { id } = req.params;
      let { name, order, parent } = req.body;

      let updateObj = {
        name,
        order,
        parent,
      };

      if (req.file) {
        if (req.file.filename) {
          updateObj["image"] = req.file.filename;
        }
      }

      let updateRes = await subcategoryModel.updateOne({ _id: id }, { $set: updateObj });

      let obj = {
        status: true,
        message: "subcategory Updated",
        updateRes,
      };
      res.send(obj);
    } catch (err) {
      res.send({ status: false, message: err.message });
    }
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await subcategoryModel.deleteOne({ _id: id });

    let obj = {
      status: true,
      message: "subcategory Delete",
      delRes,
    };

    res.send(obj);
  },

  multiDelete: async (req, res) => {
    let { ids } = req.body;

    let delRes = await subcategoryModel.deleteMany({ _id: { $in: ids } });
    let obj = {
      status: true,
      message: "subcategory Delete",
      delRes,
    };

    res.send(obj);
  },

  changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await subcategoryModel.findOne({ _id: v }).select("status");

      if (oldStatusObj) {
        let { status } = oldStatusObj;

        await subcategoryModel.updateOne(
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
    }

    let obj = {
      status: true,
      message: "subcategory Status Updated",
    };
    res.send(obj);
  },

  parent: async (req, res) => {
    try {
      let data = await categoryModel
        .find({ status: true })
        .select("name");

      let obj = {
        status: true,
        data,
        message: "Parent Category Found",
      };
      res.send(obj);
    } catch (err) {
      res.status(500).json({ status: false, message: "Server Error", error: err.message });
    }
  },
};

module.exports = subcategoryController;