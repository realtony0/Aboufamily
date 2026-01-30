"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GiftOrderForm {
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryDate: string;
  message: string;
  senderName: string;
  senderPhone: string;
  budget: string;
}

export default function CommandesCadeauxPage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [formData, setFormData] = useState<GiftOrderForm>({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    deliveryDate: "",
    message: "",
    senderName: "",
    senderPhone: "",
    budget: ""
  });
  const [errors, setErrors] = useState<Partial<GiftOrderForm>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<GiftOrderForm> = {};
    
    if (!formData.recipientName.trim()) newErrors.recipientName = "Requis";
    if (!formData.recipientPhone.trim()) newErrors.recipientPhone = "Requis";
    if (!formData.recipientAddress.trim()) newErrors.recipientAddress = "Requis";
    if (!formData.senderName.trim()) newErrors.senderName = "Requis";
    if (!formData.senderPhone.trim()) newErrors.senderPhone = "Requis";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const message = `🎁 *Commande Cadeau - Abou Family*\n\n` +
      `*Destinataire :*\n` +
      `👤 Nom : ${formData.recipientName}\n` +
      `📱 Téléphone : ${formData.recipientPhone}\n` +
      `📍 Adresse : ${formData.recipientAddress}\n` +
      `📅 Date de livraison : ${formData.deliveryDate}\n\n` +
      `*Expéditeur :*\n` +
      `👤 Nom : ${formData.senderName}\n` +
      `📱 Téléphone : ${formData.senderPhone}\n\n` +
      `💰 Budget : ${formData.budget || "Non spécifié"}\n` +
      `💬 Message : ${formData.message || "Aucun message"}\n\n` +
      `Merci de nous contacter pour finaliser cette commande cadeau !`;

    window.open(`https://wa.me/221780132628?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="bg-brand-beige min-h-screen pt-24 md:pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="text-center mb-20 md:mb-32 reveal" ref={(el) => { revealRefs.current[0] = el; }}>
          <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[10px] mb-6 block underline underline-offset-8">Service Cadeaux</span>
          <h1 className="text-5xl md:text-9xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none mb-8 md:mb-12">
            Commandes <br /> <span className="text-brand-caramel italic font-light">Cadeaux.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-chocolate/50 max-w-2xl mx-auto font-medium italic leading-relaxed">
            Offrez l&apos;excellence avec nos coffrets cadeaux personnalisés. Emballage premium et livraison surprise incluse.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-24">
          {/* Formulaire */}
          <div className="reveal" ref={(el) => { revealRefs.current[1] = el; }}>
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-brand-cream/30">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-8 md:mb-12">Formulaire de Commande</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Destinataire */}
                <div>
                  <h3 className="text-brand-caramel font-black uppercase tracking-widest text-[10px] mb-6">Destinataire</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                        required
                      />
                      {errors.recipientName && <p className="text-[9px] text-red-500 mt-1">{errors.recipientName}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        value={formData.recipientPhone}
                        onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                        placeholder="+221 XX XXX XX XX"
                        required
                      />
                      {errors.recipientPhone && <p className="text-[9px] text-red-500 mt-1">{errors.recipientPhone}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Adresse de livraison *</label>
                      <textarea
                        value={formData.recipientAddress}
                        onChange={(e) => setFormData({...formData, recipientAddress: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel resize-none"
                        rows={3}
                        required
                      />
                      {errors.recipientAddress && <p className="text-[9px] text-red-500 mt-1">{errors.recipientAddress}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Date de livraison souhaitée *</label>
                      <input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                        required
                      />
                      {errors.deliveryDate && <p className="text-[9px] text-red-500 mt-1">{errors.deliveryDate}</p>}
                    </div>
                  </div>
                </div>

                {/* Expéditeur */}
                <div>
                  <h3 className="text-brand-caramel font-black uppercase tracking-widest text-[10px] mb-6">Expéditeur</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Votre nom *</label>
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                        required
                      />
                      {errors.senderName && <p className="text-[9px] text-red-500 mt-1">{errors.senderName}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Votre téléphone *</label>
                      <input
                        type="tel"
                        value={formData.senderPhone}
                        onChange={(e) => setFormData({...formData, senderPhone: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                        required
                      />
                      {errors.senderPhone && <p className="text-[9px] text-red-500 mt-1">{errors.senderPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h3 className="text-brand-caramel font-black uppercase tracking-widest text-[10px] mb-6">Options</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Budget approximatif</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                      >
                        <option value="">Sélectionnez un budget</option>
                        <option value="10.000 - 25.000 FCFA">10.000 - 25.000 FCFA</option>
                        <option value="25.000 - 50.000 FCFA">25.000 - 50.000 FCFA</option>
                        <option value="50.000 - 100.000 FCFA">50.000 - 100.000 FCFA</option>
                        <option value="100.000+ FCFA">100.000+ FCFA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Message personnalisé (optionnel)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-brand-beige border border-brand-cream rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel resize-none"
                        placeholder="Un message à inclure avec le cadeau..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-animate bg-brand-chocolate text-white py-5 md:py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-brand-caramel"
                >
                  Envoyer la demande
                </button>
              </form>
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-8 reveal" ref={(el) => { revealRefs.current[2] = el; }} style={{ transitionDelay: "0.2s" }}>
            <div className="bg-brand-chocolate rounded-[3rem] p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">Ce qui est inclus</h3>
              <ul className="space-y-4">
                {[
                  "Emballage premium personnalisé",
                  "Carte de message incluse",
                  "Livraison surprise à l'adresse",
                  "Suivi de commande en temps réel",
                  "Service client dédié"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-brand-accent text-xl">✓</span>
                    <span className="text-white/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-cream/30 rounded-[3rem] p-8 md:p-12">
              <h3 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Besoin d'aide ?</h3>
              <p className="text-brand-chocolate/50 text-sm mb-6 leading-relaxed">
                Nos conseillers sont disponibles pour vous aider à créer le cadeau parfait.
              </p>
              <a href="https://wa.me/221780132628" className="btn-animate inline-block bg-brand-chocolate text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
                💬 Discuter avec nous
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
