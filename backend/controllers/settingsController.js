import Settings from "../models/Settings.js";

// Get or create the singleton settings document
const getOrCreate = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// ==============================
// GET SETTINGS (public)
// ==============================
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("getSettings:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load settings.",
    });
  }
};

// ==============================
// UPDATE SETTINGS (admin only)
// ==============================
export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();

    const allowed = [
      "siteName",
      "siteTagline",
      "siteDescription",
      "contactEmail",
      "contactPhone",
      "contactAddress",
      "emailNotifications",
      "bookingNotifications",
      "reviewNotifications",
      "maintenanceMode",
      "footerText",
      "socialFacebook",
      "socialInstagram",
      "socialTwitter",
      "socialWhatsapp",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("updateSettings:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update settings.",
    });
  }
};