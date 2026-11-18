// controllers/website/faqController.js
const faqModel = require("../../model/faqModel");

const websiteFaqController = {
  viewActive: async (req, res) => {
    try {
      let data = await faqModel.find({ status: true }).sort({ order: 1 });

      let obj = {
        status: true,
        data,
        message: "Active FAQs retrieved successfully",
      };

      res.status(200).json(obj);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error fetching FAQs",
        error: err.message,
      });
    }
  },
};

module.exports = websiteFaqController;