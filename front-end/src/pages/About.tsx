import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-kenyan-beige">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-kenyan-earth to-kenyan-brown text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0"
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-cultural text-4xl md:text-6xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Preserving Kenya's rich cultural heritage through authentic handcrafted treasures
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kifaru Crafts was born from a deep appreciation for Kenya's incredible artistic heritage. We believe that every handcrafted piece tells a story—of the artisan who made it, the community they represent, and the generations of knowledge passed down through time.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to create a bridge between these talented artisans and the global community, ensuring that traditional crafting techniques are preserved while providing sustainable livelihoods for our craftspeople.
              </p>
              <Link href="/products">
                <Button className="bg-kenyan-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-kenyan-red transition-colors">
                  Explore Our Collection
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578319439584-104c94d37305?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Traditional Kenyan pottery making"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <i className="fas fa-heart text-kenyan-orange text-4xl mb-4"></i>
                <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-4">
                  Authenticity
                </h3>
                <p className="text-gray-600">
                  Every piece is genuinely handcrafted using traditional techniques, ensuring authentic cultural representation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <i className="fas fa-handshake text-kenyan-orange text-4xl mb-4"></i>
                <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-4">
                  Fair Trade
                </h3>
                <p className="text-gray-600">
                  We ensure our artisans receive fair compensation for their skills and dedication to their craft.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <i className="fas fa-leaf text-kenyan-orange text-4xl mb-4"></i>
                <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-4">
                  Sustainability
                </h3>
                <p className="text-gray-600">
                  We promote environmentally conscious practices and the use of sustainable materials.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Artisans Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-4">
              Meet Our Artisans
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our network spans across Kenya, working with skilled craftspeople from various communities, each bringing their unique cultural perspective and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Maasai artisan"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-cultural text-lg font-semibold text-kenyan-dark mb-2">
                  Maasai Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Renowned for their intricate beadwork and vibrant jewelry, representing centuries of cultural tradition.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Kikuyu woodcarver"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-cultural text-lg font-semibold text-kenyan-dark mb-2">
                  Kikuyu Woodcarvers
                </h3>
                <p className="text-gray-600 text-sm">
                  Master craftsmen specializing in detailed wood sculptures and functional art pieces from indigenous trees.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                  alt="Basket weaver"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-cultural text-lg font-semibold text-kenyan-dark mb-2">
                  Sisal Weavers
                </h3>
                <p className="text-gray-600 text-sm">
                  Skilled in creating beautiful, functional baskets and containers using traditional weaving techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600">
              Together, we're making a difference in communities across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-kenyan-orange mb-2">50+</div>
              <div className="text-gray-600">Master Artisans</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kenyan-orange mb-2">12</div>
              <div className="text-gray-600">Communities Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kenyan-orange mb-2">500+</div>
              <div className="text-gray-600">Families Empowered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-kenyan-orange mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Every purchase supports our artisans and helps preserve Kenya's rich cultural heritage for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-kenyan-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-kenyan-red transition-colors">
                Shop Our Collection
              </Button>
            </Link>
            <Button variant="outline" className="border-kenyan-dark text-kenyan-dark px-8 py-3 rounded-lg font-semibold hover:bg-kenyan-beige transition-colors">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
