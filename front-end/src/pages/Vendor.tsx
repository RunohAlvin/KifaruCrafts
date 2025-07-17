import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Vendor() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-kenyan-beige">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-kenyan-earth to-kenyan-brown text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0"
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-cultural text-4xl md:text-6xl font-bold mb-6">
              Join Our Artisan Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Share your craft with the world. Connect with global customers who value authentic Kenyan artistry.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-12 bg-white rounded-lg shadow-lg p-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview" ? "bg-kenyan-orange text-white" : "text-kenyan-dark"}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "benefits" ? "default" : "ghost"}
            onClick={() => setActiveTab("benefits")}
            className={activeTab === "benefits" ? "bg-kenyan-orange text-white" : "text-kenyan-dark"}
          >
            Benefits
          </Button>
          <Button
            variant={activeTab === "application" ? "default" : "ghost"}
            onClick={() => setActiveTab("application")}
            className={activeTab === "application" ? "bg-kenyan-orange text-white" : "text-kenyan-dark"}
          >
            Apply Now
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            <section className="text-center">
              <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-6">
                Empower Your Craft
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Kifaru Crafts provides a platform for talented Kenyan artisans to showcase their work to a global audience. 
                We believe in fair trade, authentic craftsmanship, and preserving cultural heritage.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <i className="fas fa-globe text-kenyan-orange text-4xl mb-4"></i>
                  <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-4">
                    Global Reach
                  </h3>
                  <p className="text-gray-600">
                    Connect with customers worldwide who appreciate authentic Kenyan craftsmanship.
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
                    Receive fair compensation for your skills with transparent pricing and direct payments.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <i className="fas fa-users text-kenyan-orange text-4xl mb-4"></i>
                  <h3 className="font-cultural text-xl font-semibold text-kenyan-dark mb-4">
                    Community Support
                  </h3>
                  <p className="text-gray-600">
                    Join a network of artisans sharing knowledge, techniques, and cultural stories.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <div className="space-y-12">
            <section>
              <h2 className="font-cultural text-3xl md:text-4xl font-bold text-kenyan-dark mb-8 text-center">
                Why Choose Kifaru Crafts?
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-kenyan-dark">
                      <i className="fas fa-money-bill-wave text-kenyan-orange mr-3"></i>
                      Financial Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 70% revenue share on all sales</li>
                      <li>• Monthly payments directly to your mobile money</li>
                      <li>• No upfront costs or membership fees</li>
                      <li>• Pricing control for your products</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-kenyan-dark">
                      <i className="fas fa-tools text-kenyan-orange mr-3"></i>
                      Platform Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Professional product photography</li>
                      <li>• Marketing and promotion support</li>
                      <li>• Order management system</li>
                      <li>• Customer service assistance</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-kenyan-dark">
                      <i className="fas fa-graduation-cap text-kenyan-orange mr-3"></i>
                      Skills Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Business skills training</li>
                      <li>• Digital marketing workshops</li>
                      <li>• Quality improvement guidance</li>
                      <li>• Cultural preservation initiatives</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-kenyan-dark">
                      <i className="fas fa-heart text-kenyan-orange mr-3"></i>
                      Community Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Support local communities</li>
                      <li>• Preserve traditional techniques</li>
                      <li>• Create sustainable livelihoods</li>
                      <li>• Share cultural stories globally</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}

        {/* Application Tab */}
        {activeTab === "application" && (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-cultural text-2xl text-kenyan-dark text-center">
                  Artisan Application Form
                </CardTitle>
                <p className="text-center text-gray-600">
                  Tell us about yourself and your craft. We'll review your application within 5 business days.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input placeholder="+254 700 123 456" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="City, County" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Craft Specialization</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">Wood Carving</Badge>
                    <Badge variant="outline">Beadwork</Badge>
                    <Badge variant="outline">Textile</Badge>
                    <Badge variant="outline">Pottery</Badge>
                    <Badge variant="outline">Jewelry</Badge>
                    <Badge variant="outline">Painting</Badge>
                  </div>
                  <Input placeholder="Describe your specialty" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <Input type="number" placeholder="5" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your craft</label>
                  <Textarea
                    placeholder="Describe your crafting techniques, cultural background, and what makes your work unique..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Work Samples</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <i className="fas fa-camera text-gray-400 text-3xl mb-2"></i>
                    <p className="text-gray-500">Upload photos of your work (up to 5 images)</p>
                    <Button variant="outline" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-kenyan-orange hover:bg-kenyan-red text-white">
                    Submit Application
                  </Button>
                  <Link href="/products">
                    <Button variant="outline" className="border-kenyan-dark text-kenyan-dark">
                      Browse Products
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 text-center border-t border-gray-200 pt-6">
                  <p className="text-sm text-gray-600 mb-3">Already a vendor?</p>
                  <Link href="/vendor/dashboard">
                    <Button variant="outline" className="border-kenyan-orange text-kenyan-orange hover:bg-kenyan-orange hover:text-white">
                      <i className="fas fa-store mr-2"></i>
                      Manage Your Products
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  By applying, you agree to our terms of service and vendor guidelines.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}