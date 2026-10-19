import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalSellers, totalProducts, totalOrders, totalCategories, revenueAgg] =
      await Promise.all([
        User.countDocuments({ role: "customer" }),
        User.countDocuments({ role: "seller" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      ]);

    const recentSellers = await User.find({ role: "seller" })
      .select("name email shopName createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentSellers,
    });
  } catch (error) {
    console.error("getAdminStats:", error);
    res.status(500).json({ success: false, message: "Unable to load admin stats." });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 });

    const withCounts = await Promise.all(
      sellers.map(async (s) => {
        const [products, orders] = await Promise.all([
          Product.countDocuments({ seller: s._id }),
          Order.countDocuments({ "items.seller": s._id }),
        ]);
        return { ...s.toObject(), productCount: products, orderCount: orders };
      })
    );

    res.status(200).json({ success: true, count: withCounts.length, sellers: withCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch sellers." });
  }
};

export const getSellerDetail = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select("-password");
    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ success: false, message: "Seller not found." });
    }

    const products = await Product.find({ seller: seller._id }).sort({ createdAt: -1 });
    const orders = await Order.find({ "items.seller": seller._id })
      .populate("customer", "name email phone address")
      .sort({ createdAt: -1 });

    const filteredOrders = orders.map((o) => {
      const o2 = o.toObject();
      o2.items = o2.items.filter(
        (it) => it.seller.toString() === seller._id.toString()
      );
      return o2;
    });

    res.status(200).json({
      success: true,
      seller,
      products,
      orders: filteredOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load seller." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch orders." });
  }
};