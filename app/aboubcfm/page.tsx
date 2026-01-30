"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  main_category: string;
  category: string;
  price: number;
  description: string;
  image: string;
  in_stock: boolean;
  featured: boolean;
}

interface Stats {
  totalProducts: number;
  pendingOrders: number;
  featuredProducts: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Vérifier si l'admin est déjà connecté
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchProducts();
      fetchStats();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        fetchProducts();
        fetchStats();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-brand-cream/30">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-brand-chocolate mb-4">Admin Panel</h1>
            <p className="text-brand-chocolate/50 text-sm">Abou Family - Gestion</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-beige border border-brand-cream rounded-full py-4 px-6 text-sm focus:outline-none focus:border-brand-caramel"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-3 px-4 rounded-full">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-chocolate text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-caramel transition-all disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Admin */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-chocolate tracking-tighter mb-4">
              Dashboard Admin
            </h1>
            <p className="text-brand-chocolate/40 font-medium">Gestion complète de votre boutique</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="btn-animate bg-white text-brand-chocolate border border-brand-cream px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="btn-animate bg-red-500 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-brand-cream/30">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-4">Total Produits</p>
              <p className="text-5xl font-serif font-bold text-brand-chocolate">{stats.totalProducts}</p>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-brand-cream/30">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-4">Commandes en attente</p>
              <p className="text-5xl font-serif font-bold text-brand-chocolate">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-brand-cream/30">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-4">Produits vedettes</p>
              <p className="text-5xl font-serif font-bold text-brand-chocolate">{stats.featuredProducts}</p>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-brand-cream/30">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif font-bold text-brand-chocolate">Produits</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-animate bg-brand-chocolate text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              + Ajouter un produit
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-cream/30">
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Image</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Nom</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Catégorie</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Prix</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Stock</th>
                  <th className="text-left py-4 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-brand-cream/10 hover:bg-brand-beige/30 transition-colors">
                    <td className="py-6 px-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-beige">
                        <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-brand-chocolate">{product.name}</p>
                      <p className="text-xs text-brand-chocolate/40">{product.description?.substring(0, 50)}...</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-caramel bg-brand-cream/30 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-brand-chocolate">{product.price.toLocaleString()} FCFA</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        product.in_stock 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.in_stock ? "En stock" : "Rupture"}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-xs font-bold text-brand-caramel hover:text-brand-chocolate transition-colors"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
