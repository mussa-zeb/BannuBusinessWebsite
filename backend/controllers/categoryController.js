import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch categories." });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Category already exists." });
    }
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
      icon: icon || "",
      image: image || "",
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create category." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    if (name !== undefined) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Category name already exists." });
    }
    res.status(500).json({ success: false, message: "Unable to update category." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete category." });
  }
};