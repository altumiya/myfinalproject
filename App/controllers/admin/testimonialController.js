const testimonialModel = require("../../model/testimonialModel")
const { createSlug } = require("../../config/helper");

let testimonialController = {
    create: async (req, res) => {
        let { name, order, designation, rating, message, } = req.body;
        let insertObj = {
            name,
            order,
            designation,
            rating,
            message
        };

        if (req.file && req.file.filename) {
            insertObj["image"] = req.file.filename;
        }

        try {
            insertObj["slug"] = createSlug(insertObj.name)

            let checkSameTestimonial = await testimonialModel.findOne({ name });
            if (checkSameTestimonial) {
                return res.status(409).json({
                    status: false,
                    message: "Testimonial Error",
                    error: {
                        name: "Testimonial Name Already Exists...",
                    },
                });
            }

            let testimonialRes = await testimonialModel.create(insertObj);
            let obj = {
                status: true,
                message: "Testimonial Added",
                testimonialRes,
            };
            return res.status(201).json(obj);
        } catch (err) {
            console.error("Testimonial create error:", err);

            let error = {};
            for (let key in err.errors || {}) {
                error[key] = err.errors[key].message;
            }

            return res.status(500).json({
                status: false,
                message: err.message || "Unable to add testimonial",
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
                const existingTestimonial = await testimonialModel.findOne({
                    name: updateObj.name,
                    _id: { $ne: id },
                });

                if (existingTestimonial) {
                    return res.status(409).json({
                        status: false,
                        message: "Testimonial Error",
                        error: { name: "Testimonial Name Already Exists..." },
                    });
                }
            }

            let updateRes = await testimonialModel.updateOne(
                { _id: id },
                {
                    $set: updateObj,
                }
            );

            return res.status(200).json({
                status: true,
                message: "Testimonialy Updated Successfully",
                updateRes,
            });
        } catch (err) {
            console.error("Testimonialy update error:", err);

            const error = {};
            for (const [key, value] of Object.entries(err.errors || {})) {
                error[key] = value.message;
            }

            return res.status(500).json({
                status: false,
                message: err.message || "Unable to update testimonial",
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

        let data = await testimonialModel.find(filter);
        let obj = {
            status: true,
            path: process.env.TESTIMONIALSTATICPATH,
            data,
            message: "TestimonialFound",
        };

        res.send(obj);
    },
    details: async (req, res) => {
        let { id } = req.params;
        let data = await testimonialModel.findOne({ _id: id });
        let obj = {
            status: true,
            path: process.env.TESTIMONIALSTATICPATH,
            data,
            message: "Testimonial Found",
        };
        res.send(obj);
    },
    delete: async (req, res) => {
        let { id } = req.params;
    
        let delRes = await testimonialModel.deleteOne({ _id: id });
    
        let obj = {
          status: true,
          message: "Testimonial Delete",
          delRes,
        };
    
        res.send(obj);
      },
       multiDelete: async (req, res) => {
          let { ids } = req.body;
      
          let delRes = await testimonialModel.deleteMany({ _id: { $in: ids } });
          let obj = {
            status: true,
            message: "Testimonial Delete",
            delRes,
          };
      
          res.send(obj);
        },
         changeStatus: async (req, res) => {
            let { ids } = req.body;
        
            for (let v of ids) {
              let oldStatusObj = await testimonialModel.findOne({ _id: v }).select("status");
        
              if (oldStatusObj) {
                let { status } = oldStatusObj;
        
                await testimonialModel.updateOne(
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
              message: "Testimonial Status Updated",
            };
            res.send(obj);
          },
};
module.exports = testimonialController;