const faqModel = require("../../model/faqModel");

const faqController = {
  create: async (req, res) => {
    let { question, answer, order} = req.body;
    let insertObj = {
      question: question,
      answer: answer,
      order: Number(order),
    };

    try {
      let checkSameFaq = await faqModel.findOne({ question: question });

      if (checkSameFaq) {
        res.status(409).json({
          status: 0,
          message: "FAQ Error",
          error: {
            question: "FAQ Question Already Exists...",
          },
        });
      } else {
        let faqResp = await faqModel.create(insertObj);
        let obj = {
          status: true,
          message: "FAQ Added",
          faqResp,
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
        message: "FAQ Error",
        error,
      });
    }
  },

  view: async (req, res) => {
    let orCondition = [];
    if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, "i");
            orCondition.push(
                { question: searchRegex },
                { answer: searchRegex }
            );
        }
    if (req.query.question) {
      orCondition.push({ question: new RegExp(req.query.question, "i") });
    }
    if (req.query.answer) {
      orCondition.push({ answer: new RegExp(req.query.answer, "i") });
    }
    let filterObj = {};
    if (orCondition.length > 0) {
      filterObj = { $or: orCondition };
    }

    let data = await faqModel.find(filterObj);

    let obj = {
      status: true,
      data,
      message: "FAQ View",
    };

    res.send(obj);
  },

  delete: async (req, res) => {
    let { id } = req.params;

    let delRes = await faqModel.deleteOne({ _id: id });

    let obj = {
      status: true,
      message: "FAQ Delete",
      delRes,
    };

    res.send(obj);
  },

  update: async (req, res) => {
    let { id } = req.params;
    let { question, answer,  order } = req.body;
    
    let updateObj = {
      question: question,
      answer: answer,
      order: Number(order)
    };

    let updateRes = await faqModel.updateOne(
      { _id: id },
      {
        $set: updateObj,
      }
    );
    
    let obj = {
      status: true,
      message: "FAQ Update",
      updateRes,
    };

    res.send(obj);
  },
   multiDelete: async (req, res) => {
      let { ids } = req.body;
  
      let delRes = await faqModel.deleteMany({ _id: { $in: ids } });
      let obj = {
        status: true,
        message: "FAQ Delete",
        delRes,
      };
  
      res.send(obj);
    },
     changeStatus: async (req, res) => {
      let { ids } = req.body;
  
      for (let v of ids) {
        let oldStatusObj = await faqModel.findOne({ _id: v }).select("status");
  
        let { status } = oldStatusObj;
  
        await faqModel.updateOne(
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
        message: "FAQ Status Updated",
      };
      res.send(obj)
    },
     details:async (req,res)=>{
    let {id}=req.params
    let data = await faqModel.findOne({_id:id});
    let obj = {
      status: true,
      data,
      message: "FAQ View",
    };

    res.send(obj);
  }
};

module.exports = faqController;