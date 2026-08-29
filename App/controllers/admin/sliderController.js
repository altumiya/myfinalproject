const sliderModel = require("../../model/sliderModel");
const { createSlug } = require("../../config/helper");

let sliderController = {
  create: async (req, res) => {
    let { name, order } = req.body;
    let insertObj = {
      name,
      order,
    };
    if (req.file) {
      if (req.file.filename) {
        insertObj["image"] = req.file.filename;
      }
    }
    try {
      let checkSameslider = await sliderModel.findOne({ name });
      if (checkSameslider) {
        res.status(200).json({
          status: 0,
          message: "slider Error",
          error: {
            name: "slider Name Alredy Exist...",
          },
        });
        insertObj["slug"] = createSlug(insertObj.name)


      } else {
        let sliderRes = await sliderModel.create(insertObj);
        let obj = {
          status: true,
          message: "slider Added",
          sliderRes,
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
        message: "slider Error",
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
          const existingSlider = await sliderModel.findOne({
            name: updateObj.name,
            _id: { $ne: id },
          });
  
          if (existingSlider) {
            return res.status(409).json({
              status: false,
              message: "Slider Error",
              error: { name: "Slider Name Already Exists..." },
            });
          }
        }
  
        let updateRes = await sliderModel.updateOne(
          { _id: id },
          {
            $set: updateObj,
          }
        );
  
        return res.status(200).json({
          status: true,
          message: "Slider Updated Successfully",
          updateRes,
        });
      } catch (err) {
        console.error("Slider update error:", err);
  
        const error = {};
        for (const [key, value] of Object.entries(err.errors || {})) {
          error[key] = value.message;
        }
  
        return res.status(500).json({
          status: false,
          message: err.message || "Unable to update slider",
          error,
        });
      }
    },

      details: async (req, res) => {
        let { id } = req.params;
        let data = await sliderModel.findOne({ _id: id });
        let obj = {
          status: true,
          path: process.env.SLIDERSTATICPATH,
          data,
          message: "Slider Found",
        };
        res.send(obj);
      },

  view: async (req, res) => {
    const orCondition = [];
    if (req.query.name) {
      orCondition.push({ name: new RegExp(req.query.name, "i") })
    }
    let filter = {}
    if (orCondition.length >= 1) {
      filter.$or = orCondition
    }

    let data = await sliderModel.find(filter)
    let obj = {
      status: true,
      path: process.env.SLIDERSTATICPATH,
      data,
      message: "slider Found",
    };

    res.send(obj);
  },
  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await sliderModel.deleteOne({ _id: id });


    let obj = {
      status: true,
      message: "slider Delete",
      delRes,
    };

    res.send(obj);
  },
  multiDelete: async (req, res) => {
    let { ids } = req.body;

    let delRes = await sliderModel.deleteMany({ _id: { $in: ids } });
    let obj = {
      status: true,
      message: "slider Delete",
      delRes,
    };

    res.send(obj);
  },
  changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await sliderModel.findOne({ _id: v }).select("status");

      let { status } = oldStatusObj;

      await sliderModel.updateOne(
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

    let obj = {
      status: true,
      message: "slider Status Updated",
    };
    res.send(obj)
  },
};

module.exports = sliderController;