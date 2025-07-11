import {
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem
} from "@shared/schema";
import {
  UserModel,
  CategoryModel,
  ProductModel,
  CartItemModel
} from "./db";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "./db";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Vendor-specific operations
  getVendors(): Promise<User[]>;
  getVendor(id: string): Promise<User | undefined>;
  getProductsByVendor(vendorId: string): Promise<Product[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Cart
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
}

export class MongoStorage implements IStorage {
  private useFallback = true; // Start with fallback until MongoDB connects
  private memoryStorage = {
    users: new Map<string, User>(),
    categories: new Map<string, Category>(),
    products: new Map<string, Product>(),
    cartItems: new Map<string, CartItem>(),
    counter: 1
  };

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    // For MEN stack development, let's use in-memory storage primarily
    // but still try to connect to MongoDB if available
    console.log('🔧 Setting up MEN stack storage...');
    
    try {
      // Try MongoDB connection
      await connectToDatabase();
      console.log('✅ MongoDB connected successfully');
      this.useFallback = false;
      await this.initializeData();
    } catch (error) {
      console.log('🔧 Using in-memory storage for MEN stack development');
      this.useFallback = true;
      await this.initializeMemoryData();
    }
  }

  private async initializeMemoryData() {
    console.log("Initializing in-memory data...");
    
    // Create sample users
    const users = [
      {
        id: "1",
        email: "nyawiraalvin@gmail.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Alvin",
        lastName: "Nyawira",
        role: "customer",
        profileImageUrl: null,
        businessName: null,
        bio: null,
        location: null,
        phone: null,
        specialties: null,
        yearsOfExperience: null,
        isVerified: false,
        whatsappNumber: null,
        instagramHandle: null,
        facebookPage: null,
        website: null,
        mpesaNumber: null,
        bankDetails: null,
        acceptedPaymentMethods: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        email: "mary.wanjiku@kifaru.com",
        password: await bcrypt.hash("vendor123", 10),
        firstName: "Mary",
        lastName: "Wanjiku",
        role: "vendor",
        businessName: "Wanjiku's Traditional Crafts",
        bio: "Master craftswoman specializing in traditional Kikuyu pottery and woodcarving.",
        location: "Nyeri, Central Kenya",
        phone: "+254712345678",
        specialties: "Pottery, Wood Carving, Traditional Masks",
        yearsOfExperience: 15,
        isVerified: true,
        profileImageUrl: null,
        whatsappNumber: "+254712345678",
        instagramHandle: "@wanjiku_crafts",
        facebookPage: "Wanjiku Traditional Crafts",
        website: null,
        mpesaNumber: "+254712345678",
        bankDetails: "Equity Bank - 1234567890",
        acceptedPaymentMethods: ["mpesa", "bank"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    users.forEach(user => this.memoryStorage.users.set(user.id, user));

    // Create sample categories
    const categories = [
      { id: "1", name: "Traditional Crafts", description: "Authentic handmade traditional items", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400" },
      { id: "2", name: "Jewelry & Beadwork", description: "Beautiful handcrafted jewelry and beadwork", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
      { id: "3", name: "Textiles & Fabrics", description: "Traditional woven fabrics and textiles", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" }
    ];

    categories.forEach(cat => this.memoryStorage.categories.set(cat.id, cat));

    // Create sample products
    const products = [
      {
        id: "1",
        name: "Hand-carved Wooden Mask",
        description: "Traditional Kikuyu ceremonial mask hand-carved from indigenous wood",
        price: "4500",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: true,
        badge: "Authentic",
        stock: 5
      },
      {
        id: "2", 
        name: "Maasai Beaded Necklace",
        description: "Colorful traditional Maasai beaded necklace with authentic patterns",
        price: "2800",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        categoryId: "2",
        vendorId: "2",
        featured: true,
        badge: "Best Seller",
        stock: 8
      },
      {
        id: "3",
        name: "Kikuyu Traditional Pottery Bowl",
        description: "Authentic handmade pottery bowl using traditional Kikuyu techniques, perfect for serving traditional dishes",
        price: "3200",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba666cd?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: false,
        badge: "Handmade",
        stock: 12
      },
      {
        id: "4",
        name: "Kenyan Flag Beaded Bracelet",
        description: "Patriotic beaded bracelet featuring the colors of the Kenyan flag",
        price: "1800",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",
        categoryId: "2",
        vendorId: "2",
        featured: false,
        badge: "New",
        stock: 15
      },
      {
        id: "5",
        name: "Luo Traditional Fabric",
        description: "Beautiful hand-woven fabric using traditional Luo techniques from Lake Victoria region",
        price: "5600",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        categoryId: "3",
        vendorId: "2",
        featured: true,
        badge: "Limited",
        stock: 6
      },
      {
        id: "6",
        name: "Maasai Warrior Shield Replica",
        description: "Traditional Maasai warrior shield replica, hand-painted with authentic patterns and symbols",
        price: "8900",
        image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: true,
        badge: "Collector's Item",
        stock: 3
      },
      {
        id: "7",
        name: "Turkana Beaded Headband",
        description: "Traditional Turkana beaded headband with intricate geometric patterns",
        price: "2400",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
        categoryId: "2",
        vendorId: "2",
        featured: false,
        badge: "Traditional",
        stock: 10
      },
      {
        id: "8",
        name: "Kamba Wood Carving Elephant",
        description: "Beautiful elephant sculpture carved by skilled Kamba artisans from Machakos",
        price: "6700",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: false,
        badge: "Artisan Made",
        stock: 7
      },
      {
        id: "9",
        name: "Kisii Soapstone Figurine",
        description: "Hand-carved soapstone figurine from Kisii, representing African wildlife",
        price: "3800",
        image: "https://images.unsplash.com/photo-1578049921046-74a7d6d73d4e?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: false,
        badge: "Unique",
        stock: 9
      },
      {
        id: "10",
        name: "Kikoy Cotton Fabric",
        description: "Traditional Kikoy cotton fabric from the Kenyan coast, perfect for beach wear or home decor",
        price: "4200",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        categoryId: "3",
        vendorId: "2",
        featured: false,
        badge: "Coastal",
        stock: 20
      },
      {
        id: "11",
        name: "Samburu Beaded Collar",
        description: "Traditional Samburu beaded collar worn by married women, rich in cultural significance",
        price: "5400",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        categoryId: "2",
        vendorId: "2",
        featured: true,
        badge: "Cultural",
        stock: 5
      },
      {
        id: "12",
        name: "Kenyan Coffee Bean Art",
        description: "Artistic mosaic made from authentic Kenyan coffee beans, celebrating Kenya's coffee heritage",
        price: "7800",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        categoryId: "1",
        vendorId: "2",
        featured: false,
        badge: "Coffee Art",
        stock: 4
      }
    ];

    products.forEach(prod => this.memoryStorage.products.set(prod.id, prod));
    console.log('✅ In-memory data initialized');
  }

  private async initializeData() {
    // Check if data already exists
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) return;

    console.log("Initializing sample data...");

    // Create sample users with vendor profiles
    const usersData = [
      {
        email: "nyawiraalvin@gmail.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Alvin",
        lastName: "Nyawira",
        role: "customer"
      },
      {
        email: "mary.wanjiku@kifaru.com",
        password: await bcrypt.hash("vendor123", 10),
        firstName: "Mary",
        lastName: "Wanjiku",
        role: "vendor",
        businessName: "Wanjiku's Traditional Crafts",
        bio: "Master craftswoman specializing in traditional Kikuyu pottery and woodcarving. My family has been creating beautiful handmade items for over three generations, passing down techniques from grandmother to mother to daughter.",
        location: "Nyeri, Central Kenya",
        phone: "+254712345678",
        specialties: "Pottery, Wood Carving, Traditional Masks",
        yearsOfExperience: 15,
        isVerified: true
      },
      {
        email: "james.kimani@kifaru.com",
        password: await bcrypt.hash("vendor123", 10),
        firstName: "James",
        lastName: "Kimani",
        role: "vendor",
        businessName: "Kimani Beadworks & Jewelry",
        bio: "Specialized in traditional Kenyan beadwork and jewelry making. Creating authentic pieces that tell the story of Kenyan culture through intricate beadwork patterns passed down through generations.",
        location: "Nairobi, Kenya",
        phone: "+254723456789",
        specialties: "Beadwork, Jewelry, Traditional Accessories",
        yearsOfExperience: 12,
        isVerified: true
      },
      {
        email: "grace.achieng@kifaru.com",
        password: await bcrypt.hash("vendor123", 10),
        firstName: "Grace",
        lastName: "Achieng",
        role: "vendor",
        businessName: "Achieng's Textile Arts",
        bio: "Textile artist creating beautiful fabrics using traditional Luo weaving techniques. My work celebrates the rich textile heritage of the Lake Victoria region with modern artistic interpretations.",
        location: "Kisumu, Nyanza",
        phone: "+254734567890",
        specialties: "Textiles, Weaving, Traditional Fabrics",
        yearsOfExperience: 18,
        isVerified: true
      }
    ];

    const createdUsers = await UserModel.insertMany(usersData);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample categories
    const categoriesData = [
      {
        name: "Traditional Crafts",
        description: "Authentic handmade crafts representing Kenyan cultural heritage",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      },
      {
        name: "Jewelry & Accessories",
        description: "Beautiful handcrafted jewelry and accessories using traditional techniques",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop"
      },
      {
        name: "Textiles & Fabrics",
        description: "Traditional and contemporary textile art and fabrics",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
      },
      {
        name: "Home & Decor",
        description: "Handcrafted items to beautify your living space",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
      }
    ];

    const createdCategories = await CategoryModel.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Get vendor IDs for products
    const vendors = createdUsers.filter(user => user.role === "vendor");

    // Create sample products
    const productsData = [
      {
        name: "Maasai Ceremonial Mask",
        description: "Authentic Maasai ceremonial mask hand-carved from African hardwood, representing the warrior spirit and cultural traditions of the Maasai people.",
        price: "12500.00",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        categoryId: createdCategories[0]._id,
        vendorId: vendors[0]._id,
        featured: true,
        badge: "Featured",
        stock: 5
      },
      {
        name: "Kikuyu Traditional Pottery Set",
        description: "Set of 3 traditional Kikuyu clay pots, perfect for cooking traditional Kenyan dishes. Each pot is hand-shaped and fired using traditional methods.",
        price: "8750.00",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba666cd?w=400&h=400&fit=crop",
        categoryId: createdCategories[0]._id,
        vendorId: vendors[0]._id,
        featured: false,
        stock: 8
      },
      {
        name: "Maasai Beaded Necklace",
        description: "Stunning traditional Maasai beaded necklace featuring vibrant colors and intricate patterns. Each piece tells a story of Maasai culture and heritage.",
        price: "4200.00",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        categoryId: createdCategories[1]._id,
        vendorId: vendors[1]._id,
        featured: true,
        badge: "New",
        stock: 12
      },
      {
        name: "Kenyan Flag Beaded Bracelet",
        description: "Patriotic beaded bracelet featuring the colors of the Kenyan flag. Perfect for showing your love for Kenya.",
        price: "1500.00",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
        categoryId: createdCategories[1]._id,
        vendorId: vendors[1]._id,
        featured: false,
        stock: 25
      },
      {
        name: "Luo Traditional Fabric",
        description: "Beautiful hand-woven fabric using traditional Luo techniques. Perfect for creating traditional clothing or home decorations.",
        price: "6300.00",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        categoryId: createdCategories[2]._id,
        vendorId: vendors[2]._id,
        featured: true,
        badge: "Limited",
        stock: 6
      },
      {
        name: "Kenyan Coffee Table Mat Set",
        description: "Set of 6 handwoven table mats perfect for your dining table. Made from natural fibers with traditional Kenyan patterns.",
        price: "3200.00",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        categoryId: createdCategories[3]._id,
        vendorId: vendors[2]._id,
        featured: false,
        stock: 15
      }
    ];

    const createdProducts = await ProductModel.insertMany(productsData);
    console.log(`✅ Created ${createdProducts.length} products`);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    if (this.useFallback) {
      return this.memoryStorage.users.get(id);
    }
    const user = await UserModel.findById(id).lean();
    return user ? { ...user, _id: user._id.toString() } : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (this.useFallback) {
      return Array.from(this.memoryStorage.users.values()).find(user => user.email === email);
    }
    const user = await UserModel.findOne({ email }).lean();
    return user ? { ...user, _id: user._id.toString() } : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    if (this.useFallback) {
      const id = String(this.memoryStorage.counter++);
      const user: User = {
        id,
        ...insertUser,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.memoryStorage.users.set(id, user);
      return user;
    }
    
    const user = await UserModel.create({
      ...insertUser,
      password: hashedPassword,
    });
    return { ...user.toObject(), _id: user._id.toString() };
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    if (this.useFallback) {
      const user = Array.from(this.memoryStorage.users.values()).find(u => u.email === email);
      if (!user) return null;
      
      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    }
    
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { ...user, _id: user._id.toString() };
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return updatedUser ? { ...updatedUser, _id: updatedUser._id.toString() } : undefined;
  }

  async getVendors(): Promise<User[]> {
    const vendors = await UserModel.find({ role: "vendor" }).lean();
    return vendors.map(vendor => ({ ...vendor, _id: vendor._id.toString() }));
  }

  async getVendor(id: string): Promise<User | undefined> {
    const vendor = await UserModel.findOne({ _id: id, role: "vendor" }).lean();
    return vendor ? { ...vendor, _id: vendor._id.toString() } : undefined;
  }

  async getProductsByVendor(vendorId: string): Promise<Product[]> {
    const products = await ProductModel.find({ vendorId }).lean();
    return products.map(product => ({ ...product, _id: product._id.toString() }));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    if (this.useFallback) {
      return Array.from(this.memoryStorage.categories.values());
    }
    const categories = await CategoryModel.find().lean();
    return categories.map(category => ({ ...category, _id: category._id.toString() }));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const category = await CategoryModel.findById(id).lean();
    return category ? { ...category, _id: category._id.toString() } : undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category = await CategoryModel.create(insertCategory);
    return { ...category.toObject(), _id: category._id.toString() };
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    if (this.useFallback) {
      return Array.from(this.memoryStorage.products.values());
    }
    const products = await ProductModel.find().lean();
    return products.map(product => ({ ...product, _id: product._id.toString() }));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (this.useFallback) {
      return Array.from(this.memoryStorage.products.values()).filter(p => p.categoryId === categoryId);
    }
    const products = await ProductModel.find({ categoryId }).lean();
    return products.map(product => ({ ...product, _id: product._id.toString() }));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    if (this.useFallback) {
      return Array.from(this.memoryStorage.products.values()).filter(p => p.featured);
    }
    const products = await ProductModel.find({ featured: true }).lean();
    return products.map(product => ({ ...product, _id: product._id.toString() }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    if (this.useFallback) {
      return this.memoryStorage.products.get(id);
    }
    const product = await ProductModel.findById(id).lean();
    return product ? { ...product, _id: product._id.toString() } : undefined;
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (this.useFallback) {
      const lowerQuery = query.toLowerCase();
      return Array.from(this.memoryStorage.products.values()).filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).lean();
    return products.map(product => ({ ...product, _id: product._id.toString() }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    if (this.useFallback) {
      const id = String(this.memoryStorage.counter++);
      const product: Product = {
        id,
        ...insertProduct,
      };
      this.memoryStorage.products.set(id, product);
      return product;
    }
    
    // For MongoDB, convert string IDs to ObjectIds for references
    const productData = {
      ...insertProduct,
      categoryId: insertProduct.categoryId ? new mongoose.Types.ObjectId(insertProduct.categoryId) : undefined,
      vendorId: new mongoose.Types.ObjectId(insertProduct.vendorId)
    };
    
    const product = await ProductModel.create(productData);
    return { ...product.toObject(), id: product._id.toString() };
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    if (this.useFallback) {
      const product = this.memoryStorage.products.get(id);
      if (!product) return undefined;
      
      const updatedProduct = { ...product, ...updateData };
      this.memoryStorage.products.set(id, updatedProduct);
      return updatedProduct;
    }
    
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();
    
    return updatedProduct ? { ...updatedProduct, _id: updatedProduct._id.toString() } : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (this.useFallback) {
      const existed = this.memoryStorage.products.has(id);
      if (existed) {
        this.memoryStorage.products.delete(id);
        return true;
      }
      return false;
    }
    
    const result = await ProductModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    if (this.useFallback) {
      const cartItems = Array.from(this.memoryStorage.cartItems.values())
        .filter(item => item.sessionId === sessionId);
      
      return cartItems.map(item => {
        const product = this.memoryStorage.products.get(item.productId);
        return {
          ...item,
          product: product!
        };
      });
    }
    
    const cartItems = await CartItemModel.find({ sessionId })
      .populate('productId')
      .lean();

    return cartItems.map(item => ({
      _id: item._id.toString(),
      productId: item.productId._id.toString(),
      quantity: item.quantity,
      sessionId: item.sessionId,
      product: {
        ...item.productId,
        _id: item.productId._id.toString()
      }
    }));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    if (this.useFallback) {
      // Check if item already exists in cart
      const existingItemId = Array.from(this.memoryStorage.cartItems.entries())
        .find(([_, item]) => 
          item.productId === insertCartItem.productId && 
          item.sessionId === insertCartItem.sessionId
        )?.[0];

      if (existingItemId) {
        const existingItem = this.memoryStorage.cartItems.get(existingItemId)!;
        existingItem.quantity += insertCartItem.quantity;
        return existingItem;
      } else {
        const newId = (this.memoryStorage.cartItems.size + 1).toString();
        const cartItem: CartItem = {
          id: newId,
          ...insertCartItem
        };
        this.memoryStorage.cartItems.set(newId, cartItem);
        return cartItem;
      }
    }

    // Check if item already exists in cart
    const existingItem = await CartItemModel.findOne({
      productId: insertCartItem.productId,
      sessionId: insertCartItem.sessionId
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertCartItem.quantity;
      await existingItem.save();
      return { ...existingItem.toObject(), id: existingItem._id.toString() };
    } else {
      // Create new cart item
      const cartItem = await CartItemModel.create(insertCartItem);
      return { ...cartItem.toObject(), id: cartItem._id.toString() };
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    if (this.useFallback) {
      const item = this.memoryStorage.cartItems.get(id);
      if (item) {
        item.quantity = quantity;
        return item;
      }
      return undefined;
    }

    const updatedItem = await CartItemModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    ).lean();
    
    return updatedItem ? { ...updatedItem, id: updatedItem._id.toString() } : undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    if (this.useFallback) {
      return this.memoryStorage.cartItems.delete(id);
    }

    const result = await CartItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async clearCart(sessionId: string): Promise<void> {
    if (this.useFallback) {
      const itemsToDelete = Array.from(this.memoryStorage.cartItems.entries())
        .filter(([_, item]) => item.sessionId === sessionId)
        .map(([id, _]) => id);
      
      itemsToDelete.forEach(id => this.memoryStorage.cartItems.delete(id));
      return;
    }

    await CartItemModel.deleteMany({ sessionId });
  }
}

export const storage = new MongoStorage();