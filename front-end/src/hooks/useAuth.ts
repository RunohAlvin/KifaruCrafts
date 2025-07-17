import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  profileImageUrl: string | null;
  businessName: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  specialties: string | null;
  yearsOfExperience: number | null;
  isVerified: boolean;
  whatsappNumber: string | null;
  instagramHandle: string | null;
  facebookPage: string | null;
  website: string | null;
  mpesaNumber: string | null;
  bankDetails: string | null;
  acceptedPaymentMethods: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function useAuth() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ensure response structure matches what we expect
  const authResponse = response as { user?: User } | undefined;

  return {
    user: authResponse?.user || null,
    isLoading,
    isAuthenticated: !!(authResponse?.user),
    error,
  };
}