"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/boutique", label: "Boutique", icon: "🛍️" },
    { href: "/publicite", label: "Publicité", icon: "📢" },
    { href: "/panier", label: "Panier", icon: "🛒", badge: totalItems },
  ];

  return (
    <>
      {/* Header Web-Style - Responsive */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
        scrolled ? "py-3 md:py-3 glass shadow-lg backdrop-blur-xl" : "py-4 md:py-6 bg-white md:bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-full overflow-hidden border-2 border-brand-caramel/30 group-hover:border-brand-accent transition-all duration-500">
              <Image src="/logo.jpeg" alt="Abou Family" fill className="object-cover" />
            </div>
            <span className="font-serif text-lg md:text-2xl font-bold tracking-tight text-brand-chocolate">
              Abou <span className="text-brand-caramel">Family</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {["Accueil", "Boutique", "Publicité"].map((item) => (
              <Link 
                key={item}
                href={item === "Accueil" ? "/" : item === "Boutique" ? "/boutique" : "/publicite"}
                className="text-sm font-bold uppercase tracking-widest text-brand-chocolate hover:text-brand-caramel transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-caramel transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-brand-chocolate hover:text-brand-caramel transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-chocolate hover:text-brand-caramel transition-colors"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <Link href="/boutique" className="hidden md:block btn-animate bg-brand-chocolate text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-brand-caramel">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Web Style */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-brand-cream/30 shadow-xl">
            <nav className="max-w-7xl mx-auto px-5 py-6 space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-base font-bold uppercase tracking-widest transition-colors ${
                  pathname === "/" ? "text-brand-caramel" : "text-brand-chocolate hover:text-brand-caramel"
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/boutique"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-base font-bold uppercase tracking-widest transition-colors ${
                  pathname === "/boutique" ? "text-brand-caramel" : "text-brand-chocolate hover:text-brand-caramel"
                }`}
              >
                Boutique
              </Link>
              <Link
                href="/publicite"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-base font-bold uppercase tracking-widest transition-colors ${
                  pathname === "/publicite" ? "text-brand-caramel" : "text-brand-chocolate hover:text-brand-caramel"
                }`}
              >
                Publicité
              </Link>
              <Link
                href="/panier"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-base font-bold uppercase tracking-widest transition-colors ${
                  pathname === "/panier" ? "text-brand-caramel" : "text-brand-chocolate hover:text-brand-caramel"
                }`}
              >
                Panier {totalItems > 0 && `(${totalItems})`}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Side Cart Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-brand-chocolate/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-brand-beige shadow-2xl cart-drawer transform transition-transform duration-500 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 md:p-8 border-b border-brand-cream flex items-center justify-between bg-white safe-top">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-chocolate">Votre Panier</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-brand-beige rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-5xl mb-6 block">🛒</span>
                  <p className="text-brand-chocolate/40 font-medium italic">Votre panier est vide.</p>
                  <Link href="/boutique" onClick={() => setIsCartOpen(false)} className="mt-8 inline-block text-xs font-black uppercase tracking-widest text-brand-caramel border-b border-brand-caramel">Explorer la boutique</Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 md:gap-6 group">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-brand-cream/30">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-brand-chocolate text-base md:text-lg line-clamp-1">{item.product.name}</h3>
                      <p className="text-brand-caramel font-bold text-sm mb-3">{formatPrice(item.product.price)}</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center bg-white rounded-full border border-brand-cream p-1">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-beige transition-colors font-bold text-sm">-</button>
                          <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-beige transition-colors font-bold text-sm">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-white border-t border-brand-cream safe-bottom">
                <div className="flex justify-between items-end mb-6 md:mb-8">
                  <span className="text-xs font-black uppercase tracking-widest text-brand-chocolate/40">Total</span>
                  <span className="text-2xl md:text-3xl font-bold text-brand-chocolate">{formatPrice(totalPrice)}</span>
                </div>
                <Link 
                  href="/panier" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full btn-animate block text-center bg-brand-chocolate text-white py-4 md:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-caramel"
                >
                  Voir le panier complet
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
