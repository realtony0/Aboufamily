"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export default function PanierPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const revealRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});

  useEffect(() => {
    if (revealRef.current) {
      revealRef.current.classList.add("active");
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<CustomerInfo> = {};
    
    if (!customerInfo.name.trim()) {
      errors.name = "Le nom est requis";
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = "Le téléphone est requis";
    } else if (!/^(\+221|221)?[0-9]{9}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
      errors.phone = "Format invalide";
    }
    if (!customerInfo.address.trim()) {
      errors.address = "L'adresse est requise";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateWhatsAppMessage = () => {
    let message = "Bonjour Abou Family, je souhaite commander :\n\n";
    items.forEach((item) => {
      message += `• ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    message += `\n*Total : ${formatPrice(totalPrice)}*\n\n`;
    message += "📋 *Mes informations :*\n";
    message += `👤 Nom : ${customerInfo.name}\n`;
    message += `📱 Téléphone : ${customerInfo.phone}\n`;
    message += `📍 Adresse : ${customerInfo.address}\n`;
    if (customerInfo.notes.trim()) {
      message += `💬 Notes : ${customerInfo.notes}\n`;
    }
    return encodeURIComponent(message);
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) {
      return;
    }
    window.open(`https://wa.me/221780132628?text=${generateWhatsAppMessage()}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 md:px-6 bg-brand-beige pb-24 md:pb-0">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] flex items-center justify-center mb-8 md:mb-12 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 text-brand-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-6xl font-serif font-bold text-brand-chocolate mb-6 md:mb-8 tracking-tighter italic text-center">Votre panier est vide.</h1>
        <p className="text-brand-chocolate/40 font-medium uppercase tracking-[0.2em] mb-8 md:mb-12 text-center text-[10px] md:text-xs">Commencez votre voyage gourmand dès maintenant.</p>
        <Link href="/boutique" className="btn-animate bg-brand-chocolate text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-xl">Explorer la boutique</Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-beige min-h-screen pt-24 md:pt-40 pb-32 md:pb-32 safe-bottom">
      <div className="max-w-7xl mx-auto px-4 md:px-6 reveal" ref={revealRef}>
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 md:mb-24 gap-6 md:gap-10">
          <div>
            <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[9px] md:text-[10px] mb-4 md:mb-6 block underline underline-offset-8">Récapitulatif</span>
            <h1 className="text-5xl md:text-9xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none">Panier.</h1>
          </div>
          <button 
            onClick={clearCart} 
            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-chocolate/30 hover:text-red-500 transition-colors border-b border-brand-chocolate/10 pb-1"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-24 items-start">
          {/* Liste des articles - Mobile First */}
          <div className="lg:col-span-8 space-y-6 md:space-y-10">
            {items.map((item) => (
              <div key={item.product.id} className="group flex flex-col sm:flex-row gap-6 md:gap-10 items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_60px_rgba(61,43,31,0.04)] transition-all duration-500 hover:shadow-[0_40px_100px_rgba(61,43,31,0.08)]">
                <Link href={`/produit/${item.product.id}`} className="w-32 h-32 md:w-40 md:h-40 bg-brand-beige/50 relative flex-shrink-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name} 
                    fill 
                    className="object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-110" 
                  />
                </Link>
                
                <div className="flex-1 text-center sm:text-left w-full">
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-brand-caramel mb-2 md:mb-3 block">{item.product.category}</span>
                  <Link href={`/produit/${item.product.id}`} className="text-xl md:text-2xl font-serif font-bold text-brand-chocolate hover:text-brand-caramel transition-colors leading-tight mb-4 md:mb-6 block line-clamp-2">
                    {item.product.name}
                  </Link>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
                    <div className="flex items-center bg-brand-beige rounded-full border border-brand-cream p-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} 
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors font-bold text-brand-chocolate text-lg"
                      >−</button>
                      <span className="w-10 text-center text-xs font-black text-brand-chocolate">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors font-bold text-brand-chocolate text-lg"
                      >+</button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-brand-chocolate">{formatPrice(item.product.price * item.quantity)}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-brand-caramel uppercase tracking-widest opacity-40">{formatPrice(item.product.price)} / unité</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)} 
                        className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-brand-chocolate/20 hover:text-red-500 transition-colors"
                      >Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé + Formulaire - Mobile First */}
          <div className="lg:col-span-4">
            <div className="bg-brand-chocolate rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 text-white sticky top-24 md:top-32 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]"></div>
              
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 md:mb-12 relative z-10 tracking-tighter">Résumé.</h2>
              
              <div className="space-y-6 md:space-y-8 mb-12 md:mb-16 relative z-10">
                <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <span>Sous-total</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <span>Livraison</span>
                  <span className="text-brand-accent italic text-xs">Calculé au checkout</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full"></div>
                <div className="flex justify-between items-end">
                  <span className="text-base md:text-lg font-bold uppercase tracking-widest">Total</span>
                  <span className="text-3xl md:text-4xl font-bold text-brand-accent">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-animate w-full py-5 md:py-6 bg-white text-brand-chocolate rounded-full font-black uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-3 md:gap-4 shadow-xl relative z-10 hover:bg-brand-accent hover:text-white"
                >
                  <span className="text-lg">📝</span> Remplir mes informations
                </button>
              ) : (
                <div className="space-y-5 md:space-y-6 relative z-10">
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 md:mb-3">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 md:py-4 px-5 md:px-6 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="Votre nom"
                    />
                    {formErrors.name && <p className="text-[8px] md:text-[9px] text-red-300 mt-2">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 md:mb-3">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 md:py-4 px-5 md:px-6 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="+221 XX XXX XX XX"
                    />
                    {formErrors.phone && <p className="text-[8px] md:text-[9px] text-red-300 mt-2">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 md:mb-3">
                      Adresse de livraison *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 resize-none"
                      placeholder="Votre adresse complète à Dakar"
                      rows={3}
                    />
                    {formErrors.address && <p className="text-[8px] md:text-[9px] text-red-300 mt-2">{formErrors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 md:mb-3">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 resize-none"
                      placeholder="Instructions spéciales..."
                      rows={2}
                    />
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    className="btn-animate w-full py-5 md:py-6 bg-white text-brand-chocolate rounded-full font-black uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-3 md:gap-4 shadow-xl hover:bg-brand-accent hover:text-white"
                  >
                    <span className="text-lg">💬</span> Confirmer sur WhatsApp
                  </button>

                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                  >
                    ← Retour
                  </button>
                </div>
              )}
              
              <p className="mt-8 md:mt-10 text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-white/20 text-center leading-relaxed relative z-10">
                Abou Family • Signature d&apos;Excellence <br /> Paiement à la livraison uniquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
