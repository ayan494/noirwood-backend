import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import Product from "../models/Product";
import Category from "../models/Category";

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = "admin@noirwood.com";
    const defaultPassword = "Admin@123";

    let admin = await Admin.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    if (!admin) {
      await Admin.create({
        email: adminEmail,
        password: hashedPassword,
      });
      console.log(`[Seeder] Default admin created: ${adminEmail}`);
    } else {
      const isMatch = await bcrypt.compare(defaultPassword, admin.password || "");
      if (!isMatch) {
        admin.password = hashedPassword;
        await admin.save();
        console.log(`[Seeder] Default admin password synchronized.`);
      } else {
        console.log(`[Seeder] Default admin verified.`);
      }
    }

    // Seed default categories if none exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: "Living Room", slug: "living-room", description: "Sofa sets, coffee tables, armchairs, and media consoles.", status: "published", displayOrder: 1 },
        { name: "Dining Room", slug: "dining-room", description: "Luxury dining tables, upholstered chairs, and sideboards.", status: "published", displayOrder: 2 },
        { name: "Bedroom", slug: "bedroom", description: "Bespoke bed frames, nightstands, and dressers.", status: "published", displayOrder: 3 },
        { name: "Office", slug: "office", description: "Executive desks, ergonomic leather chairs, and shelving.", status: "published", displayOrder: 4 },
        { name: "Outdoor", slug: "outdoor", description: "Weather-resistant teak and woven lounge furniture.", status: "published", displayOrder: 5 },
      ];
      await Category.insertMany(defaultCategories);
      console.log("[Seeder] Default luxury categories initialized.");
    }
  } catch (error) {
    console.error("[Seeder] Error seeding default data:", error);
  }
};

export const clearDummyData = async (): Promise<void> => {
  try {
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("[Seeder] Database cleaned.");
  } catch (error) {
    console.error("[Seeder] Error clearing data:", error);
  }
};
