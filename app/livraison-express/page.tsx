"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LivraisonExpressPage() {
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
    <div className="bg-brand-beige min-h-screen pt-20 md:pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="text-center mb-20 md:mb-32 reveal" ref={(el) => { revealRefs.current[0] = el; }}>
          <span className="text-brand-caramel font-black uppercase tracking-[0.6em] text-[10px] mb-6 block underline underline-offset-8">Service Premium</span>
          <h1 className="text-5xl md:text-9xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none mb-8 md:mb-12">
            Livraison <br /> <span className="text-brand-caramel italic font-light">Express.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-chocolate/50 max-w-2xl mx-auto font-medium italic leading-relaxed">
            Recevez vos commandes en 20 à 45 minutes sur tout Dakar. Service ultra-rapide, fiable et sécurisé.
          </p>
        </div>

        {/* Info Livraison Express */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 text-center shadow-lg border border-brand-cream/30 mb-20 md:mb-40 reveal" ref={(el) => { revealRefs.current[1] = el; }}>
          <div className="text-6xl mb-8">🚚</div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-6">Livraison Express Dakar</h3>
          <p className="text-brand-accent font-bold text-3xl md:text-4xl mb-6">20 à 45 minutes</p>
          <p className="text-brand-chocolate/50 text-lg font-medium mb-8">Livraison gratuite dès 50.000 FCFA</p>
          <p className="text-brand-chocolate/40 text-sm leading-relaxed max-w-2xl mx-auto">
            Nous livrons rapidement sur toute la ville de Dakar. Votre commande est préparée et livrée en moins d&apos;une heure pour vous garantir fraîcheur et qualité.
          </p>
        </div>

        {/* Processus */}
        <div className="bg-brand-chocolate rounded-[4rem] p-12 md:p-32 text-white mb-20 md:mb-40 reveal" ref={(el) => { revealRefs.current[4] = el; }}>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-16 md:mb-24 text-center tracking-tighter">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {[
              { step: "1", title: "Commandez", desc: "Ajoutez vos produits au panier et remplissez vos informations" },
              { step: "2", title: "Confirmez", desc: "Validez votre commande via WhatsApp avec nos conseillers" },
              { step: "3", title: "Préparation", desc: "Nous préparons votre commande avec soin et vérifions chaque article" },
              { step: "4", title: "Livraison", desc: "Réceptionnez votre commande et payez à la livraison" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl md:text-3xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center reveal" ref={(el) => { revealRefs.current[5] = el; }}>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-chocolate mb-8 md:mb-12 tracking-tighter">
            Prêt à commander ?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
            <Link href="/boutique" className="btn-animate bg-brand-chocolate text-white px-12 md:px-16 py-5 md:py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl">
              Voir la boutique
            </Link>
            <a href="https://wa.me/221780132628" className="btn-animate bg-[#25D366] text-white px-12 md:px-16 py-5 md:py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl">
              💬 Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
