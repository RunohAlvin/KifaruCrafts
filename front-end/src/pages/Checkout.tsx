import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useCurrencyStore } from "@/lib/store";
import { formatKESPrice } from "@/lib/currency";
import { Smartphone, CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

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

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { currency } = useCurrencyStore();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest("POST", "/api/process-payment", paymentData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Payment Successful!",
          description: paymentMethod === "mpesa" 
            ? "M-Pesa payment initiated. Check your phone for the payment prompt."
            : "Payment processed successfully. Thank you for your purchase!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
        setIsProcessing(false);
      } else {
        throw new Error(data.message || "Payment failed");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const total = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const handlePayment = async () => {
    if (paymentMethod === "mpesa") {
      if (!phoneNumber || phoneNumber.length < 10) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Kenyan phone number (e.g., 0700123456)",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    
    const paymentData = {
      items: cartItems,
      total: total,
      paymentMethod,
      ...(paymentMethod === "mpesa" && { phoneNumber }),
    };

    processPaymentMutation.mutate(paymentData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-kenyan-dark mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some beautiful Kenyan crafts to your cart first.</p>
        <Link href="/products">
          <Button className="bg-kenyan-orange hover:bg-kenyan-orange/90">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cart">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-kenyan-dark">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatKESPrice(parseFloat(item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-kenyan-orange">{formatKESPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "mpesa"
                      ? "border-kenyan-orange bg-kenyan-orange/5"
                      : "border-gray-200 hover:border-kenyan-orange/50"
                  }`}
                  onClick={() => setPaymentMethod("mpesa")}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">M-Pesa</h3>
                      <p className="text-sm text-gray-600">Pay with your mobile money</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">Recommended</Badge>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-kenyan-orange bg-kenyan-orange/5"
                      : "border-gray-200 hover:border-kenyan-orange/50"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === "mpesa" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0700123456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your M-Pesa registered phone number
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">How M-Pesa payment works:</h4>
                    <ol className="text-sm text-green-700 space-y-1">
                      <li>1. Click "Pay with M-Pesa" below</li>
                      <li>2. You'll receive an SMS with payment prompt</li>
                      <li>3. Enter your M-Pesa PIN to complete payment</li>
                      <li>4. Receive confirmation and order details</li>
                    </ol>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Card payments are processed securely through our payment gateway.
                      You'll be redirected to complete your payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing || processPaymentMutation.isPending}
                className="w-full bg-kenyan-orange hover:bg-kenyan-orange/90 text-white py-3"
                size="lg"
              >
                {isProcessing || processPaymentMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    {paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Pay with Card"} - {formatKESPrice(total)}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our terms and conditions. 
                Your payment is secure and encrypted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}