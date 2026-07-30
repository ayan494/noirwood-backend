"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDummyData = exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const seedAdmin = async () => {
    try {
        const adminEmail = "admin@noirwood.com";
        const defaultPassword = "Admin@123";
        let admin = await Admin_1.default.findOne({ email: adminEmail });
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(defaultPassword, salt);
        if (!admin) {
            await Admin_1.default.create({
                email: adminEmail,
                password: hashedPassword,
            });
            console.log(`[Seeder] Default admin created: ${adminEmail}`);
        }
        else {
            const isMatch = await bcryptjs_1.default.compare(defaultPassword, admin.password || "");
            if (!isMatch) {
                admin.password = hashedPassword;
                await admin.save();
                console.log(`[Seeder] Default admin password synchronized.`);
            }
            else {
                console.log(`[Seeder] Default admin verified.`);
            }
        }
        // Seed default categories if none exist
        const categoryCount = await Category_1.default.countDocuments();
        if (categoryCount === 0) {
            const defaultCategories = [
                { name: "Living Room", slug: "living-room", description: "Sofa sets, coffee tables, armchairs, and media consoles.", status: "published", displayOrder: 1 },
                { name: "Dining Room", slug: "dining-room", description: "Luxury dining tables, upholstered chairs, and sideboards.", status: "published", displayOrder: 2 },
                { name: "Bedroom", slug: "bedroom", description: "Bespoke bed frames, nightstands, and dressers.", status: "published", displayOrder: 3 },
                { name: "Office", slug: "office", description: "Executive desks, ergonomic leather chairs, and shelving.", status: "published", displayOrder: 4 },
                { name: "Outdoor", slug: "outdoor", description: "Weather-resistant teak and woven lounge furniture.", status: "published", displayOrder: 5 },
            ];
            await Category_1.default.insertMany(defaultCategories);
            console.log("[Seeder] Default luxury categories initialized.");
        }
    }
    catch (error) {
        console.error("[Seeder] Error seeding default data:", error);
    }
};
exports.seedAdmin = seedAdmin;
const clearDummyData = async () => {
    try {
        await Product_1.default.deleteMany({});
        await Category_1.default.deleteMany({});
        console.log("[Seeder] Database cleaned.");
    }
    catch (error) {
        console.error("[Seeder] Error clearing data:", error);
    }
};
exports.clearDummyData = clearDummyData;
