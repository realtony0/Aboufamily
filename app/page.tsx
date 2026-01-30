"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/data/products";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Charger les produits vedettes depuis l'API
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          const products = Array.isArray(data) ? data : [];
          // Filtrer les produits vedettes
          const featured = products.filter((p: Product) => p.featured).slice(0, 8);
          setFeaturedProducts(featured);
        }
      } catch (err) {
        // Erreur silencieuse
      }
    };
    fetchProducts();
  }, []);

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
      {/* Hero Section Dynamique avec Slider - Mobile Premium */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden pt-24 md:pt-0">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
              activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${slide.color}`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-16 items-center w-full">
              <div className={`text-center md:text-left transition-all duration-1000 delay-300 ${activeSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                <span className="inline-block text-brand-caramel text-[11px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-6 md:mb-6">
                  {slide.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-[8.5rem] font-serif font-bold text-brand-chocolate mb-8 md:mb-10 leading-[1.1] md:leading-[0.85] tracking-tight">
                  {slide.title.split(' ').slice(0, -1).join(' ')} <br /> 
                  <span className="text-brand-caramel italic font-light">{slide.title.split(' ').pop()}</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-chocolate/70 max-w-md mx-auto md:mx-0 mb-10 md:mb-12 leading-relaxed font-medium">
                  {slide.desc}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 md:gap-8">
                  <Link href="/boutique" className="btn-animate bg-brand-chocolate text-white px-12 md:px-12 py-5 md:py-5 rounded-full font-bold uppercase tracking-widest text-xs md:text-xs shadow-2xl hover:bg-brand-accent min-w-[200px] text-center">
                    Découvrir la collection
                  </Link>
                </div>
              </div>

              <div className={`relative w-full aspect-square max-w-md mx-auto md:max-w-none transition-all duration-1000 delay-500 ${activeSlide === index ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
                <div className="absolute inset-0 bg-brand-caramel/5 blur-[120px] rounded-full scale-75 animate-pulse"></div>
                <Image
                  src={slide.image} 
                  alt={`${slide.title} - ${slide.desc} - Abou Family`} 
                  fill 
                  className="object-contain drop-shadow-[0_50px_100px_rgba(61,43,31,0.15)] animate-float"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
        </div>
        ))}

        {/* Slide Indicators - Mobile Centré */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 z-20 flex gap-4">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 md:h-1 transition-all duration-500 rounded-full ${activeSlide === i ? "w-12 bg-brand-chocolate" : "w-6 bg-brand-chocolate/20"}`}
            />
          ))}
        </div>
      </section>

      {/* Section Catégories - Navigation Visuelle Pro - Mobile Premium */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24 reveal" ref={(el) => { revealRefs.current[2] = el; }}>
            <span className="text-brand-caramel font-black uppercase tracking-[0.4em] text-[11px] md:text-[10px] mb-6 md:mb-4 block">Nos Univers</span>
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-brand-chocolate tracking-tight md:tracking-tighter leading-tight">Explorez nos <span className="italic font-light">collections.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Link href="/boutique?cat=chocolats" className="group relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-brand-beige reveal shadow-lg hover:shadow-xl transition-all duration-500" ref={(el) => { revealRefs.current[3] = el; }}>
              <div className="absolute inset-0 p-8 md:p-12 z-10 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-3 md:mb-4">Chocolaterie</h3>
                <p className="text-brand-chocolate/60 text-sm md:text-base font-medium mb-6">Dubai, Kinder, Nutella & plus</p>
                <div className="w-12 h-12 rounded-full border-2 border-brand-chocolate/20 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white group-hover:border-brand-chocolate transition-all duration-500 text-xl">→</div>
              </div>
              <Image src="/products/dubai-kunafa-pistachio.webp" alt="Chocolat Dubai Kunafa Pistachio - Collection Premium Abou Family" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
            </Link>

            <Link href="/boutique?cat=boissons" className="group relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-brand-cream reveal shadow-lg hover:shadow-xl transition-all duration-500" ref={(el) => { revealRefs.current[4] = el; }} style={{ transitionDelay: "0.2s" }}>
              <div className="absolute inset-0 p-8 md:p-12 z-10 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-3 md:mb-4">Boissons</h3>
                <p className="text-brand-chocolate/60 text-sm md:text-base font-medium mb-6">Jus locaux & rafraîchissements</p>
                <div className="w-12 h-12 rounded-full border-2 border-brand-chocolate/20 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white group-hover:border-brand-chocolate transition-all duration-500 text-xl">→</div>
              </div>
              <Image src="/products/casamancaise-ananas.jpeg" alt="Casamançaise Ananas - Jus de fruits locaux Sénégal" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
            </Link>

            <Link href="/boutique?main=Divers" className="group relative h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white border-2 border-brand-cream/50 reveal shadow-lg hover:shadow-xl transition-all duration-500" ref={(el) => { revealRefs.current[5] = el; }} style={{ transitionDelay: "0.4s" }}>
              <div className="absolute inset-0 p-8 md:p-12 z-10 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-chocolate mb-3 md:mb-4">Jeux</h3>
                <p className="text-brand-chocolate/60 text-sm md:text-base font-medium mb-6">Divertissement pour la famille</p>
                <div className="w-12 h-12 rounded-full border-2 border-brand-chocolate/20 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white group-hover:border-brand-chocolate transition-all duration-500 text-xl">→</div>
              </div>
              <Image src="/products/monopoly.jpg" alt="Monopoly Hasbro - Jeu de société classique" width={400} height={400} className="absolute -right-10 -top-10 object-contain opacity-40 group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Grid - Mise en avant HD - Mobile Premium */}
      <section className="py-20 md:py-32 bg-brand-beige/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 md:gap-10 reveal" ref={(el) => { revealRefs.current[6] = el; }}>
            <div>
              <p className="text-brand-caramel font-black uppercase tracking-[0.4em] text-[11px] md:text-[10px] mb-4">Sélection Premium</p>
              <h2 className="text-5xl md:text-8xl font-serif font-bold text-brand-chocolate tracking-tight md:tracking-tighter leading-tight md:leading-none">Incontournables.</h2>
            </div>
            <Link href="/boutique" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-brand-chocolate hover:text-brand-caramel transition-colors">
              Voir tout le catalogue 
              <span className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-brand-chocolate/20 flex items-center justify-center group-hover:bg-brand-chocolate group-hover:text-white group-hover:border-brand-chocolate transition-all duration-500">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 reveal" ref={(el) => { revealRefs.current[7] = el; }}>
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Pourquoi nous ? - Mobile Premium */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="text-center reveal" ref={(el) => { revealRefs.current[8] = el; }}>
            <div className="w-24 h-24 md:w-20 md:h-20 bg-brand-beige rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-4xl md:text-3xl shadow-lg">🚚</div>
            <h4 className="text-2xl md:text-xl font-serif font-bold text-brand-chocolate mb-4">Livraison Express</h4>
            <p className="text-brand-chocolate/60 text-base md:text-sm leading-relaxed max-w-sm mx-auto">Livraison en 20 à 45 minutes sur tout Dakar. Service ultra-rapide pour vos envies pressantes.</p>
          </div>
          <div className="text-center reveal" ref={(el) => { revealRefs.current[9] = el; }} style={{ transitionDelay: "0.2s" }}>
            <div className="w-24 h-24 md:w-20 md:h-20 bg-brand-cream rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-4xl md:text-3xl shadow-lg">✨</div>
            <h4 className="text-2xl md:text-xl font-serif font-bold text-brand-chocolate mb-4">Qualité Premium</h4>
            <p className="text-brand-chocolate/60 text-base md:text-sm leading-relaxed max-w-sm mx-auto">Une sélection rigoureuse des meilleurs chocolats et confiseries du monde entier.</p>
          </div>
          <div className="text-center reveal" ref={(el) => { revealRefs.current[10] = el; }} style={{ transitionDelay: "0.4s" }}>
            <div className="w-24 h-24 md:w-20 md:h-20 bg-brand-beige rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-4xl md:text-3xl shadow-lg">📞</div>
            <h4 className="text-2xl md:text-xl font-serif font-bold text-brand-chocolate mb-4">Service Client</h4>
            <p className="text-brand-chocolate/60 text-base md:text-sm leading-relaxed max-w-sm mx-auto">Une équipe dédiée sur WhatsApp pour vous accompagner dans chaque commande.</p>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp - Mobile Premium */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-chocolate rounded-[3rem] md:rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl reveal" ref={(el) => { revealRefs.current[11] = el; }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-8xl font-serif font-bold mb-8 md:mb-10 tracking-tight md:tracking-tighter leading-tight md:leading-none">Une question ? <br /> <span className="text-brand-accent italic font-light">On vous répond.</span></h2>
              <a href="https://wa.me/221780132628" className="btn-animate inline-block bg-white text-brand-chocolate px-12 md:px-16 py-5 md:py-6 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-brand-accent hover:text-white min-w-[200px]">
                Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
