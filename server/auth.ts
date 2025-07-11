import session from "express-session";
import MongoStore from "connect-mongo";
import MemoryStore from "memorystore";
import type { Express, RequestHandler } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
        profileImageUrl: string | null;
        businessName?: string | null;
        bio?: string | null;
        location?: string | null;
        phone?: string | null;
        specialties?: string | null;
        yearsOfExperience?: number | null;
        isVerified?: boolean;
        whatsappNumber?: string | null;
        instagramHandle?: string | null;
        facebookPage?: string | null;
        website?: string | null;
        mpesaNumber?: string | null;
        bankDetails?: string | null;
        acceptedPaymentMethods?: string[] | null;
        createdAt: Date | null;
        updatedAt: Date | null;
      };
    }
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use same MongoDB URI logic as db.ts
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kifaru-crafts';
  
  // Use memory store for development
  console.log('🔧 Using memory store for sessions (development mode)');
  const MemStore = MemoryStore(session);
  const store = new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "kifaru-crafts-secret-key-development-only",
    resave: false,
    saveUninitialized: false,
    name: 'kifaru.sid',
    store,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
      sameSite: 'lax',
      path: '/'
    }
  });
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const requireRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (req.session.userRole !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export const attachUser: RequestHandler = async (req, res, next) => {
  if (req.session?.userId) {
    const { storage } = await import("./storage");
    const user = await storage.getUser(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
};