import { z } from "zod";

// MongoDB User Schema
export const userSchema = z.object({
  id: z.string().optional(), // Use 'id' instead of '_id' for consistency
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(["customer", "vendor"]).default("customer"),
  profileImageUrl: z.string().optional(),
  
  // Vendor-specific fields
  businessName: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  specialties: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  isVerified: z.boolean().default(false),
  
  // Contact information
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
  facebookPage: z.string().optional(),
  website: z.string().optional(),
  
  // Payment details
  mpesaNumber: z.string().optional(),
  bankDetails: z.string().optional(),
  acceptedPaymentMethods: z.array(z.string()).optional(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// MongoDB Category Schema
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

// MongoDB Product Schema
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1, "Product price is required"), // Store as string to avoid floating point issues
  image: z.string().min(1, "Product image is required"),
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string(),
  featured: z.boolean().default(false),
  badge: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(0),
});

// MongoDB Cart Item Schema
export const cartItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number().default(1),
  sessionId: z.string(),
});

// Insert schemas (omitting auto-generated fields)
export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUserSchema = insertUserSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["customer", "vendor"]),
});

export const insertCategorySchema = categorySchema.omit({
  id: true,
});

export const insertProductSchema = productSchema.omit({
  id: true,
});

export const insertCartItemSchema = cartItemSchema.omit({
  id: true,
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;