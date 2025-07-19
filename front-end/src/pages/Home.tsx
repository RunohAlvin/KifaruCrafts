import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import type { Product, Category } from "@shared/schema";

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products?featured=true"],
  });

  return (
    <div className="bg-kenyan-beige">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kenyan-orange via-kenyan-red to-kenyan-earth text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0"
        ></div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-kenyan-gold opacity-15 rounded-full blur-xl animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-kenyan-orange opacity-20 rounded-full blur-lg animate-bounce hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-kenyan-gold bg-opacity-20 rounded-full text-kenyan-beige font-semibold text-sm backdrop-blur-sm border border-kenyan-gold border-opacity-30">
                <i className="fas fa-star mr-2"></i>
                Authentic • Handcrafted • Fair Trade
              </span>
            </div>

            <h1 className="font-cultural text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Kifaru Crafts
              <span className="block text-3xl md:text-4xl mt-2 text-kenyan-beige opacity-90">
                Where Heritage Meets Art
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed opacity-95">
              Connect with Kenya's finest artisans and discover one-of-a-kind
              treasures that carry the soul of our rich cultural heritage. Every
              purchase supports local communities and preserves ancient crafting
              traditions.
            </p>

            {/* User Role Selection */}
            <div className="mb-8">
              <p className="text-lg mb-4 opacity-90">Choose your journey:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Link href="/products">
                  <Button className="w-full sm:w-auto bg-white text-kenyan-orange px-8 py-4 rounded-lg font-semibold hover:bg-kenyan-beige transition-all duration-300 transform hover:scale-105 shadow-lg btn-glow hover:shadow-kenyan-orange/25">
                    <i className="fas fa-shopping-bag mr-3"></i>
                    Shop as a Buyer
                  </Button>
                </Link>
                <Link href="/vendor">
                  <Button className="w-full sm:w-auto bg-kenyan-gold text-kenyan-dark px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg btn-glow hover:shadow-kenyan-gold/25">
                    <i className="fas fa-hammer mr-3"></i>
                    Join as Vendor
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/about">
                <Button className="bg-kenyan-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg btn-glow hover:shadow-kenyan-red/25">
                  <i className="fas fa-heart mr-2"></i>
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-white text-2xl opacity-70"></i>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-kenyan-orange opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-kenyan-gold opacity-5 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 bg-kenyan-orange bg-opacity-10 rounded-full text-kenyan-orange font-semibold text-sm mb-4">
              <i className="fas fa-award mr-2"></i>
              Why Choose Kifaru Crafts
            </span>
            <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-4">
              Authentic • Sustainable • Community-Driven
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              More than just shopping - join a movement that preserves cultural
              heritage and empowers artisan communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            <div className="text-center group transform transition-all duration-300 hover:scale-105 px-6 py-8 rounded-xl hover:bg-gray-50">
              <div className="w-20 h-20 bg-kenyan-orange bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kenyan-orange group-hover:bg-opacity-20 transition-colors">
                <i className="fas fa-certificate text-kenyan-orange text-3xl"></i>
              </div>
              <h3 className="font-cultural text-2xl font-semibold text-kenyan-dark mb-4">
                100% Authentic
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Every piece verified by cultural experts and master artisans
              </p>
            </div>

            <div className="text-center group transform transition-all duration-300 hover:scale-105 px-6 py-8 rounded-xl hover:bg-gray-50">
              <div className="w-20 h-20 bg-kenyan-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kenyan-gold group-hover:bg-opacity-20 transition-colors">
                <i className="fas fa-shipping-fast text-kenyan-gold text-3xl"></i>
              </div>
              <h3 className="font-cultural text-2xl font-semibold text-kenyan-dark mb-4">
                Global Shipping
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Secure worldwide delivery with tracking and insurance
              </p>
            </div>

            <div className="text-center group transform transition-all duration-300 hover:scale-105 px-6 py-8 rounded-xl hover:bg-gray-50">
              <div className="w-20 h-20 bg-kenyan-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-kenyan-green group-hover:bg-opacity-20 transition-colors">
                <i className="fas fa-seedling text-kenyan-green text-3xl"></i>
              </div>
              <h3 className="font-cultural text-2xl font-semibold text-kenyan-dark mb-4">
                Fair Trade
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Direct support to artisans with transparent pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-gradient-to-b from-kenyan-beige to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cultural text-4xl md:text-5xl font-bold text-kenyan-dark mb-6">
              Discover Our Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore authentic Kenyan crafts, each category representing
              centuries of cultural tradition and artistic mastery.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {categories?.map((category, index) => (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/products?category=${category.id}`}>
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={category.image || ""}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 bg-kenyan-orange opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>

                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="font-cultural text-2xl font-bold mb-2 group-hover:text-kenyan-beige transition-colors leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      <div className="absolute top-6 right-6 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                        <i className="fas fa-arrow-right text-white text-base"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-kenyan-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cultural text-4xl md:text-5xl font-bold text-kenyan-dark mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked selection of our most popular items, crafted by master
              artisans across Kenya.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-lg">
                    <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="bg-gray-300 h-4 rounded mb-2"></div>
                      <div className="bg-gray-300 h-3 rounded mb-3"></div>
                      <div className="bg-gray-300 h-4 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {featuredProducts?.map((product) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/products">
              <Button className="bg-kenyan-orange text-white px-10 py-4 rounded-xl font-semibold hover:bg-kenyan-red transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cultural Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:pr-8">
              <h2 className="font-cultural text-4xl md:text-5xl font-bold text-kenyan-dark mb-8">
                Our Cultural Heritage
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Each piece in our collection represents generations of cultural
                knowledge passed down through families of skilled artisans. From
                the intricate beadwork of the Maasai to the masterful wood
                carvings of the Kikuyu, every item tells a story of Kenya's rich
                cultural tapestry.
              </p>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                By purchasing from Kifaru Crafts, you're not just acquiring
                beautiful handmade items – you're supporting local communities,
                preserving traditional techniques, and keeping Kenya's cultural
                heritage alive for future generations.
              </p>
              <Link href="/about">
                <Button className="bg-kenyan-orange text-white px-10 py-4 rounded-xl font-semibold hover:bg-kenyan-red transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
                  Meet Our Artisans
                </Button>
              </Link>
            </div>
            <div className="relative lg:pl-8">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Kenyan artisan crafting traditional items"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-kenyan-orange to-kenyan-red text-white px-8 py-6 rounded-xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-base font-semibold">Master Artisans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-kenyan-orange to-kenyan-red text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cultural text-4xl md:text-5xl font-bold mb-6">
            Stay Connected
          </h2>
          <p className="text-2xl mb-12 leading-relaxed">
            Get updates on new arrivals, artisan stories, and exclusive cultural
            insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-lg"
            />
            <Button
              type="submit"
              className="bg-white text-kenyan-orange px-8 py-4 rounded-xl font-semibold hover:bg-kenyan-beige transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
