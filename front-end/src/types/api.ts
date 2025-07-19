// API response types that match what the server actually returns

export interface ApiProduct {
  _id?: string;
  id?: string | number;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: {
    _id?: string;
    id?: string;
    name: string;
  };
  categoryId?: string;
  vendor?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
  };
  vendorId?: string;
  featured: boolean;
  badge?: string;
  stock?: number;
}

export interface ApiUser {
  _id?: string;
  id?: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "customer" | "vendor";
  profileImageUrl?: string;
  businessName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  specialties?: string;
  yearsOfExperience?: number;
  isVerified?: boolean;
  whatsappNumber?: string;
  instagramHandle?: string;
  facebookPage?: string;
  website?: string;
  mpesaNumber?: string;
  bankDetails?: string;
  acceptedPaymentMethods?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ApiCategory {
  _id?: string;
  id?: string | number;
  name: string;
  description?: string;
  image?: string;
}
