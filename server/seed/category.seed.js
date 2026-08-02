import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Category from "../models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Plumbing",
    slug: "plumbing",
    description: "Pipe leakage, tap fitting, drainage and plumbing services.",
    icon: "plumbing",
  },
  {
    name: "Electrical",
    slug: "electrical",
    description: "Electrical installation and repair services.",
    icon: "electrical",
  },
  {
    name: "Carpentry",
    slug: "carpentry",
    description: "Furniture assembly and woodwork.",
    icon: "carpentry",
  },
  {
    name: "Painting",
    slug: "painting",
    description: "Interior and exterior painting services.",
    icon: "painting",
  },
  {
    name: "Cleaning",
    slug: "cleaning",
    description: "Home and office cleaning services.",
    icon: "cleaning",
  },
  {
    name: "AC Repair",
    slug: "ac-repair",
    description: "Air conditioner installation and repair.",
    icon: "ac",
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    description: "Repair of household appliances.",
    icon: "appliance",
  },
  {
    name: "RO Repair",
    slug: "ro-repair",
    description: "Water purifier installation and servicing.",
    icon: "ro",
  },
  {
    name: "Welding",
    slug: "welding",
    description: "Metal fabrication and welding work.",
    icon: "welding",
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    description: "Pest and termite control services.",
    icon: "pest-control",
  },
  {
    name: "CCTV Installation",
    slug: "cctv-installation",
    description: "CCTV installation and maintenance.",
    icon: "cctv",
  },
  {
    name: "Gardening",
    slug: "gardening",
    description: "Garden maintenance and landscaping.",
    icon: "gardening",
  },
  {
    name: "Masonry",
    slug: "masonry",
    description: "Brickwork, concrete and construction services.",
    icon: "masonry",
  },
  {
    name: "Tiles & Flooring",
    slug: "tiles-flooring",
    description: "Tile installation and flooring work.",
    icon: "tiles",
  },
  {
    name: "Waterproofing",
    slug: "waterproofing",
    description: "Roof and wall waterproofing solutions.",
    icon: "waterproofing",
  },
  {
    name: "Interior Design",
    slug: "interior-design",
    description: "Interior designing and decoration.",
    icon: "interior",
  },
  {
    name: "False Ceiling",
    slug: "false-ceiling",
    description: "False ceiling installation services.",
    icon: "ceiling",
  },
  {
    name: "House Shifting",
    slug: "house-shifting",
    description: "Home relocation and moving services.",
    icon: "moving",
  },
  {
    name: "Other",
    slug: "other",
    description:
      "Work that does not belong to any predefined category.",
    icon: "other",
    isCustomCategory: true,
  },
];

const seedCategories = async () => {
  try {
    await connectDB();

    for (const category of categories) {
      await Category.updateOne(
        { slug: category.slug },
        { $set: category },
        { upsert: true }
      );
    }

    console.log("✅ Categories seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);

    process.exit(1);
  }
};

seedCategories();