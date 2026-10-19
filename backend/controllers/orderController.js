import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ============ CUSTOMER: CREATE ORDER ============
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }
    if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and address are required.",
      });
    }

    const isWallet = paymentMethod === "easypaisa" || paymentMethod === "jazzcash";
    if (isWallet && !paymentDetails?.mobileAccount) {
      return res.status(400).json({
        success: false,
        message: "Mobile account number is required for EasyPaisa / JazzCash.",
      });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.image,
        seller: product.seller,
      });
      total += price * item.quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount: total,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      paymentDetails: {
        mobileAccount: paymentDetails?.mobileAccount || "",
        transactionId: paymentDetails?.transactionId || "",
      },
      notes: notes || "",
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSold: item.quantity },
      });
    }

    res.status(201).json({ success: true, message: "Order placed.", order });
  } catch (error) {
    console.error("createOrder:", error);
    res.status(500).json({ success: false, message: "Unable to create order." });
  }
};

// ============ CUSTOMER: MY ORDERS ============
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.seller", "name shopName")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch orders." });
  }
};

// ============ SELLER: ORDERS CONTAINING MY PRODUCTS ============
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("customer", "name email phone address")
      .sort({ createdAt: -1 });

    const filtered = orders.map((o) => {
      const o2 = o.toObject();
      o2.items = o2.items.filter(
        (it) => it.seller?.toString() === req.user._id.toString()
      );
      o2.sellerTotal = o2.items.reduce((s, it) => s + it.price * it.quantity, 0);
      return o2;
    });

    res.status(200).json({ success: true, orders: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch orders." });
  }
};

// ============ SELLER/ADMIN: UPDATE STATUS ============
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    const isSeller = order.items.some(
      (it) => it.seller.toString() === req.user._id.toString()
    );
    const isAdmin = req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    order.status = status;
    if (status === "delivered") order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({ success: true, message: "Status updated.", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update order." });
  }
};

// ============ SELLER: MY CUSTOMERS ============
export const getSellerCustomers = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("customer", "name email phone address image")
      .sort({ createdAt: -1 });

    const map = new Map();
    orders.forEach((o) => {
      if (o.customer?._id) {
        const key = o.customer._id.toString();
        if (!map.has(key)) {
          map.set(key, { ...o.customer.toObject(), orderCount: 1 });
        } else {
          const existing = map.get(key);
          existing.orderCount += 1;
        }
      }
    });

    res.status(200).json({ success: true, customers: Array.from(map.values()) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch customers." });
  }
};

// ============ SELLER: DASHBOARD STATS ============
export const getSellerStats = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).select("_id");

    const orders = await Order.find({ "items.seller": req.user._id });

    let totalRevenue = 0;
    const customerSet = new Set();
    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (it.seller.toString() === req.user._id.toString()) {
          totalRevenue += it.price * it.quantity;
        }
      });
      // ✅ Guard against deleted customers
      if (o.customer) customerSet.add(o.customer.toString());
    });

    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    res.status(200).json({
      success: true,
      stats: {
        products: products.length,
        orders: orders.length,
        pendingOrders,
        customers: customerSet.size,
        revenue: totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load stats." });
  }
};

// ============ SELLER: PAYMENTS SUMMARY ============
export const getSellerPayments = async (req, res) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    const payments = orders.map((o) => {
      const sellerItems = o.items.filter(
        (it) => it.seller.toString() === req.user._id.toString()
      );
      const amount = sellerItems.reduce((s, it) => s + it.price * it.quantity, 0);
      return {
        _id: o._id,
        customer: o.customer,
        amount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.status,
        mobileAccount: o.paymentDetails?.mobileAccount || "",
        transactionId: o.paymentDetails?.transactionId || "",
        createdAt: o.createdAt,
      };
    });

    const totals = {
      totalEarned: payments
        .filter((p) => p.paymentStatus === "paid")
        .reduce((s, p) => s + p.amount, 0),
      pending: payments
        .filter((p) => p.paymentStatus === "pending")
        .reduce((s, p) => s + p.amount, 0),
      byMethod: {
        cod: payments.filter((p) => p.paymentMethod === "cod").length,
        easypaisa: payments.filter((p) => p.paymentMethod === "easypaisa").length,
        jazzcash: payments.filter((p) => p.paymentMethod === "jazzcash").length,
      },
    };

    res.status(200).json({ success: true, payments, totals });
  } catch (error) {
    console.error("getSellerPayments:", error);
    res.status(500).json({ success: false, message: "Unable to load payments." });
  }
};