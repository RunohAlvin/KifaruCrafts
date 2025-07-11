import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Parse URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const search = urlParams.get("search");

    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const productsQuery = () => {
    let queryString = "/api/products";
    const params = new URLSearchParams();

    if (selectedCategory && selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    if (featuredOnly) {
      params.append("featured", "true");
    }

    if (params.toString()) {
      queryString += "?" + params.toString();
    }

    return queryString;
  };

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [productsQuery()],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.append("category", selectedCategory);
    }
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    window.history.pushState({}, "", newUrl);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    
    const params = new URLSearchParams();
    if (value !== "all") {
      params.append("category", value);
    }
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    window.history.pushState({}, "", newUrl);
  };

  const selectedCategoryName = categories?.find(cat => cat.id.toString() === selectedCategory)?.name || "All Products";

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenyan-beige via-white to-kenyan-beige hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-kenyan-orange/10 backdrop-blur-sm rounded-full text-kenyan-orange font-semibold text-sm border border-kenyan-orange/20">
              🏺 Handcrafted with Love
            </span>
          </div>
          <h1 className="font-cultural text-4xl md:text-6xl font-bold text-kenyan-dark mb-6 slide-up text-shadow">
            {searchQuery ? (
              <>
                Search Results for{" "}
                <span className="bg-gradient-to-r from-kenyan-orange to-kenyan-gold bg-clip-text text-transparent">
                  "{searchQuery}"
                </span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-kenyan-orange to-kenyan-gold bg-clip-text text-transparent">
                {selectedCategoryName}
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed fade-in">
            Discover authentic Kenyan crafts made by skilled artisans with centuries of cultural tradition
          </p>
        </div>

        {/* Enhanced Category Navigation - Primary Focus */}
        <div className="mb-12 space-y-8">
          {/* Category Buttons - Made More Prominent */}
          {categories && (
            <div className="mb-8">
              <h3 className="text-2xl font-cultural font-bold text-kenyan-dark mb-6 text-center">Shop by Category</h3>
              <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
                <Button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    selectedCategory === "all" 
                      ? "bg-kenyan-dark text-white shadow-xl ring-2 ring-kenyan-orange" 
                      : "bg-white/90 backdrop-blur-sm text-kenyan-dark border-2 border-kenyan-orange/30 hover:bg-kenyan-orange hover:text-white"
                  }`}
                >
                  🏺 All Crafts
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id.toString())}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      selectedCategory === category.id.toString()
                        ? "bg-kenyan-orange text-white shadow-xl ring-2 ring-kenyan-gold" 
                        : "bg-white/90 backdrop-blur-sm text-kenyan-dark border-2 border-kenyan-orange/30 hover:bg-kenyan-orange hover:text-white"
                    }`}
                  >
                    {category.name === "Jewelry & Beadwork" ? "💎 Jewelry & Beadwork" : 
                     category.name === "Traditional Crafts" ? "🎨 Traditional Crafts" :
                     category.name === "Textiles & Fabrics" ? "🧵 Textiles & Fabrics" :
                     category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters - Secondary */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto">
              {/* Featured filter on the left */}
              <Button
                variant={featuredOnly ? "default" : "outline"}
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  featuredOnly 
                    ? "bg-kenyan-gold text-kenyan-dark shadow-lg hover:shadow-xl" 
                    : "border border-kenyan-orange text-kenyan-orange hover:bg-kenyan-orange hover:text-white"
                }`}
              >
                ⭐ Featured Only
              </Button>

              {/* Search moved to right side */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Search crafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-20 py-2.5 text-sm bg-white/80 backdrop-blur-sm border border-kenyan-orange/20 shadow-md rounded-xl focus:ring-2 focus:ring-kenyan-orange/30 transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-kenyan-orange/60 group-focus-within:text-kenyan-orange transition-colors" />
                  <Button 
                    type="submit" 
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-kenyan-orange hover:bg-kenyan-red text-white px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-xs"
                  >
                    Go
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Enhanced Category Visual Cards - Only when no search query */}
        {categories && !searchQuery && selectedCategory === "all" && (
          <div className="mb-12">
            <h3 className="text-2xl font-cultural font-bold text-kenyan-dark mb-8 text-center">Explore Our Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover-float kenyan-card hover:shadow-xl"
                  onClick={() => handleCategoryChange(category.id.toString())}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h4 className="text-xl font-cultural font-bold text-white mb-2 text-shadow">
                      {category.name === "Jewelry & Beadwork" ? "💎 Jewelry & Beadwork" : 
                       category.name === "Traditional Crafts" ? "🎨 Traditional Crafts" :
                       category.name === "Textiles & Fabrics" ? "🧵 Textiles & Fabrics" :
                       category.name}
                    </h4>
                    <p className="text-sm text-white/90 leading-relaxed">{category.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-kenyan-orange/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load products. Please try again.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="kenyan-card rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-64 shimmer"></div>
                  <div className="p-6">
                    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 rounded-lg mb-3 shimmer"></div>
                    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded mb-3 shimmer"></div>
                    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-5 rounded w-24 shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-kenyan-orange/10 backdrop-blur-sm rounded-full text-kenyan-orange font-semibold border border-kenyan-orange/20">
                ✨ Showing {products.length} beautiful craft{products.length !== 1 ? "s" : ""} ✨
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-scale-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 bg-kenyan-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <div className="text-gray-500 text-2xl font-cultural mb-4">No crafts found</div>
              <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                Try adjusting your search terms or explore our beautiful categories below
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                window.history.pushState({}, "", "/products");
              }}
              className="bg-kenyan-orange hover:bg-kenyan-red text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg btn-glow"
            >
              🏺 Explore All Crafts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
