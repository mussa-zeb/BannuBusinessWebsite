import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Bannu Business Platform" },
    siteTagline: { type: String, default: "Discover. Connect. Book." },
    siteDescription: {
      type: String,
      default:
        "Bannu Business Platform connects local businesses with customers across Bannu.",
    },

    contactEmail: { type: String, default: "info@bannuonline.com" },
    contactPhone: { type: String, default: "+92 300 0000000" },
    contactAddress: { type: String, default: "Main Bazaar Road, Bannu, KP, Pakistan" },

    emailNotifications: { type: Boolean, default: true },
    bookingNotifications: { type: Boolean, default: true },
    reviewNotifications: { type: Boolean, default: true },

    maintenanceMode: { type: Boolean, default: false },

    footerText: {
      type: String,
      default: "© 2026 Bannu Online Business Platform. All rights reserved.",
    },

    socialFacebook: { type: String, default: "" },
    socialInstagram: { type: String, default: "" },
    socialTwitter: { type: String, default: "" },
    socialWhatsapp: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;