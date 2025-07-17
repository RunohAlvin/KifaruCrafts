import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getPriceWithConversion, formatKESPrice } from "@/lib/currency";
import { useCurrencyStore } from "@/lib/store";

interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    stock: number;
  };
}

export default function Cart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currency: userCurrency } = useCurrencyStore();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiRequest("PUT", `/api/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/cart"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const removeItem = (id: number) => {
    removeItemMutation.mutate(id);
  };

  const getTotalPrice = () => {
    if (!cartItems) return 0;
    return cartItems
      .reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
  };

  const getTotalItems = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kenyan-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 rounded mb-6 w-48"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-300 h-16 w-16 rounded"></div>
                    <div className="flex-1">
                      <div className="bg-gray-300 h-4 rounded mb-2"></div>
                      <div className="bg-gray-300 h-3 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-kenyan-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-8">
            Shopping Cart
          </h1>
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some beautiful Kenyan crafts to get started!</p>
              <Link href="/products">
                <Button className="bg-kenyan-orange hover:bg-kenyan-red">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kenyan-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark">
            Shopping Cart ({getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""})
          </h1>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={() => clearCartMutation.mutate()}
              disabled={clearCartMutation.isPending}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {/* Currency Information Banner */}
        <div className="bg-kenyan-orange/10 border border-kenyan-orange/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center text-sm text-kenyan-dark">
            <span className="font-medium">💰 All prices shown in Kenyan Shillings (KES)</span>
            {userCurrency !== 'KES' && (
              <span className="ml-2 text-gray-600">
                • Converted to {userCurrency} where applicable
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Link href={`/product/${item.product.id}`}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg shadow hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-lg text-kenyan-dark hover:text-kenyan-orange transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-kenyan-orange font-bold text-lg">
                        {formatKESPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || updateQuantityMutation.isPending}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={removeItemMutation.isPending}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="font-cultural text-xl text-kenyan-dark">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatKESPrice(getTotalPrice().toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-kenyan-green">
                    {getTotalPrice() >= 2500 ? "Free" : formatKESPrice("500")}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-kenyan-orange">
                    {formatKESPrice((getTotalPrice() >= 2500 
                      ? getTotalPrice() 
                      : getTotalPrice() + 500
                    ).toString())}
                  </span>
                </div>
                
                {getTotalPrice() < 2500 && (
                  <p className="text-sm text-gray-600">
                    Add {formatKESPrice((2500 - getTotalPrice()).toString())} more for free shipping!
                  </p>
                )}

                <Link href="/checkout">
                  <Button className="w-full bg-kenyan-orange hover:bg-kenyan-red text-white py-3 text-lg font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center">
                  <Link href="/products">
                    <Button variant="outline" className="text-kenyan-dark border-kenyan-dark hover:bg-kenyan-beige">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
