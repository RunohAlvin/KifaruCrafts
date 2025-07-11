import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ShoppingCart, Menu, X, Home, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CurrencySelector from "@/components/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((state) => state.cartCount);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
  });

  // Update cart count when cart items change
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      useCartStore.getState().updateCartCount(totalItems);
    }
  }, [cartItems]);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      // Clear all authentication-related queries
      queryClient.removeQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries();
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out.",
        variant: "destructive",
      });
    },
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "All Products", href: "/products" },
    { name: "Artisans", href: "/vendors" },
    { name: "Crafts", href: "/products?category=1" },
    { name: "Textiles", href: "/products?category=2" },
    { name: "Jewelry", href: "/products?category=3" },
    { name: "Art", href: "/products?category=4" },
    { name: "About", href: "/about" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Positioned on left with more spacing */}
          <div className="flex items-center min-w-0 flex-1">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <i className="fas fa-elephant text-kenyan-orange text-3xl mr-3 group-hover:text-kenyan-red transition-colors duration-300"></i>
              <h1 className="font-cultural text-2xl md:text-3xl font-bold text-kenyan-dark group-hover:text-kenyan-orange transition-colors duration-300">
                Kifaru Crafts
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-baseline space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md relative overflow-hidden ${
                    location === item.href
                      ? "text-kenyan-orange bg-kenyan-orange bg-opacity-10"
                      : "text-kenyan-dark hover:text-kenyan-orange hover:bg-kenyan-orange hover:bg-opacity-5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Cart - Right aligned */}
          <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
            {/* Home Icon for easy navigation */}
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-kenyan-orange hover:bg-opacity-10 hover:text-kenyan-orange transition-colors"
                title="Go to Homepage"
              >
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            {isAuthenticated && (
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kenyan-orange"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
            )}
            
            <CurrencySelector compact />
            
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative p-2 text-kenyan-dark hover:text-kenyan-orange">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-kenyan-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Authentication UI */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 text-kenyan-dark hover:text-kenyan-orange">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-kenyan-orange capitalize">{user?.role}</p>
                  </div>
                  {user?.role === "vendor" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/vendor-dashboard" className="w-full cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Vendor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href="/customer-dashboard" className="w-full cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-kenyan-dark hover:text-kenyan-orange">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-kenyan-orange hover:bg-kenyan-red text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-kenyan-dark hover:text-kenyan-orange"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    location === item.href
                      ? "text-kenyan-orange"
                      : "text-kenyan-dark hover:text-kenyan-orange"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <form onSubmit={handleSearch} className="px-3 py-2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </form>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
