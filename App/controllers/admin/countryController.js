const countryModel = require("../../model/countryModel");

const countryController = {
  create: async (req, res) => {
    let { name, order } = req.body;
    let insertObj = {
      name,
      
      order,
    };

    try {
      let checkSameCountry = await countryModel.findOne({ name: name });

      if (checkSameCountry) {
        res.status(409).json({
          status: 0,
          message: "Country Error",
          error: {
            name: "Country Name Already Exists...",
          },
        });
      } else {
        let countryResp = await countryModel.create(insertObj);
        let obj = {
          status: true,
          message: "Country Added",
          countryResp,
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
        message: "Country Error",
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

    let data = await countryModel.find(filterObj);

    let obj = {
      status: true,
      data,
      message: "Country View",
    };

    res.send(obj);
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await countryModel.deleteOne({ _id: id });

    let obj = {
      status: true,
      message: "Country Delete",
      delRes,
    };

    res.send(obj);
  },

  update: async (req, res) => {
    let { id } = req.params;
    let { name, order } = req.body;
    
    let updateObj = {
      name,
      order,
      
    };

    let updateRes = await countryModel.updateOne(
      { _id: id },
      {
        $set: updateObj,
      }
    );
    
    let obj = {
      status: true,
      message: "Country Update",
      updateRes,
    };

    res.send(obj);
  },
  multiDelete: async (req, res) => {
      let { ids } = req.body;
  
      let delRes = await countryModel.deleteMany({ _id: { $in: ids } });
      let obj = {
        status: true,
        message: "Country Delete",
        delRes,
      };
  
      res.send(obj);
    },
     changeStatus: async (req, res) => {
      let { ids } = req.body;
  
      for (let v of ids) {
        let oldStatusObj = await countryModel.findOne({ _id: v }).select("status");
  
        let { status } = oldStatusObj;
  
        await countryModel.updateOne(
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
        message: "Country Status Updated",
      };
      res.send(obj)
    },
     details:async (req,res)=>{
        let {id}=req.params
        let data = await countryModel.findOne({_id:id});
        let obj = {
          status: true,
          data,
          message: "Country View",
        };
    
        res.send(obj);
      }
};

module.exports = countryController;