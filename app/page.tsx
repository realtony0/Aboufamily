"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, products } from "@/data/products";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "L'Elite du Chocolat",
      subtitle: "Collection Dubai 2026",
      desc: "Découvrez notre iconique chocolat à la pistache et kunafa, une expérience sensorielle inoubliable.",
      image: "/products/dubai-kunafa-pistachio.webp",
      color: "bg-brand-beige"
    },
    {
      title: "Douceur Infinie",
      subtitle: "Nutella Premium",
      desc: "Le format géant pour les vrais passionnés. L'onctuosité légendaire livrée chez vous.",
      image: "/products/nutella-3kg-new.jpeg",
      color: "bg-brand-cream"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="bg-brand-beige">
      {/* Hero Section Dynamique avec Slider */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
              activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${slide.color}`}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-8 md:gap-16 items-center w-full pt-20 md:pt-0">
              <div className={`transition-all duration-1000 delay-300 ${activeSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                <span className="inline-block text-brand-caramel text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-4 md:mb-6">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl md:text-7xl lg:text-[8.5rem] font-serif font-bold text-brand-chocolate mb-6 md:mb-10 leading-[0.9] md:leading-[0.85] tracking-tighter">
                  {slide.title.split(' ').slice(0, -1).join(' ')} <br /> 
                  <span className="text-brand-caramel italic font-light">{slide.title.split(' ').pop()}</span>
                </h1>
                <p className="text-base md:text-xl text-brand-chocolate/60 max-w-md mb-8 md:mb-12 leading-relaxed font-medium">
                  {slide.desc}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                  <Link href="/boutique" className="btn-animate bg-brand-chocolate text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-2xl hover:bg-brand-accent">
                    Découvrir la collection
                  </Link>
                </div>
              </div>

              <div className={`relative aspect-square transition-all duration-1000 delay-500 ${activeSlide === index ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
                <div className="absolute inset-0 bg-brand-caramel/5 blur-[120px] rounded-full scale-75 animate-pulse"></div>
        <Image
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  className="object-contain drop-shadow-[0_50px_100px_rgba(61,43,31,0.15)] animate-float"
          priority
        />
              </div>
            </div>
        </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${activeSlide === i ? "w-12 bg-brand-chocolate" : "w-6 bg-brand-chocolate/20"}`}
            />
          ))}
        </div>
      </section>

      {/* Section Catégories - Navigation Visuelle Pro */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal" ref={(el) => { revealRefs.current[2] = el; }}>
            <span className="text-brand-caramel font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Nos Univers</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-brand-chocolate tracking-tighter">Explorez nos <span className="italic font-light">collections.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/boutique?cat=chocolats" className="group relative h-[500px] rounded-[3rem] overflow-hidden bg-brand-beige reveal" ref={(el) => { revealRefs.current[3] = el; }}>
              <div className="absolute inset-0 p-12 z-10 flex flex-col justify-end">
                <h3 className="text-4xl font-serif font-bold text-brand-chocolate mb-4">Chocolaterie</h3>
                <p className="text-brand-chocolate/50 text-sm font-medium mb-6">Dubai, Kinder, Nutella & plus</p>
                <div className="w-12 h-12 rounded-full border border-brand-chocolate/10 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white transition-all duration-500">→</div>
              </div>
              <Image src="/products/dubai-kunafa-pistachio.webp" alt="Chocolat Dubai" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" />
            </Link>

            <Link href="/boutique?cat=boissons" className="group relative h-[500px] rounded-[3rem] overflow-hidden bg-brand-cream reveal" ref={(el) => { revealRefs.current[4] = el; }} style={{ transitionDelay: "0.2s" }}>
              <div className="absolute inset-0 p-12 z-10 flex flex-col justify-end">
                <h3 className="text-4xl font-serif font-bold text-brand-chocolate mb-4">Boissons</h3>
                <p className="text-brand-chocolate/50 text-sm font-medium mb-6">Jus locaux & rafraîchissements</p>
                <div className="w-12 h-12 rounded-full border border-brand-chocolate/10 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white transition-all duration-500">→</div>
              </div>
              <Image src="/products/casamancaise-ananas.jpeg" alt="Boissons" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" />
            </Link>

            <Link href="/boutique?main=Divers" className="group relative h-[500px] rounded-[3rem] overflow-hidden bg-white border border-brand-cream reveal" ref={(el) => { revealRefs.current[5] = el; }} style={{ transitionDelay: "0.4s" }}>
              <div className="absolute inset-0 p-12 z-10 flex flex-col justify-end">
                <h3 className="text-4xl font-serif font-bold text-brand-chocolate mb-4">Jeux</h3>
                <p className="text-brand-chocolate/50 text-sm font-medium mb-6">Divertissement pour la famille</p>
                <div className="w-12 h-12 rounded-full border border-brand-chocolate/10 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white transition-all duration-500">→</div>
              </div>
              <Image src="/products/monopoly.jpg" alt="Jeux Monopoly" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Grid - Mise en avant HD */}
      <section className="py-32 bg-brand-beige/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10 reveal" ref={(el) => { revealRefs.current[6] = el; }}>
            <div>
              <p className="text-brand-caramel font-black uppercase tracking-[0.4em] text-[10px] mb-4">Sélection Premium</p>
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-brand-chocolate tracking-tighter leading-none">Incontournables.</h2>
            </div>
            <Link href="/boutique" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-brand-chocolate">
              Voir tout le catalogue 
              <span className="w-14 h-14 rounded-full border border-brand-chocolate/10 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white transition-all duration-500">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 reveal" ref={(el) => { revealRefs.current[7] = el; }}>
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Pourquoi nous ? */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <div className="text-center reveal" ref={(el) => { revealRefs.current[8] = el; }}>
            <div className="w-20 h-20 bg-brand-beige rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">🚚</div>
            <h4 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Livraison Express</h4>
            <p className="text-brand-chocolate/50 text-sm leading-relaxed">Livraison en 20 à 45 minutes sur tout Dakar. Service ultra-rapide pour vos envies pressantes.</p>
          </div>
          <div className="text-center reveal" ref={(el) => { revealRefs.current[9] = el; }} style={{ transitionDelay: "0.2s" }}>
            <div className="w-20 h-20 bg-brand-cream rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">✨</div>
            <h4 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Qualité Premium</h4>
            <p className="text-brand-chocolate/50 text-sm leading-relaxed">Une sélection rigoureuse des meilleurs chocolats et confiseries du monde entier.</p>
          </div>
          <div className="text-center reveal" ref={(el) => { revealRefs.current[10] = el; }} style={{ transitionDelay: "0.4s" }}>
            <div className="w-20 h-20 bg-brand-beige rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">📞</div>
            <h4 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Service Client</h4>
            <p className="text-brand-chocolate/50 text-sm leading-relaxed">Une équipe dédiée sur WhatsApp pour vous accompagner dans chaque commande.</p>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-chocolate rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl reveal" ref={(el) => { revealRefs.current[11] = el; }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 tracking-tighter leading-none">Une question ? <br /> <span className="text-brand-accent italic font-light">On vous répond.</span></h2>
              <a href="https://wa.me/221780132628" className="btn-animate inline-block bg-white text-brand-chocolate px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-brand-accent hover:text-white">
                Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
