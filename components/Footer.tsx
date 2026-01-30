import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-32 pb-12 border-t border-brand-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-4 mb-10 group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-caramel group-hover:border-brand-accent transition-colors duration-500">
                <Image src="/logo.jpeg" alt="Abou Family" fill className="object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-chocolate">
                Abou <span className="text-brand-caramel">Family</span>
              </span>
            </Link>
            <p className="text-brand-chocolate/50 font-medium leading-relaxed mb-10 italic">
              L&apos;excellence du chocolat et des confiseries de prestige livrés avec soin à Dakar. Une signature de goût pour toute la famille.
            </p>
            <div className="flex gap-4">
              {["instagram", "facebook", "whatsapp"].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-full border border-brand-chocolate/10 flex items-center justify-center hover:bg-brand-chocolate hover:text-white transition-all duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-xl font-bold text-brand-chocolate mb-10">Navigation</h4>
            <ul className="space-y-5">
              {["Accueil", "Boutique", "Publicité", "Panier"].map((item) => (
                <li key={item}>
                  <Link href={item === "Accueil" ? "/" : item === "Boutique" ? "/boutique" : item === "Publicité" ? "/publicite" : "/panier"} className="text-sm font-bold uppercase tracking-widest text-brand-chocolate/40 hover:text-brand-caramel transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-xl font-bold text-brand-chocolate mb-10">Services</h4>
            <ul className="space-y-5">
              <li>
                <Link href="/livraison-express" className="text-sm font-bold uppercase tracking-widest text-brand-chocolate/40 hover:text-brand-caramel transition-colors duration-300">
                  Livraison Express
                </Link>
              </li>
              <li>
                <Link href="/commandes-cadeaux" className="text-sm font-bold uppercase tracking-widest text-brand-chocolate/40 hover:text-brand-caramel transition-colors duration-300">
                  Commandes Cadeaux
                </Link>
              </li>
              <li>
                <Link href="/publicite" className="text-sm font-bold uppercase tracking-widest text-brand-chocolate/40 hover:text-brand-caramel transition-colors duration-300">
                  Espace Publicitaire
                </Link>
              </li>
              <li>
                <Link href="/devenir-partenaire" className="text-sm font-bold uppercase tracking-widest text-brand-chocolate/40 hover:text-brand-caramel transition-colors duration-300">
                  Devenir Partenaire
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xl font-bold text-brand-chocolate mb-10">Contact</h4>
            <ul className="space-y-6">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-caramel">Adresse</span>
                <span className="text-sm font-bold text-brand-chocolate/60">Dakar, Sénégal</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-caramel">Téléphone</span>
                <span className="text-sm font-bold text-brand-chocolate/60">+221 78 013 26 28</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-caramel">Email</span>
                <span className="text-sm font-bold text-brand-chocolate/60">contact@aboufamily.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-brand-cream/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-chocolate/20">
            © 2026 Abou Family • Signature d&apos;Excellence
          </p>
          <div className="flex gap-10">
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-chocolate/20 hover:text-brand-caramel transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-chocolate/20 hover:text-brand-caramel transition-colors">Terms</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-cream/10 text-center">
          <p className="text-sm font-medium text-brand-chocolate/50">
            Site conçu par{" "}
            <a 
              href="https://wa.me/221774992742" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-caramel hover:text-brand-chocolate transition-colors font-bold text-base underline underline-offset-4"
            >
              Mmb
            </a>
            {" "}•{" "}
            <a 
              href="https://wa.me/221774992742" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-caramel hover:text-brand-chocolate transition-colors font-bold text-base underline underline-offset-4"
            >
              774992742
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
