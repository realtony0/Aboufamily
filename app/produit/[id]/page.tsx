"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import StructuredData from "@/components/StructuredData";
import { Product } from "@/data/products";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger le produit depuis l'API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Charger les produits similaires
          const allProductsResponse = await fetch("/api/products");
          if (allProductsResponse.ok) {
            const allProducts = await allProductsResponse.json();
            const related = (Array.isArray(allProducts) ? allProducts : [])
              .filter((p: Product) => p.category === data.category && p.id !== data.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  useEffect(() => {
    if (revealRef.current && product) {
      revealRef.current.classList.add("active");
    }
  }, [product]);

  if (loading) {
    return (
      <div className="bg-brand-beige min-h-screen pt-20 md:pt-32 pb-32 flex items-center justify-center">
        <p className="text-brand-chocolate/50">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-lux py-40 text-center">
        <h1 className="text-4xl font-serif font-bold text-brand-chocolate mb-8 italic">Trésor Introuvable.</h1>
        <Link href="/boutique" className="btn-animate bg-brand-chocolate text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Retour à la boutique</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-brand-beige min-h-screen pt-20 md:pt-32 pb-32">
      <StructuredData 
        type="Product" 
        product={product} 
      />
      <StructuredData 
        type="BreadcrumbList" 
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Boutique", url: "/boutique" },
          { name: product.category, url: `/boutique?cat=${product.category}` },
          { name: product.name, url: `/produit/${product.id}` },
        ]} 
      />
      <div className="max-w-[1800px] mx-auto px-6 reveal" ref={revealRef}>
        
        {/* Layout Style Magazine / Apple */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* COLONNE GAUCHE : Image Immersive (Sticky) */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] md:aspect-square bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(61,43,31,0.05)] group">
              <Image
                src={product.image}
                alt={`${product.name} - ${product.description}`}
                fill
                className="object-contain p-12 md:p-24 transition-transform duration-1000 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Badges Flottants */}
              <div className="absolute top-12 left-12 flex flex-col gap-4">
                <span className="bg-brand-chocolate text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl">
                  {product.mainCategory}
                </span>
                {product.featured && (
                  <span className="bg-brand-accent text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl animate-pulse">
                    Best Seller
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Contenu Éditorial */}
          <div className="lg:col-span-5 pt-12 lg:pt-20 lg:pl-12">
            {/* Breadcrumb Discret */}
            <nav className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-brand-chocolate/30 mb-12">
              <Link href="/boutique" className="hover:text-brand-caramel transition-colors">Boutique</Link>
              <span className="opacity-20">/</span>
              <span className="text-brand-caramel">{product.category}</span>
            </nav>

            {/* Titre Monumental */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-[6.5rem] font-serif font-bold text-brand-chocolate mb-8 leading-[0.85] tracking-tighter">
                {product.name.split(' ').slice(0, -1).join(' ')} <br />
                <span className="text-brand-caramel italic font-light">{product.name.split(' ').pop()}</span>
              </h1>
              
              <div className="flex items-baseline gap-6">
                <span className="text-5xl font-bold text-brand-chocolate tracking-tighter">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-caramel bg-brand-cream/30 px-4 py-1 rounded-full">
                  Stock Disponible
                </span>
              </div>
            </div>

            {/* Description Narrative */}
            <div className="mb-20">
              <p className="text-xl text-brand-chocolate/60 font-medium italic leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Actions de Commande Style Apple */}
            <div className="space-y-10 bg-white p-10 rounded-[3rem] shadow-[0_20px_60px_rgba(61,43,31,0.03)] border border-brand-cream/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-chocolate/40">Quantité</span>
                <div className="flex items-center bg-brand-beige rounded-full border border-brand-cream p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition-colors font-bold text-brand-chocolate"
                  >−</button>
                  <span className="w-12 text-center text-sm font-black text-brand-chocolate">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition-colors font-bold text-brand-chocolate"
                  >+</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl transform active:scale-95 ${
                    added ? "bg-brand-accent text-white" : "bg-brand-chocolate text-white hover:bg-brand-caramel"
                  }`}
                >
                  {added ? "✓ Article ajouté" : "Ajouter au panier"}
                </button>
                
                <a 
                  href={`https://wa.me/221780132628?text=Bonjour Abou Family, je souhaite commander ${product.name} x${quantity}`}
                  className="w-full flex items-center justify-center gap-4 py-6 bg-[#25D366] text-white font-bold uppercase tracking-widest rounded-full text-[10px] shadow-xl hover:opacity-90 transition-opacity"
                >
                  <span className="text-lg">💬</span> Commander via WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Badges Minimalistes */}
            <div className="mt-20 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4 p-8 bg-brand-cream/20 rounded-[2.5rem]">
                <span className="text-3xl">🚚</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-1">Livraison</p>
                  <p className="text-[9px] font-bold text-brand-caramel opacity-60 uppercase">Express 20-45 min</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-8 bg-brand-cream/20 rounded-[2.5rem]">
                <span className="text-3xl">💵</span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-1">Paiement</p>
                  <p className="text-[9px] font-bold text-brand-caramel opacity-60 uppercase">Cash à la livraison</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Recommandations (Pleine Largeur) */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-40 pt-40 border-t border-brand-cream/30">
            <div className="flex items-end justify-between mb-20">
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none">
                Vous aimerez <br /> <span className="text-brand-caramel italic font-light">aussi.</span>
              </h2>
              <Link href="/boutique" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate/30 hover:text-brand-chocolate transition-colors">
                Voir tout 
                <span className="w-12 h-12 rounded-full border border-brand-chocolate/10 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white transition-all duration-500">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
