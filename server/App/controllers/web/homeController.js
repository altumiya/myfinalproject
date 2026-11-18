const productModel = require("../../model/productModel");
const categoryModel = require("../../model/categoryModel");
const subcategoryModel = require("../../model/subcategoryModel");
const subsubcategoryModel = require("../../model/subsubcategoryModel");
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
  megaMenu: async (req, res) => {
    try {
      const categories = await categoryModel
        .find({ status: true })
        .select("name slug")
        .sort({ order: 1 })
        .lean();

      const categoryIds = categories.map((category) => category._id);
      const subCategories = await subcategoryModel
        .find({ status: true, parent: { $in: categoryIds } })
        .select("name slug parent")
        .sort({ order: 1 })
        .lean();

      const subCategoryIds = subCategories.map((subcategory) => subcategory._id);
      const subSubCategories = await subsubcategoryModel
        .find({ status: true, subcategory: { $in: subCategoryIds } })
        .select("name slug subcategory")
        .sort({ order: 1 })
        .lean();

      const subSubCategoriesByParent = new Map();
      for (const subsubcategory of subSubCategories) {
        const parentId = String(subsubcategory.subcategory);
        const children = subSubCategoriesByParent.get(parentId) || [];
        children.push(subsubcategory);
        subSubCategoriesByParent.set(parentId, children);
      }

      const subCategoriesByParent = new Map();
      for (const subcategory of subCategories) {
        subcategory.subSubCategories =
          subSubCategoriesByParent.get(String(subcategory._id)) || [];
        const parentId = String(subcategory.parent);
        const children = subCategoriesByParent.get(parentId) || [];
        children.push(subcategory);
        subCategoriesByParent.set(parentId, children);
      }

      const categoryData = categories.map((category) => ({
        ...category,
        subCategories: subCategoriesByParent.get(String(category._id)) || [],
      }));
      const uniqueCategories = new Map();

      for (const category of categoryData) {
        const key = category.name.trim().toLowerCase();
        const existingCategory = uniqueCategories.get(key);

        if (
          !existingCategory ||
          (!existingCategory.subCategories.length && category.subCategories.length)
        ) {
          uniqueCategories.set(key, category);
        }
      }

      const data = [...uniqueCategories.values()];
      res.send({
        status: true,
        message: "Mega Menu",
        data,
      });
    } catch (error) {
      console.error("Mega menu fetch error:", error);
      res.status(500).send({
        status: false,
        message: "Error fetching mega menu",
      });
    }
  },
  homeProduct: async (req, res) => {
    let data = await productModel
      .find({ status: true })
      .populate("parent", "name slug")
      .populate("subCategory", "name slug")
      .populate("subsubCategory", "name slug")
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
