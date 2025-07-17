import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Star, Calendar, Award, Mail } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { formatKESPrice } from "@/lib/currency";

interface Vendor {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  specialties: string | null;
  yearsOfExperience: number | null;
  isVerified: boolean;
  profileImageUrl: string | null;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: number;
  vendorId: number;
  featured: boolean;
  badge: string | null;
  stock: number;
}

export default function VendorProfile() {
  const [match, params] = useRoute("/vendors/:id");
  const vendorId = params?.id ? parseInt(params.id) : 0;

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ["/api/vendors", vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error("Failed to fetch vendor");
      return response.json();
    },
    enabled: !!vendorId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/vendors", vendorId, "products"],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${vendorId}/products`);
      if (!response.ok) throw new Error("Failed to fetch vendor products");
      return response.json();
    },
    enabled: !!vendorId,
  });

  if (vendorLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
      </div>
    );
  }

  const getInitials = (firstName: string | null, lastName: string | null, businessName: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (businessName) {
      return businessName.slice(0, 2).toUpperCase();
    }
    return "V";
  };

  const displayName = vendor.businessName || `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || "Vendor";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vendor Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={vendor.profileImageUrl || undefined} alt={displayName} />
              <AvatarFallback className="text-2xl">
                {getInitials(vendor.firstName, vendor.lastName, vendor.businessName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-3xl">{displayName}</CardTitle>
                  {vendor.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                      <Award className="w-3 h-3 mr-2" />
                      <span className="text-sm font-medium">Verified Artisan</span>
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {vendor.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {vendor.location}
                    </div>
                  )}
                  {vendor.phone && (
                    <a 
                      href={`tel:${vendor.phone}`}
                      className="flex items-center gap-1 text-kenyan-orange hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a 
                      href={`mailto:${vendor.email}`}
                      className="flex items-center gap-1 text-kenyan-orange hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      {vendor.email}
                    </a>
                  )}
                  {vendor.yearsOfExperience && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {vendor.yearsOfExperience} years experience
                    </div>
                  )}
                </div>

                {vendor.specialties && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vendor.specialties.split(',').map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {specialty.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {vendor.bio && (
                <CardDescription className="text-base leading-relaxed max-w-3xl">
                  {vendor.bio}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Products by {displayName}</h2>
          <Badge variant="secondary" className="text-sm">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </Badge>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 mb-4">No products available from this vendor yet.</p>
              <p className="text-sm text-gray-500">Check back soon for new items!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}