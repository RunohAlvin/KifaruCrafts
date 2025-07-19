import express from "express";
import CartItem from "../models/Cart";
import Product from "../models/Product";
import { z } from "zod";

const router = express.Router();

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});

// Helper function to get cart identifier
const getCartIdentifier = (req: express.Request) => {
  if ((req.session as any).userId) {
    return { user: (req.session as any).userId };
  } else {
    if (!(req.session as any).cartId) {
      (req.session as any).cartId = `cart_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
    return { sessionId: (req.session as any).cartId };
  }
};

// Get cart items
router.get("/", async (req, res) => {
  try {
    const cartIdentifier = getCartIdentifier(req);

    const cartItems = await CartItem.find(cartIdentifier)
      .populate("product", "name price image stock")
      .sort({ createdAt: -1 });

    res.json(cartItems);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const validatedData = addToCartSchema.parse(req.body);
    const cartIdentifier = getCartIdentifier(req);

    // Check if product exists and is active
    const product = await Product.findOne({
      _id: validatedData.productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (product.stock < validatedData.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      ...cartIdentifier,
      product: validatedData.productId,
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += validatedData.quantity;

      // Check stock again
      if (product.stock < existingItem.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      await existingItem.save();
      await existingItem.populate("product", "name price image stock");

      return res.json(existingItem);
    }

    // Create new cart item
    const cartItem = new CartItem({
      ...cartIdentifier,
      product: validatedData.productId,
      quantity: validatedData.quantity,
      priceAtTime: product.price,
    });

    await cartItem.save();
    await cartItem.populate("product", "name price image stock");

    res.status(201).json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.issues });
    }
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update cart item quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartIdentifier = getCartIdentifier(req);

    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      ...cartIdentifier,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    await cartItem.populate("product", "name price image stock");

    res.json(cartItem);
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
  try {
    const cartIdentifier = getCartIdentifier(req);

    const cartItem = await CartItem.findOneAndDelete({
      _id: req.params.id,
      ...cartIdentifier,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear cart
router.delete("/", async (req, res) => {
  try {
    const cartIdentifier = getCartIdentifier(req);

    await CartItem.deleteMany(cartIdentifier);

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
