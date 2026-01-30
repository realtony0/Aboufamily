"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function PublicitePage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  return (
    <div className="bg-brand-beige min-h-screen pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section Publicité */}
        <div className="text-center mb-32 reveal" ref={(el) => { revealRefs.current[0] = el; }}>
          <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[10px] mb-6 block underline underline-offset-8">Espace Partenaires</span>
          <h1 className="text-7xl md:text-[9rem] font-serif font-bold text-brand-chocolate tracking-tighter leading-none mb-12">
            Votre Marque <br /> <span className="text-brand-caramel italic font-light">Rayonne.</span>
          </h1>
          <p className="text-xl text-brand-chocolate/50 max-w-2xl mx-auto font-medium italic leading-relaxed mb-16">
            &quot;Propulsez votre entreprise auprès d&apos;une audience passionnée par l&apos;excellence et le goût.&quot;
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a href="https://wa.me/221780132628" className="btn-animate bg-brand-chocolate text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl">
              Devenir Partenaire
            </a>
            <Link href="/boutique" className="btn-animate bg-white text-brand-chocolate border border-brand-cream px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-sm">
              Voir la Boutique
            </Link>
          </div>
        </div>

        {/* Stats Section Dynamique */}
        <div className="grid md:grid-cols-3 gap-12 mb-40 reveal" ref={(el) => { revealRefs.current[1] = el; }}>
          {[
            { label: "Visiteurs Mensuels", value: "15K+", icon: "📈" },
            { label: "Taux d'Engagement", value: "92%", icon: "✨" },
            { label: "Partenaires Heureux", value: "50+", icon: "🤝" }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[3rem] p-12 text-center shadow-[0_20px_60px_rgba(61,43,31,0.04)] hover:shadow-[0_40px_100px_rgba(61,43,31,0.08)] transition-all duration-500 group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
              <p className="text-5xl font-serif font-bold text-brand-chocolate mb-2">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Showcase des Emplacements */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10 reveal" ref={(el) => { revealRefs.current[2] = el; }}>
            <div>
              <p className="text-brand-caramel font-black uppercase tracking-[0.4em] text-[10px] mb-4">Nos Formats</p>
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none">Visibilité.</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Format 1 */}
            <div className="group relative h-[600px] rounded-[4rem] overflow-hidden bg-brand-chocolate reveal" ref={(el) => { revealRefs.current[3] = el; }}>
              <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000">
                <Image src="/products/dubai-kunafa-pistachio.webp" alt="Ad Format" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 p-16 z-10 flex flex-col justify-end bg-gradient-to-t from-brand-chocolate via-transparent to-transparent">
                <span className="text-brand-accent font-black uppercase tracking-widest text-[10px] mb-4">Premium Banner</span>
                <h3 className="text-4xl font-serif font-bold text-white mb-6">Page d&apos;Accueil</h3>
                <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed max-w-sm">
                  Soyez la première chose que nos clients voient. Un impact maximal pour votre marque.
                </p>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-500 text-white">→</div>
              </div>
            </div>

            {/* Format 2 - Slot Disponible */}
            <div className="group relative h-[600px] rounded-[4rem] overflow-hidden border-2 border-dashed border-brand-cream bg-white flex flex-col items-center justify-center p-16 text-center reveal" ref={(el) => { revealRefs.current[4] = el; }} style={{ transitionDelay: "0.2s" }}>
              <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mb-10 text-4xl group-hover:scale-110 transition-transform duration-500">➕</div>
              <h3 className="text-4xl font-serif font-bold text-brand-chocolate mb-6">Votre Pub Ici</h3>
              <p className="text-brand-chocolate/40 text-sm font-medium mb-12 leading-relaxed max-w-xs">
                Rejoignez Abou Family et touchez une audience qualifiée à Dakar.
              </p>
              <a href="https://wa.me/221780132628" className="btn-animate bg-brand-chocolate text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
                Réserver l&apos;Espace
              </a>
            </div>
          </div>
        </div>

        {/* Pourquoi Nous ? */}
        <div className="bg-brand-chocolate rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl reveal" ref={(el) => { revealRefs.current[5] = el; }}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
          
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-10 tracking-tighter leading-none">Pourquoi <br /> <span className="text-brand-accent italic font-light">Annoncer ?</span></h2>
              <div className="space-y-10">
                {[
                  { title: "Audience Ciblée", desc: "Touchez des clients CSP+ amateurs de produits premium." },
                  { title: "Image de Marque", desc: "Associez votre entreprise à une signature d'excellence." },
                  { title: "Résultats Mesurables", desc: "Suivez l'impact de vos campagnes en temps réel." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold flex-shrink-0">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-brand-accent/5 blur-[100px] rounded-full"></div>
              <Image src="/logo.jpeg" alt="Abou Family Logo" width={400} height={400} className="object-contain rounded-full border-4 border-brand-accent/20 p-4 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
