const colorModel = require("../../model/colorModel");

let colorController = {
  create: async (req, res) => {
    console.log(req.body);
    let { name, code, order } = req.body;
    let insertObj = {
      name,
      code,
      order,
    };
    
    try {
      let checkSameColor = await colorModel.findOne({ name });
      
      if (checkSameColor) {
        res.status(409).json({
          status: 0,
          message: "Color Error",
          error: {
            name: "Color Name Alredy Exist...",
          },
        });
      
      } else {
        let colorRes = await colorModel.create(insertObj);
        let obj = {
          status: true,
          message: "Color Added",
          colorRes,
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
        message: "Color Error",
        error,
      });
    }
  },



  view: async(req, res) => {
    let orCondition = [];
    if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, "i");
            orCondition.push(
                { name: searchRegex },
                { code: searchRegex }
            );
        }
    if (req.query.name) {
      orCondition.push({ name: new RegExp(req.query.name, "i") });
    }
    if (req.query.code) {
      orCondition.push({ code: new RegExp(req.query.code, "i") });
    }
    let filterObj = {};
    if (orCondition.length > 0) {
      filterObj = { $or: orCondition };
    }
      
     let data=await colorModel.find(filterObj)

    let obj = {
      status: true,
      data,
      message: "Color View",
    };

    res.send(obj);
  } ,


  delete: async(req, res) => {
     let { id } = req.params;

    let delRes = await colorModel.deleteOne({ _id: id });


    let obj = {
      status: true,
      message: "Color Delete",
      delRes,
    };

    res.send(obj);
  },

  update: async(req, res) => {
     let { id } = req.params;
    let { name, code, order } = req.body;
    let updateObj = {
      name,
      code,
      order,
    };
  
    let updateRes = await colorModel.updateOne(
      { _id: id },
      {
        $set: updateObj,
      },
    );
    let obj = {
      status: true,
      message: "Color Update",
      updateRes,
    };

    res.send(obj);
  },

  multiDelete: async (req, res) => {
    let { ids } = req.body;

    let delRes = await colorModel.deleteMany({ _id: { $in: ids } });
    let obj = {
      status: true,
      message: "Color Delete",
      delRes,
    };

    res.send(obj);
  },
   changeStatus: async (req, res) => {
    let { ids } = req.body;

    for (let v of ids) {
      let oldStatusObj = await colorModel.findOne({ _id: v }).select("status");

      let { status } = oldStatusObj;

      await colorModel.updateOne(
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
      message: "Color Status Updated",
    };
    res.send(obj)
  },
  details:async (req,res)=>{
    let {id}=req.params
    let data = await colorModel.findOne({_id:id});
    let obj = {
      status: true,
      data,
      message: "Color View",
    };

    res.send(obj);
  }
};


module.exports = colorController;
