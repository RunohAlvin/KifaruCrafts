// types.ts

export type Role = "customer" | "vendor";

export interface User {
  _id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  profileImageUrl?: string;

  // Vendor-specific fields
  businessName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  specialties?: string;
  yearsOfExperience?: number;
  isVerified: boolean;

  // Contact information
  whatsappNumber?: string;
  instagramHandle?: string;
  facebookPage?: string;
  website?: string;

  // Payment details
  mpesaNumber?: string;
  bankDetails?: string;
  acceptedPaymentMethods?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser
  extends Omit<User, "_id" | "createdAt" | "updatedAt" | "isVerified"> {
  isVerified?: boolean;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
}

export type InsertCategory = Omit<Category, "_id">;

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: string; // string to avoid float precision issues
  image: string;

  category: string | Category;

  vendorId: string | Vendor;

  featured: boolean;
  badge?: string;
  stock: number;
}

export type InsertProduct = Omit<Product, "_id">;

export interface CartItem {
  _id?: string;
  productId: string;
  quantity: number;
  sessionId: string;
}

export type InsertCartItem = Omit<CartItem, "_id">;

export interface Vendor {
  _id?: string;
  userId: string; // Reference to User
  businessName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  specialties?: string;
  yearsOfExperience?: number;
  isVerified: boolean;

  // Contact information
  whatsappNumber?: string;
  instagramHandle?: string;
  facebookPage?: string;
  website?: string;

  // Payment details
  mpesaNumber?: string;
  bankDetails?: string;
  acceptedPaymentMethods?: string[];

  createdAt: Date;
  updatedAt: Date;
}
