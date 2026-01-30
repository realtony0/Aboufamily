"use client";

import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const mainParam = searchParams.get("main") as "Alimentaire" | "Divers" | null;
  const catParam = searchParams.get("cat");

  const [selectedMain, setSelectedMain] = useState<"Alimentaire" | "Divers" | "Tous">("Tous");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainParam) setSelectedMain(mainParam);
    if (catParam) setSelectedCat(catParam);
    
    if (revealRef.current) {
      revealRef.current.classList.add("active");
    }
  }, [mainParam, catParam]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedMain !== "Tous") filtered = filtered.filter((p) => p.mainCategory === selectedMain);
    if (selectedCat !== "all") filtered = filtered.filter((p) => p.category === selectedCat);
    if (searchQuery) {
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [selectedMain, selectedCat, searchQuery]);

  const currentCategories = categories.filter(c => selectedMain === "Tous" || c.main === selectedMain);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20 reveal" ref={revealRef}>
      {/* Header Boutique - Design Ultra-Moderne - Mobile Premium */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 md:gap-12 mb-16 md:mb-24">
        <div className="max-w-2xl w-full">
          <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[11px] md:text-[10px] mb-4 md:mb-6 block underline underline-offset-4 md:underline-offset-8">Collection Exclusive</span>
          <h1 className="text-5xl md:text-9xl font-serif font-bold text-brand-chocolate tracking-tight md:tracking-tighter leading-tight md:leading-none mb-6 md:mb-8">Boutique.</h1>
          
          {/* Barre de Recherche Intégrée - Mobile Premium */}
          <div className="relative max-w-md w-full group">
            <input 
              type="text" 
              placeholder="Rechercher un délice..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-brand-cream/50 rounded-full py-4 px-6 md:px-8 text-base md:text-sm font-medium focus:outline-none focus:border-brand-caramel transition-all shadow-sm group-hover:shadow-md"
            />
            <span className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-brand-caramel opacity-50 text-lg">🔍</span>
          </div>
        </div>

        {/* Filtres Principaux - Style Tabs Luxueuses - Mobile Premium */}
        <div className="flex gap-2 md:gap-4 bg-white p-1.5 md:p-2 rounded-full shadow-[0_10px_30px_rgba(61,43,31,0.05)] border border-brand-cream/30 w-full lg:w-auto overflow-x-auto lg:overflow-visible">
          {["Tous", "Alimentaire", "Divers"].map((m) => (
            <button
              key={m}
              onClick={() => { setSelectedMain(m as any); setSelectedCat("all"); }}
              className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-[11px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${
                selectedMain === m ? "bg-brand-chocolate text-white shadow-xl" : "text-brand-chocolate/40 hover:text-brand-chocolate"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-16">
        {/* Sidebar de Filtres - Style Apple - Mobile Premium */}
        <div className="lg:col-span-3 space-y-8 md:space-y-12">
          <div>
            <h3 className="text-[11px] md:text-[10px] font-black uppercase tracking-[0.4em] text-brand-caramel mb-6 md:mb-8">Catégories</h3>
            <div className="flex flex-col gap-3 md:gap-4">
              <button
                onClick={() => setSelectedCat("all")}
                className={`flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-base md:text-sm font-bold transition-all duration-300 ${
                  selectedCat === "all" ? "bg-brand-chocolate text-white shadow-lg" : "bg-white text-brand-chocolate/40 hover:bg-brand-cream/20 border border-brand-cream/30"
                }`}
              >
                <span>✨ Tout voir</span>
                <span className="text-xs md:text-[10px] opacity-50">{products.length}</span>
              </button>
              {currentCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`flex items-center justify-between px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-base md:text-sm font-bold transition-all duration-300 ${
                    selectedCat === cat.id ? "bg-brand-chocolate text-white shadow-lg" : "bg-white text-brand-chocolate/40 hover:bg-brand-cream/20 border border-brand-cream/30"
                  }`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="text-xs md:text-[10px] opacity-50">
                    {products.filter(p => p.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Promo Sidebar - Mobile Premium */}
          <div className="bg-brand-chocolate rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <p className="text-[10px] md:text-[9px] font-black uppercase tracking-widest text-brand-accent mb-3 md:mb-4">Offre Spéciale</p>
            <h4 className="text-lg md:text-xl font-serif font-bold mb-4 md:mb-6">Livraison gratuite dès 50.000 FCFA</h4>
            <Link href="/boutique" className="text-[11px] md:text-[10px] font-black uppercase tracking-widest border-b-2 border-brand-accent pb-1 text-brand-accent hover:text-white hover:border-white transition-colors">En profiter</Link>
          </div>
        </div>

        {/* Grille de Produits - Plus d'espace et de clarté - Mobile Premium */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <p className="text-[11px] md:text-[10px] font-black uppercase tracking-widest text-brand-chocolate/40 md:text-brand-chocolate/30">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
            <div className="h-[1px] flex-1 mx-4 md:mx-8 bg-brand-cream/30"></div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 md:py-40 bg-white rounded-[3rem] md:rounded-[4rem] border-2 border-dashed border-brand-cream px-6">
              <span className="text-5xl md:text-6xl mb-6 md:mb-8 block">🔍</span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-chocolate/40 md:text-brand-chocolate/30 italic mb-6 md:mb-0">Aucun trésor ne correspond à votre recherche.</h3>
              <button 
                onClick={() => { setSelectedMain("Tous"); setSelectedCat("all"); setSearchQuery(""); }}
                className="mt-6 md:mt-10 btn-animate bg-brand-chocolate text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full text-[11px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg hover:shadow-xl"
              >
                Réinitialiser tout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <div className="bg-brand-beige min-h-screen pt-24 md:pt-32">
      <Suspense fallback={<div className="text-center py-20 md:py-40 font-black uppercase tracking-[0.5em] text-brand-chocolate/10 animate-pulse text-sm md:text-base">Chargement de la collection...</div>}>
        <BoutiqueContent />
      </Suspense>
    </div>
  );
}
