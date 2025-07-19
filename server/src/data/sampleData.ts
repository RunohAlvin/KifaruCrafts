import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";

export async function initializeSampleData() {
  try {
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log("✅ Sample data already exists");
      return;
    }

    console.log("🔄 Initializing sample data...");

    // Create sample users
    const users = await User.insertMany([
      {
        email: "customer@kifaru.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        role: "customer",
      },
      {
        email: "vendor@kifaru.com",
        password: "password123",
        firstName: "Mary",
        lastName: "Wanjiku",
        role: "vendor",
        businessName: "Wanjiku Crafts",
        bio: "Traditional Kenyan artisan specializing in wooden crafts",
        location: "Nairobi, Kenya",
        specialties: "Wood carving, Traditional masks",
        yearsOfExperience: 15,
        isVerified: true,
      },
      {
        email: "vendor2@kifaru.com",
        password: "password123",
        firstName: "James",
        lastName: "Mwangi",
        role: "vendor",
        businessName: "Mwangi Beadworks",
        bio: "Expert in traditional Maasai beadwork and jewelry",
        location: "Kajiado, Kenya",
        specialties: "Beadwork, Jewelry, Maasai crafts",
        yearsOfExperience: 20,
        isVerified: true,
      },
    ]);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: "Traditional Crafts",
        description: "Authentic Kenyan traditional crafts and artifacts",
        sortOrder: 1,
      },
      {
        name: "Jewelry & Accessories",
        description: "Handcrafted jewelry and fashion accessories",
        sortOrder: 2,
      },
      {
        name: "Textiles",
        description: "Traditional fabrics and woven materials",
        sortOrder: 3,
      },
      {
        name: "Pottery & Ceramics",
        description: "Handmade pottery and ceramic items",
        sortOrder: 4,
      },
    ]);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: "Hand-carved Wooden Mask",
        description:
          "Traditional Kenyan wooden mask carved by skilled artisans",
        price: 2500,
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        category: categories[0]._id,
        vendor: users[1]._id,
        featured: true,
        badge: "Bestseller",
        stock: 15,
        tags: ["traditional", "wood", "mask", "art"],
      },
      {
        name: "Maasai Beaded Necklace",
        description: "Colorful traditional Maasai beaded necklace",
        price: 800,
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        category: categories[1]._id,
        vendor: users[2]._id,
        featured: true,
        stock: 25,
        tags: ["maasai", "beads", "necklace", "jewelry"],
      },
      {
        name: "Kikoy Beach Wrap",
        description:
          "Traditional Kenyan kikoy perfect for beach or casual wear",
        price: 1200,
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
        category: categories[2]._id,
        vendor: users[1]._id,
        stock: 30,
        tags: ["kikoy", "textile", "beach", "wrap"],
      },
      {
        name: "Soapstone Elephant",
        description: "Beautiful soapstone elephant sculpture from Kisii",
        price: 1500,
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        category: categories[3]._id,
        vendor: users[2]._id,
        featured: true,
        stock: 12,
        tags: ["soapstone", "elephant", "sculpture", "kisii"],
      },
    ]);

    console.log("✅ Sample data initialized successfully");
    console.log(
      `Created ${users.length} users, ${categories.length} categories, ${products.length} products`
    );
  } catch (error) {
    console.error("❌ Error initializing sample data:", error);
  }
}
