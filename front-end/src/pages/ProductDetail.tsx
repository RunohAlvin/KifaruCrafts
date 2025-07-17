import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { getPriceWithConversion } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/store";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const productId = params?.id;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currency: userCurrency } = useCurrencyStore();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const addToCartMutation = useMutation({
    mutationFn: (quantity: number) =>
      apiRequest("POST", "/api/cart", { productId: parseInt(productId!), quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
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

  const handleAddToCart = () => {
    addToCartMutation.mutate(1);
  };

  if (!match) {
    return <div>Page not found</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kenyan-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div>
                <div className="bg-gray-300 h-8 rounded mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-4 w-3/4"></div>
                <div className="bg-gray-300 h-10 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-kenyan-beige flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button className="bg-kenyan-orange hover:bg-kenyan-red">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kenyan-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="text-kenyan-dark hover:text-kenyan-orange">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
            />
            {product.badge && (
              <Badge
                className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                  product.badge === "Featured"
                    ? "bg-kenyan-orange"
                    : product.badge === "New"
                    ? "bg-kenyan-green"
                    : product.badge === "Limited"
                    ? "bg-kenyan-red"
                    : "bg-gray-500"
                }`}
              >
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div>
                {(() => {
                  const priceDisplay = getPriceWithConversion(product.price, userCurrency);
                  return priceDisplay.secondary ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <span className="text-3xl font-bold text-kenyan-orange">{priceDisplay.primary}</span>
                          <div className="text-sm text-gray-500">{priceDisplay.secondary}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Original price in Kenyan Shillings: {priceDisplay.secondary}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-3xl font-bold text-kenyan-orange">{priceDisplay.primary}</span>
                  );
                })()}
                <div className="text-sm text-gray-500 mt-1">
                  {(product.stock || 0) > 0 ? (
                    <span className="text-kenyan-green">In stock ({product.stock || 0} available)</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
                className="w-full bg-kenyan-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-kenyan-red transition-colors disabled:opacity-50 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending
                  ? "Adding to Cart..."
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <i className="fas fa-shipping-fast text-kenyan-orange text-2xl mb-2"></i>
                  <div className="text-sm font-semibold">Free Shipping</div>
                  <div className="text-xs text-gray-500">On orders over $50</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <i className="fas fa-heart text-kenyan-orange text-2xl mb-2"></i>
                  <div className="text-sm font-semibold">Handcrafted</div>
                  <div className="text-xs text-gray-500">By skilled artisans</div>
                </div>
              </div>
            </div>

            {/* Cultural Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-3">
                  Cultural Heritage
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This beautiful piece represents the rich cultural heritage of Kenya. Each item is carefully handcrafted using traditional techniques passed down through generations, ensuring that every piece is unique and carries the spirit of Kenyan artistry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
