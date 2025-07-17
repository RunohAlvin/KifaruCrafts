import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import Vendor from "@/pages/Vendor";
import VendorDashboard from "@/pages/VendorDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import Vendors from "@/pages/Vendors";
import VendorProfile from "@/pages/VendorProfile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

// Protected route wrapper for vendors
function ProtectedVendorRoute({ component: Component }: { component: any }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    } else if (!isLoading && isAuthenticated && user?.role !== 'vendor') {
      setLocation('/');
    }
  }, [isAuthenticated, user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-kenyan-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'vendor') {
    return null;
  }

  return <Component />;
}

// Protected route wrapper for customers
function ProtectedCustomerRoute({ component: Component }: { component: any }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-kenyan-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

function Router() {
  // const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/about" component={About} />
      <Route path="/vendor" component={Vendor} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/vendors/:id" component={VendorProfile} />
      <Route path="/vendor-dashboard">
        {() => <ProtectedVendorRoute component={VendorDashboard} />}
      </Route>
      <Route path="/customer-dashboard">
        {() => <ProtectedCustomerRoute component={CustomerDashboard} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
