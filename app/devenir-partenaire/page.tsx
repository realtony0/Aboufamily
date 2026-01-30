"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface PartnerForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  message: string;
}

export default function DevenirPartenairePage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [formData, setFormData] = useState<PartnerForm>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<PartnerForm>>({});

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
    const newErrors: Partial<PartnerForm> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Requis";
    if (!formData.contactName.trim()) newErrors.contactName = "Requis";
    if (!formData.email.trim()) newErrors.email = "Requis";
    if (!formData.phone.trim()) newErrors.phone = "Requis";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const message = `🤝 *Demande de Partenariat - Abou Family*\n\n` +
      `*Informations Entreprise :*\n` +
      `🏢 Nom : ${formData.companyName}\n` +
      `👤 Contact : ${formData.contactName}\n` +
      `📧 Email : ${formData.email}\n` +
      `📱 Téléphone : ${formData.phone}\n` +
      `🌐 Site web : ${formData.website || "Non renseigné"}\n` +
      `💼 Type : ${formData.businessType || "Non renseigné"}\n\n` +
      `*Message :*\n${formData.message || "Aucun message"}\n\n` +
      `Merci de nous contacter pour discuter de ce partenariat !`;

    window.open(`https://wa.me/221780132628?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="bg-brand-beige min-h-screen pt-20 md:pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="text-center mb-20 md:mb-32 reveal" ref={(el) => { revealRefs.current[0] = el; }}>
          <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[10px] mb-6 block underline underline-offset-8">Partenariat Business</span>
          <h1 className="text-5xl md:text-9xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none mb-8 md:mb-12">
            Devenir <br /> <span className="text-brand-caramel italic font-light">Partenaire.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-chocolate/50 max-w-2xl mx-auto font-medium italic leading-relaxed">
            Rejoignez le réseau Abou Family et développez votre activité avec une marque d&apos;excellence reconnue.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-24">
          {/* Formulaire */}
          <div className="reveal" ref={(el) => { revealRefs.current[1] = el; }}>
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-brand-cream/30">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-8 md:mb-12">Formulaire de Partenariat</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Nom de l&apos;entreprise *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                    required
                  />
                  {errors.companyName && <p className="text-[9px] text-red-500 mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Nom du contact *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                    required
                  />
                  {errors.contactName && <p className="text-[9px] text-red-500 mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                    required
                  />
                  {errors.email && <p className="text-[9px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                    required
                  />
                  {errors.phone && <p className="text-[9px] text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Site web</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Type d&apos;activité</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Revendeur">Revendeur</option>
                    <option value="Distributeur">Distributeur</option>
                    <option value="Partenaire Marketing">Partenaire Marketing</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-brand-beige border border-brand-cream rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel resize-none"
                    placeholder="Décrivez votre projet de partenariat..."
                    rows={5}
                  />
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
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">Avantages du Partenariat</h3>
              <ul className="space-y-4">
                {[
                  "Accès à notre catalogue premium",
                  "Tarifs préférentiels pour revendeurs",
                  "Support marketing et visibilité",
                  "Formation produit et support client",
                  "Suivi des performances détaillé"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-brand-accent text-xl">✓</span>
                    <span className="text-white/80 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-lg border border-brand-cream/30">
              <h3 className="text-2xl font-serif font-bold text-brand-chocolate mb-6">Types de Partenariats</h3>
              <div className="space-y-4">
                {[
                  { title: "Revendeur", desc: "Vendez nos produits dans votre boutique" },
                  { title: "Distributeur", desc: "Distribution en gros pour votre région" },
                  { title: "Marketing", desc: "Partenariats promotionnels et événements" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-brand-beige rounded-2xl">
                    <h4 className="font-bold text-brand-chocolate mb-2">{item.title}</h4>
                    <p className="text-brand-chocolate/50 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-cream/30 rounded-[3rem] p-8 md:p-12">
              <h3 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Questions ?</h3>
              <p className="text-brand-chocolate/50 text-sm mb-6 leading-relaxed">
                Notre équipe commerciale est à votre disposition pour discuter de votre projet.
              </p>
              <a href="https://wa.me/221780132628" className="btn-animate inline-block bg-brand-chocolate text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs">
                💬 Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
