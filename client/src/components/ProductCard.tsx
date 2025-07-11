import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getPriceWithConversion } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/store";
import type { Product } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { User, ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currency: userCurrency } = useCurrencyStore();

  // Fetch vendor information for this product
  const { data: vendor } = useQuery({
    queryKey: ["/api/vendors", product.vendorId],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${product.vendorId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!product.vendorId,
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest("POST", "/api/cart", { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error: any) => {
      if (error.message.includes("401")) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to your cart.",
          variant: "destructive",
        });
        // Redirect to login after short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate(product.id);
  };

  const priceDisplay = getPriceWithConversion(product.price, userCurrency);

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl hover-float transition-all duration-300 border-0 kenyan-card">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        {product.badge && (
          <Badge
            className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
              product.badge === "Featured"
                ? "bg-kenyan-orange shadow-kenyan"
                : product.badge === "New"
                ? "bg-kenyan-green"
                : product.badge === "Limited"
                ? "bg-kenyan-red pulse-kenyan"
                : "bg-gray-500"
            }`}
          >
            {product.badge}
          </Badge>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3 w-8 h-8 bg-kenyan-gold rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm">⭐</span>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-kenyan-dark mb-2 hover:text-kenyan-orange transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Vendor Information */}
        {vendor && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <Link href={`/vendors/${vendor.id}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-kenyan-orange transition-colors group">
              <User className="w-3 h-3" />
              <span className="font-medium">
                By {vendor.businessName || `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim()}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            {vendor.location && (
              <p className="text-xs text-gray-500 mt-1 ml-5">{vendor.location}</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {priceDisplay.secondary ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <span className="text-xl font-bold text-kenyan-orange">{priceDisplay.primary}</span>
                    <div className="text-xs text-gray-500">{priceDisplay.secondary}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Original price in Kenyan Shillings: {priceDisplay.secondary}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="text-xl font-bold text-kenyan-orange">{priceDisplay.primary}</span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.stock === 0}
            className="bg-kenyan-orange text-white px-4 py-2 rounded-xl hover:bg-kenyan-red transition-all duration-300 disabled:opacity-50 min-w-fit text-sm font-bold btn-glow shadow-lg hover:shadow-kenyan transform hover:scale-105"
            size="sm"
          >
            {addToCartMutation.isPending
              ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </div>
              )
              : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
