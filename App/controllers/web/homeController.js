const productModel = require("../../model/productModel");
const sliderModel = require("../../model/sliderModel");
const testimonialModel = require("../../model/testimonialModel");


let homeController = {
  slider: async (req, res) => {
    try {
      let data = await sliderModel
        .find({ status: true })
        .sort({ order: 1 }); 
      
      let obj = {
        status: true,
        path: process.env.SLIDERSTATICPATH || 'http://localhost:8000/uploads/slider/', 
        data,
        message: "Slider Found",
      };

      res.status(200).send(obj);
    } catch (error) {
      res.status(500).send({ status: false, message: "Error fetching sliders", error: error.message });
    }
  },
  testimonial: async(req, res) => {
    try {
      let data = await testimonialModel
        .find({ status: true })
        .sort({ order: 1 }); 
      
      let obj = {
        status: true,
        path: process.env.TESTIMONIALSTATICPATH || 'http://localhost:8000/uploads/testimonial/', 
        data,
        message: "Testimonials Found",
      };

      res.status(200).send(obj);
    } catch (error) {
      res.status(500).send({ 
        status: false, 
        message: "Error fetching testimonials", 
        error: error.message 
      });
    }
  },
  homeProduct: async (req, res) => {
    let data = await productModel
      .find({ status: true })
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
};

module.exports = homeController;
