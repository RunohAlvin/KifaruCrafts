import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Award, Users, Package } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

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

export default function Vendors() {
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["/api/vendors"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl("/api/vendors"));
      if (!response.ok) throw new Error("Failed to fetch vendors");
      return response.json();
    },
  });

  const getInitials = (
    firstName: string | null,
    lastName: string | null,
    businessName: string | null
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (businessName) {
      return businessName.slice(0, 2).toUpperCase();
    }
    return "V";
  };

  const getDisplayName = (vendor: Vendor) => {
    return (
      vendor.businessName ||
      `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() ||
      "Vendor"
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Meet Our Artisans
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the talented craftspeople behind every handmade treasure.
          Each artisan brings generations of skill, cultural heritage, and
          passionate creativity to their craft.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {vendors.length} Verified Artisans
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Authentic Craftsmanship
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Fair Trade Practices
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor: Vendor) => {
            const displayName = getDisplayName(vendor);
            return (
              <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="w-20 h-20 group-hover:scale-105 transition-transform duration-300">
                        <AvatarImage
                          src={vendor.profileImageUrl || undefined}
                          alt={displayName}
                        />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
                          {getInitials(
                            vendor.firstName,
                            vendor.lastName,
                            vendor.businessName
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-xl text-center group-hover:text-orange-600 transition-colors">
                          {displayName}
                        </CardTitle>
                        {vendor.isVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 px-2 py-1"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            <span className="text-xs">Verified</span>
                          </Badge>
                        )}
                      </div>

                      {vendor.location && (
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {vendor.location}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {vendor.specialties && (
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {vendor.specialties
                          .split(",")
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty.trim()}
                            </Badge>
                          ))}
                        {vendor.specialties.split(",").length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.specialties.split(",").length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {vendor.bio && (
                      <CardDescription className="text-center text-sm line-clamp-3 leading-relaxed">
                        {vendor.bio}
                      </CardDescription>
                    )}

                    {vendor.yearsOfExperience && (
                      <div className="mt-4 text-center">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          {vendor.yearsOfExperience} years experience
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Vendors Found</h3>
          <p className="text-gray-600">
            We're currently onboarding talented artisans. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
