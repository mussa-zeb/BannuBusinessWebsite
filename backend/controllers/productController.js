import Product from "../models/Product.js";

// ============ PUBLIC: LIST PRODUCTS ============
export const getProducts = async (req, res) => {
  try {
    const { category, search, seller, minPrice, maxPrice, sort } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (seller) query.seller = seller;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOpt = { createdAt: -1 };
    if (sort === "price-asc") sortOpt = { price: 1 };
    if (sort === "price-desc") sortOpt = { price: -1 };
    if (sort === "rating") sortOpt = { rating: -1 };
    if (sort === "popular") sortOpt = { totalSold: -1 };

    const products = await Product.find(query)
      .populate(
        "seller",
        "name shopName shopLogo shopDescription address phone email"
      )
      .sort(sortOpt);

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("getProducts:", error);
    res.status(500).json({ success: false, message: "Unable to fetch products." });
  }
};

// ============ PUBLIC: SINGLE PRODUCT ============
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name shopName shopLogo shopDescription email phone address"
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch product." });
  }
};

// ============ SELLER: MY PRODUCTS ============
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to fetch your products." });
  }
};

// ============ SELLER: CREATE ============
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, discountPrice, stock, image, images } =
      req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required.",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      name: name.trim(),
      description: description?.trim() || "",
      category: category.trim(),
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      stock: Number(stock) || 0,
      image: image || "",
      images: images || [],
    });

    res
      .status(201)
      .json({ success: true, message: "Product created.", product });
  } catch (error) {
    console.error("createProduct:", error);
    res
      .status(500)
      .json({ success: false, message: "Unable to create product." });
  }
};

// ============ SELLER: UPDATE ============
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    const fields = [
      "name",
      "description",
      "category",
      "price",
      "discountPrice",
      "stock",
      "image",
      "images",
      "isActive",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        if (["price", "discountPrice", "stock"].includes(f)) {
          product[f] = Number(req.body[f]) || 0;
        } else {
          product[f] = req.body[f];
        }
      }
    });

    await product.save();
    res
      .status(200)
      .json({ success: true, message: "Product updated.", product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to update product." });
  }
};

// ============ SELLER: DELETE ============
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Unable to delete product." });
  }
};