import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertProductSchema, loginUserSchema, registerUserSchema } from "@shared/schema";
import { getSession, requireAuth, requireRole, attachUser } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(getSession());
  app.use(attachUser);

  // Health check endpoint for Render
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(validatedData);
      
      // Set session
      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.authenticateUser(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Get anonymous cart items before login to migrate them
      const anonymousSessionId = req.sessionID || "anonymous";
      const anonymousCartItems = await storage.getCartItems(anonymousSessionId);

      // Set session and save explicitly
      req.session.userId = user.id;
      req.session.userRole = user.role;
      
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Migrate anonymous cart items to authenticated user cart
      const userSessionId = `user_${user.id}`;
      for (const item of anonymousCartItems) {
        try {
          await storage.addToCart({
            productId: item.productId,
            quantity: item.quantity,
            sessionId: userSessionId,
          });
        } catch (error) {
          // Continue if item already exists in user cart
          console.log("Cart migration item already exists, skipping");
        }
      }

      // Clear anonymous cart after migration
      if (anonymousCartItems.length > 0) {
        await storage.clearCart(anonymousSessionId);
      }
      
      // Create user object without password for response
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from user response  
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  // Vendor profile routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      // Remove passwords from vendor responses
      const vendorsWithoutPasswords = vendors.map(({ password, ...vendor }) => vendor);
      res.json(vendorsWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const vendor = await storage.getVendor(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      // Remove password from vendor response
      const { password, ...vendorWithoutPassword } = vendor;
      res.json(vendorWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.get("/api/vendors/:id/products", async (req, res) => {
    try {
      const vendorId = req.params.id;
      const vendor = await storage.getVendor(vendorId);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      const products = await storage.getProductsByVendor(vendorId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor products" });
    }
  });

  app.put("/api/vendors/:id/profile", requireAuth, async (req, res) => {
    try {
      const vendorId = req.params.id;
      
      // Check if user is updating their own profile or is admin
      if (req.user!.id !== vendorId && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }

      const updateData = req.body;
      const updatedVendor = await storage.updateUser(vendorId, updateData);
      
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      // Remove password from response
      const { password, ...vendorWithoutPassword } = updatedVendor;
      res.json(vendorWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vendor profile" });
    }
  });

  // Update vendor contact and payment information
  app.put("/api/vendor/contact", requireAuth, async (req, res) => {
    try {
      if (req.user?.role !== "vendor") {
        return res.status(403).json({ message: "Only vendors can update contact information" });
      }

      const {
        whatsappNumber,
        instagramHandle,
        facebookPage,
        website,
        mpesaNumber,
        bankDetails,
        acceptedPaymentMethods
      } = req.body;

      const updateData = {
        whatsappNumber,
        instagramHandle,
        facebookPage,
        website,
        mpesaNumber,
        bankDetails,
        acceptedPaymentMethods
      };

      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({ message: "Contact information updated successfully", user: userWithoutPassword });
    } catch (error) {
      console.error("Error updating vendor contact information:", error);
      res.status(500).json({ message: "Failed to update contact information" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let products = await storage.getProducts();
      
      // Apply category filter
      if (category && category !== 'all') {
        products = products.filter(p => p.categoryId === category as string);
      }
      
      // Apply search filter
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply featured filter
      if (featured === "true") {
        products = products.filter(p => p.featured);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create new product (vendors only)
  app.post("/api/products", requireRole("vendor"), async (req, res) => {
    try {
      console.log("Creating product with data:", req.body);
      console.log("User:", req.user);
      
      // Ensure vendorId is set to the current user's ID and convert categoryId to string
      const productData = {
        ...req.body,
        vendorId: req.user!.id,
        categoryId: String(req.body.categoryId), // Convert to string
        stock: Number(req.body.stock) || 0, // Ensure stock is a number
        featured: Boolean(req.body.featured) // Ensure featured is boolean
      };
      
      const result = insertProductSchema.safeParse(productData);
      if (!result.success) {
        console.error("Product validation failed:", result.error.errors);
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: result.error.errors 
        });
      }

      const product = await storage.createProduct(result.data);
      console.log("Product created successfully:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product (vendors only)
  app.put("/api/products/:id", requireRole("vendor"), async (req, res) => {
    try {
      const id = req.params.id;

      console.log("Updating product:", id, "with data:", req.body);

      const result = insertProductSchema.partial().safeParse(req.body);
      if (!result.success) {
        console.error("Validation failed:", result.error.errors);
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: result.error.errors 
        });
      }

      // Ensure the product belongs to the current vendor or is admin
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (existingProduct.vendorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }

      const product = await storage.updateProduct(id, result.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      console.log("Product updated successfully:", product);
      res.json(product);
    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product (vendors only, can only delete their own products)
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;

      // Check if product exists and belongs to the current user
      const existingProduct = await storage.getProduct(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Only allow vendors to delete their own products or admins to delete any product
      if (existingProduct.vendorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to delete this product" });
      }

      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart - requires authentication for all operations
  app.get("/api/cart", async (req, res) => {
    try {
      // Require authentication to view cart
      if (!req.user) {
        return res.json([]); // Return empty cart for unauthenticated users
      }

      const sessionId = `user_${req.user.id}`;
      console.log("Cart GET - sessionId:", sessionId, "user:", req.user.id);
      const cartItems = await storage.getCartItems(sessionId);
      console.log("Cart items found:", cartItems.length);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      // Require authentication to add to cart
      if (!req.user) {
        return res.status(401).json({ message: "Please log in to add items to cart" });
      }

      const sessionId = `user_${req.user.id}`;
      console.log("Cart POST - sessionId:", sessionId, "user:", req.user.id, "body:", req.body);
      const validation = insertCartItemSchema.safeParse({
        ...req.body,
        sessionId,
      });

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid cart item data", errors: validation.error.errors });
      }

      const cartItem = await storage.addToCart(validation.data);
      console.log("Cart item added:", cartItem);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Cart POST error:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      // Require authentication to update cart
      if (!req.user) {
        return res.status(401).json({ message: "Please log in to update cart items" });
      }

      const id = req.params.id;
      const { quantity } = req.body;

      const validation = z.object({ quantity: z.number().min(1) }).safeParse({ quantity });
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(id, validation.data.quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      // Require authentication to remove cart items
      if (!req.user) {
        return res.status(401).json({ message: "Please log in to remove cart items" });
      }

      const id = req.params.id;
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      // Require authentication to clear cart
      if (!req.user) {
        return res.status(401).json({ message: "Please log in to clear cart" });
      }

      const sessionId = `user_${req.user.id}`;
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Payment processing
  app.post("/api/process-payment", async (req, res) => {
    try {
      const { items, total, paymentMethod, phoneNumber } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: "No items to process" });
      }

      if (paymentMethod === "mpesa") {
        if (!phoneNumber || phoneNumber.length < 10) {
          return res.status(400).json({ 
            success: false, 
            message: "Valid phone number is required for M-Pesa payments" 
          });
        }

        // Simulate M-Pesa payment processing
        // In production, this would integrate with Safaricom M-Pesa API
        const mpesaResponse = {
          success: true,
          transactionId: `MPesa${Date.now()}`,
          message: "M-Pesa payment initiated successfully",
          amount: total,
          phoneNumber: phoneNumber,
          status: "pending"
        };

        // Clear the cart after successful payment initiation
        const sessionId = req.sessionID || "anonymous";
        await storage.clearCart(sessionId);

        res.json({
          success: true,
          message: "M-Pesa payment initiated. Check your phone for the payment prompt.",
          transaction: mpesaResponse
        });
        
      } else if (paymentMethod === "card") {
        // Simulate card payment processing
        // In production, this would integrate with payment gateway
        const cardResponse = {
          success: true,
          transactionId: `Card${Date.now()}`,
          message: "Card payment processed successfully",
          amount: total,
          status: "completed"
        };

        // Clear the cart after successful payment
        const sessionId = req.sessionID || "anonymous";
        await storage.clearCart(sessionId);

        res.json({
          success: true,
          message: "Payment processed successfully. Thank you for your purchase!",
          transaction: cardResponse
        });
        
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Invalid payment method" 
        });
      }
      
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Payment processing failed. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
