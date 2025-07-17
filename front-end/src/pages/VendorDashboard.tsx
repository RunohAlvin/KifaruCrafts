import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, Edit, Plus, Package, DollarSign, TrendingUp, Eye, Home, ShoppingBag, 
  BarChart3, Users, Star, AlertCircle, Store, Settings, FileText, Calendar,
  Phone, Globe, MessageCircle, CreditCard, Banknote, Mail
} from "lucide-react";
import { formatKESPrice } from "@/lib/currency";
import { Link } from "wouter";
import type { Product, Category, InsertProduct } from "@shared/schema";

type ProductFormData = InsertProduct;

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'low-stock' | 'high-value'>('all');
  
  // Contact & Payment form state - initialize with empty values, will update from user data
  const [contactData, setContactData] = useState({
    whatsappNumber: "",
    instagramHandle: "",
    facebookPage: "",
    website: "",
    mpesaNumber: "",
    bankDetails: "",
    acceptedPaymentMethods: [] as string[]
  });
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    image: "",
    vendorId: "",
    categoryId: "",
    featured: false,
    badge: "",
    stock: 0,
  });



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { vendorId: user?.id }],
    enabled: !!user && user.role === "vendor",
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Debug categories
  console.log("Categories data:", categories);
  console.log("Categories loading:", categoriesLoading);

  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => {
      console.log("Creating product with data:", data);
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product created successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      console.error("Product creation error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create product",
        variant: "destructive" 
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => {
      return apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product updated successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update product",
        variant: "destructive" 
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete product",
        variant: "destructive" 
      });
    },
  });

  // Contact & Payment mutation
  const updateContactMutation = useMutation({
    mutationFn: (data: typeof contactData) => apiRequest("PUT", "/api/vendor/contact", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Contact information updated",
        description: "Your contact and payment details have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact information",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (!user) return;
    
    const productData = {
      ...data,
      vendorId: user.id,
      price: data.price.toString(),
    };

    if (isEditing && editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      vendorId: product.vendorId,
      categoryId: product.categoryId,
      featured: product.featured || false,
      badge: product.badge,
      stock: product.stock || 0,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      vendorId: user?.id || "",
      categoryId: "",
      featured: false,
      badge: "",
      stock: 0,
    });
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              Vendor access required
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/vendor">Apply as Vendor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 5).length;
  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
  
  // Filter products based on active filter
  const filteredProducts = () => {
    switch (activeFilter) {
      case 'featured':
        return products.filter(p => p.featured);
      case 'low-stock':
        return products.filter(p => (p.stock || 0) < 5);
      case 'high-value':
        return products.filter(p => parseFloat(p.price) > 1000);
      default:
        return products;
    }
  };
  
  const handleFilterChange = (filter: 'all' | 'featured' | 'low-stock' | 'high-value') => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Navigation Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border-b-4 border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-slate-700 rounded-xl">
                <Store className="w-8 h-8 text-slate-200" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
                <p className="text-slate-300 text-sm">
                  Welcome back, {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700 px-4 py-2" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Homepage</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700 px-4 py-2" asChild>
                <Link href="/products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Business Overview</h2>
          <p className="text-slate-600">Track your performance and manage your products</p>
        </div>

        {/* Enhanced Business Metrics - Now Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 shadow-xl' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Total Products</p>
                  <p className="text-4xl font-bold text-blue-900">{totalProducts}</p>
                  <p className="text-xs text-blue-600 mt-1">Active listings</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeFilter === 'featured' 
                ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 shadow-xl' 
                : 'bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleFilterChange('featured')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-1">Featured Items</p>
                  <p className="text-4xl font-bold text-green-900">{featuredProducts}</p>
                  <p className="text-xs text-green-600 mt-1">Promoted products</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeFilter === 'low-stock' 
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 shadow-xl' 
                : 'bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleFilterChange('low-stock')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-700 mb-1">Low Stock Alert</p>
                  <p className="text-4xl font-bold text-amber-900">{lowStockProducts}</p>
                  <p className="text-xs text-amber-600 mt-1">Needs restocking</p>
                </div>
                <div className="p-3 bg-amber-500 rounded-full">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              activeFilter === 'high-value' 
                ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400 shadow-xl' 
                : 'bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleFilterChange('high-value')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">High Value Items</p>
                  <p className="text-4xl font-bold text-purple-900">{formatKESPrice(totalValue.toString())}</p>
                  <p className="text-xs text-purple-600 mt-1">Premium products</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Status */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Showing:</span>
            <Badge variant={activeFilter === 'all' ? 'default' : 'secondary'} className="capitalize">
              {activeFilter === 'all' ? 'All Products' : 
               activeFilter === 'featured' ? 'Featured Items' :
               activeFilter === 'low-stock' ? 'Low Stock Items' :
               'High Value Items'}
            </Badge>
            <span className="text-sm text-slate-500">({filteredProducts().length} items)</span>
          </div>
          {activeFilter !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => handleFilterChange('all')}>
              Clear Filter
            </Button>
          )}
        </div>

        {/* Enhanced Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
          <Tabs defaultValue="products" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full bg-slate-50 rounded-lg p-1 h-14">
              <TabsTrigger value="products" className="flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Package className="w-4 h-4" />
                Product Management
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="w-4 h-4" />
                Business Analytics
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileText className="w-4 h-4" />
                Order Management
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Phone className="w-4 h-4" />
                Contact & Payment
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enhanced Product Form */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-slate-50 to-white border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Plus className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {isEditing ? "Edit Product" : "Add New Product"}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {isEditing ? "Update product information" : "Create a new product listing"}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (KES)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock?.toString() || "0"}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <img 
                              src={formData.image} 
                              alt="Preview" 
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.categoryId || ""}
                        onValueChange={(value) => {
                          console.log("Category selected:", value);
                          setFormData({ ...formData, categoryId: value });
                        }}
                        disabled={categoriesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="empty" disabled>No categories available</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {!categoriesLoading && categories.length === 0 && (
                        <p className="text-sm text-red-600 mt-1">No categories found. Please contact admin.</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="badge">Badge (Optional)</Label>
                      <Input
                        id="badge"
                        value={formData.badge || ""}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
                        placeholder="New, Sale, Limited, etc."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      >
                        {isEditing ? "Update Product" : "Add Product"}
                      </Button>
                      {isEditing && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

                {/* Enhanced Products List */}
                <Card className="lg:col-span-2 bg-white border-0 shadow-lg">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Product Inventory</CardTitle>
                          <CardDescription>
                            {activeFilter === 'all' ? 
                              `${totalProducts} products in your catalog` :
                              `${filteredProducts().length} ${activeFilter === 'featured' ? 'featured' : 
                                activeFilter === 'low-stock' ? 'low stock' : 'high value'} products`
                            }
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="px-3 py-1">
                        {filteredProducts().length} Showing
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                  {productsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-slate-600 border-t-transparent rounded-full" />
                    </div>
                  ) : filteredProducts().length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        {activeFilter === 'all' ? 'No products yet' : 
                         activeFilter === 'featured' ? 'No featured products' :
                         activeFilter === 'low-stock' ? 'No low stock products' :
                         'No high value products'}
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        {activeFilter === 'all' ? 
                          'Start building your product catalog to reach customers and grow your business' :
                          `No products match the ${activeFilter} filter. Try selecting a different filter or add more products.`
                        }
                      </p>
                      <Button 
                        className="bg-slate-600 hover:bg-slate-700"
                        onClick={() => {
                          // Reset form and show the products tab with form open
                          resetForm();
                          setIsEditing(false);
                          // The form is already visible in the products tab
                        }}
                      >
                        Create Your First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredProducts().map((product) => (
                        <div key={product.id} className="group border border-slate-200 rounded-xl p-5 bg-gradient-to-r from-white to-slate-50 hover:shadow-lg hover:border-slate-300 transition-all duration-200">
                          <div className="flex gap-5">
                            <div className="relative">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-xl shadow-sm"
                              />
                              {product.featured && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-slate-900 text-lg mb-1 truncate">{product.name}</h3>
                                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-slate-100 text-slate-700 font-semibold">
                                      {formatKESPrice(product.price)}
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-300">
                                      Stock: {product.stock || 0}
                                    </Badge>
                                    {product.featured && (
                                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                        Featured
                                      </Badge>
                                    )}
                                    {product.badge && (
                                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                        {product.badge}
                                      </Badge>
                                    )}
                                    {(product.stock || 0) < 5 && (
                                      <Badge className="bg-red-100 text-red-700 border-red-200">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Low Stock
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(product)}
                                    className="hover:bg-blue-50 hover:border-blue-300 min-w-fit px-3"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="hover:bg-green-50 hover:border-green-300 min-w-fit px-3"
                                  >
                                    <Link href={`/product/${product.id}`}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      <span className="hidden sm:inline">View</span>
                                    </Link>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteProductMutation.mutate(product.id)}
                                    disabled={deleteProductMutation.isPending}
                                    className="hover:bg-red-50 hover:border-red-300 text-red-600 min-w-fit px-3"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Business Analytics
                </CardTitle>
                <CardDescription>Track your business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-slate-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p>Detailed sales reports and analytics will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Management
                </CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                  <p>Customer orders will appear here when you start making sales</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Payment Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Help customers reach you easily</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={contactData.whatsappNumber}
                      onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input
                      id="instagram"
                      placeholder="@your_handle"
                      value={contactData.instagramHandle}
                      onChange={(e) => setContactData({ ...contactData, instagramHandle: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook">Facebook Page</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/your-page"
                      value={contactData.facebookPage}
                      onChange={(e) => setContactData({ ...contactData, facebookPage: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://your-website.com"
                      value={contactData.website}
                      onChange={(e) => setContactData({ ...contactData, website: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>Set up how customers can pay you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="mpesa">M-Pesa Number</Label>
                    <Input
                      id="mpesa"
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={contactData.mpesaNumber}
                      onChange={(e) => setContactData({ ...contactData, mpesaNumber: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 mt-1">For Kenyan customers using M-Pesa</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="bank">Bank Details</Label>
                    <Textarea
                      id="bank"
                      placeholder="Bank Name, Account Number, Branch (keep sensitive info private)"
                      value={contactData.bankDetails}
                      onChange={(e) => setContactData({ ...contactData, bankDetails: e.target.value })}
                      rows={3}
                    />
                    <p className="text-xs text-slate-500 mt-1">Only share what's necessary for payments</p>
                  </div>
                  
                  <div>
                    <Label>Accepted Payment Methods</Label>
                    <div className="space-y-2 mt-2">
                      {["M-Pesa", "Bank Transfer", "Cash on Delivery", "PayPal", "Credit Card"].map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Checkbox
                            id={method}
                            checked={contactData.acceptedPaymentMethods.includes(method)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setContactData({
                                  ...contactData,
                                  acceptedPaymentMethods: [...contactData.acceptedPaymentMethods, method]
                                });
                              } else {
                                setContactData({
                                  ...contactData,
                                  acceptedPaymentMethods: contactData.acceptedPaymentMethods.filter(m => m !== method)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={method} className="text-sm font-normal">{method}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-slate-600 hover:bg-slate-700"
                    onClick={() => updateContactMutation.mutate(contactData)}
                    disabled={updateContactMutation.isPending}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {updateContactMutation.isPending ? "Saving..." : "Save Payment Information"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}