const materialModel = require("../../model/materialModel");

let materialController = {
  create: async (req, res) => {
    let { name, order } = req.body;
    let insertObj = {
       name:name,
      order:Number(order),
    };

    try {
      let checkSameMaterial = await materialModel.findOne({ name: name });

      if (checkSameMaterial) {
        res.status(409).json({
          status: 0,
          message: "Material Error",
          error: {
            name: "Material Name Already Exists...",
          },
        });
      } else {
        let materialResp = await materialModel.create(insertObj);
        let obj = {
          status: true,
          message: "Material Added",
          materialResp,
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
        message: "Material Error",
        error,
      });
    }
  },

  view: async (req, res) => {
    let orCondition = [];
        if (req.query.search) {
                const searchRegex = new RegExp(req.query.search, "i");
                orCondition.push(
                    { name: searchRegex }
                  
                );
            }
        if (req.query.name) {
          orCondition.push({ name: new RegExp(req.query.name, "i") });
        }
        
        let filterObj = {};
        if (orCondition.length > 0) {
          filterObj = { $or: orCondition };
        }
          
    let data = await materialModel.find(filterObj);

    let obj = {
      status: true,
      data,
      message: "Material View",
    };

    res.send(obj);
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await materialModel.deleteOne({ _id: id });

    let obj = {
      status: true,
      message: "Material Delete",
      delRes,
    };

    res.send(obj);
  },

  update: async (req, res) => {
    let { id } = req.params;
    let { name, order } = req.body;
    
    let updateObj = {
      name: name,
      order: Number(order),
    };

    let updateRes = await materialModel.updateOne(
      { _id: id },
      {
        $set: updateObj,
      }
    );
    
    let obj = {
      status: true,
      message: "Material Update",
      updateRes,
    };

    res.send(obj);
  },
  multiDelete: async (req, res) => {
      let { ids } = req.body;
  
      let delRes = await materialModel.deleteMany({ _id: { $in: ids } });
      let obj = {
        status: true,
        message: "Material Delete",
        delRes,
      };
  
      res.send(obj);
    },
     changeStatus: async (req, res) => {
      let { ids } = req.body;
  
      for (let v of ids) {
        let oldStatusObj = await materialModel.findOne({ _id: v }).select("status");
  
        let { status } = oldStatusObj;
  
        await materialModel.updateOne(
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
        message: "Material Status Updated",
      };
      res.send(obj)
    },
     details:async (req,res)=>{
    let {id}=req.params
    let data = await materialModel.findOne({_id:id});
    let obj = {
      status: true,
      data,
      message: "Material View",
    };

    res.send(obj);
  }
};

module.exports = materialController;