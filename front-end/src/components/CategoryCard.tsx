import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg shadow-lg kenyan-pattern">
          <img
            src={category.image || ""}
            alt={category.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kenyan-dark to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-cultural text-xl font-semibold mb-1">{category.name}</h3>
            <p className="text-sm">{category.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
