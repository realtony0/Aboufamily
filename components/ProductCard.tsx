"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(61,43,31,0.12)] border border-brand-cream/30 hover:-translate-y-1 md:hover:-translate-y-2">
      <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-brand-beige/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 md:p-8 transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Overlay Description Rapide - Desktop Only */}
        <div className="hidden md:block absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-brand-chocolate/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white text-[10px] font-medium leading-relaxed line-clamp-2 italic opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
            {product.description}
          </p>
        </div>

        {/* Badge Promo/Nouveau */}
        {product.featured && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-accent text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-3 py-1 rounded-full shadow-lg animate-pulse">
            Best Seller
          </div>
        )}
      </Link>
      
      <div className="p-4 md:p-6 text-center">
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-brand-caramel font-bold mb-1 md:mb-2">
          {product.category}
        </p>
        <h3 className="font-serif text-sm md:text-lg font-bold text-brand-chocolate mb-2 md:mb-3 line-clamp-2 md:line-clamp-1 group-hover:text-brand-caramel transition-colors duration-300 min-h-[40px] md:min-h-0">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="h-[1px] w-3 md:w-4 bg-brand-cream"></div>
          <p className="text-sm md:text-base font-bold text-brand-chocolate">
            {formatPrice(product.price)}
          </p>
          <div className="h-[1px] w-3 md:w-4 bg-brand-cream"></div>
        </div>
        
        <button
          onClick={() => addToCart(product)}
          className="w-full btn-animate bg-brand-beige border border-brand-chocolate/10 text-brand-chocolate py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-brand-chocolate hover:text-white transition-all duration-500"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
