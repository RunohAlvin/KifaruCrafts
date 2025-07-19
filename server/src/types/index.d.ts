/// <reference types="express-session" />

declare global {
  namespace Express {
    interface SessionData {
      userId?: string;
      userRole?: string;
    }
  }
}

export {};
