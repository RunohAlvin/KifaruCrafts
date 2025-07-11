import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-kenyan-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-elephant text-kenyan-orange text-2xl mr-2"></i>
              <h3 className="font-cultural text-xl font-bold">Kifaru Crafts</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Authentic Kenyan crafts connecting you to our rich cultural heritage through the work of master artisans.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Artisan Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=1" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Traditional Crafts
                </Link>
              </li>
              <li>
                <Link href="/products?category=2" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Textiles
                </Link>
              </li>
              <li>
                <Link href="/products?category=3" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/products?category=4" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Art & Paintings
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-kenyan-orange transition-colors">
                  Home Decor
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-kenyan-orange"></i>
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone mr-2 text-kenyan-orange"></i>
                <a href="tel:+254748136297" className="hover:text-kenyan-orange transition-colors cursor-pointer">
                  +254 748 136 297
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope mr-2 text-kenyan-orange"></i>
                <a href="mailto:hello@kifarucrafts.com" className="hover:text-kenyan-orange transition-colors cursor-pointer">
                  hello@kifarucrafts.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Kifaru Crafts. All rights reserved. Proudly supporting Kenyan artisans.</p>
        </div>
      </div>
    </footer>
  );
}
