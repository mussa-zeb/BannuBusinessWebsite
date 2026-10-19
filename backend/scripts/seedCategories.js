import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Restaurants",
    description: "Restaurants, cafes, traditional food and local cuisine.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beauty & Salon",
    description: "Salons, barbers, spa and personal care services.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mobile Shops",
    description: "Phones, accessories and mobile repair shops.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Clothing",
    description: "Fashion, apparel and clothing stores.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Education",
    description: "Schools, academies and education services.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Health",
    description: "Hospitals, clinics and healthcare businesses.",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Electronics",
    description: "Computers, gadgets and electronics stores.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Automotive",
    description: "Car, bike and vehicle services.",
    image:
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home Services",
    description: "Repairs, maintenance and home services.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Real Estate",
    description: "Property, rentals and real estate agencies.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created: ${cat.name}`);
      } else {
        // update image/description if missing
        let dirty = false;
        if (!exists.image && cat.image) {
          exists.image = cat.image;
          dirty = true;
        }
        if (!exists.description && cat.description) {
          exists.description = cat.description;
          dirty = true;
        }
        if (dirty) {
          await exists.save();
          console.log(`Updated: ${cat.name}`);
        } else {
          console.log(`Exists:  ${cat.name}`);
        }
      }
    }

    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();