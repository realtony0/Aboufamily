"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Tab = "dashboard" | "products" | "orders" | "ads" | "settings";

interface Product {
  id: string;
  name: string;
  main_category: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  in_stock: boolean;
  featured: boolean;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  total_price: number;
  status: string;
  notes?: string;
  created_at: string;
}

interface Ad {
  id: number;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  active: boolean;
  position: string;
}

interface Stats {
  totalProducts: number;
  pendingOrders: number;
  featuredProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) {
        setIsAuthenticated(true);
        fetchAllData();
      }
    }
  }, []);

  const fetchAllData = () => {
    fetchProducts();
    fetchOrders();
    fetchAds();
    fetchStats();
  };

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
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_token", data.token);
        }
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/admin/ads");
      if (response.ok) {
        const data = await response.json();
        setAds(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    setIsAuthenticated(false);
    router.push("/");
  };

  const handleImportProducts = async () => {
    if (!confirm("Voulez-vous importer tous les produits depuis data/products.ts ?")) return;
    
    setIsImporting(true);
    try {
      const response = await fetch("/api/admin/import-products", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        alert(`Import réussi !\n- ${data.imported} produits importés\n- ${data.skipped} produits déjà existants`);
        fetchAllData();
      } else {
        const errorMsg = data.message || data.error || 'Erreur inconnue';
        alert(`Erreur: ${errorMsg}\n\n${errorMsg.includes('DATABASE_URL') ? 'Vérifiez que DATABASE_URL est configuré dans Vercel (Settings > Environment Variables)' : ''}`);
      }
    } catch (err) {
      alert("Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        fetchProducts();
        fetchStats();
        setEditingProduct(null);
        setShowProductForm(false);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const handleSaveAd = async (adData: any) => {
    try {
      const url = editingAd 
        ? `/api/admin/ads/${editingAd.id}`
        : "/api/admin/ads";
      
      const method = editingAd ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adData),
      });

      if (response.ok) {
        fetchAds();
        setEditingAd(null);
        setShowAdForm(false);
      }
    } catch (err) {
      console.error("Failed to save ad:", err);
    }
  };

  const handleDeleteAd = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette publicité ?")) return;

    try {
      const response = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchAds();
      }
    } catch (err) {
      console.error("Failed to delete ad:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-brand-cream/30">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-brand-chocolate mb-4">Admin Panel</h1>
            <p className="text-brand-chocolate/50 text-sm">Abou Family - Gestion Complète</p>
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
    <div className="min-h-screen bg-brand-beige pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-chocolate tracking-tighter mb-2">
              Panel Admin
            </h1>
            <p className="text-brand-chocolate/40 font-medium">Gestion complète de votre boutique</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="btn-animate bg-white text-brand-chocolate border border-brand-cream px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest">
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="btn-animate bg-red-500 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "dashboard" as Tab, label: "📊 Dashboard", icon: "📊" },
            { id: "products" as Tab, label: "🛍️ Produits", icon: "🛍️" },
            { id: "orders" as Tab, label: "📦 Commandes", icon: "📦" },
            { id: "ads" as Tab, label: "📢 Publicités", icon: "📢" },
            { id: "settings" as Tab, label: "⚙️ Paramètres", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-brand-chocolate text-white shadow-lg"
                  : "bg-white text-brand-chocolate/60 hover:text-brand-chocolate border border-brand-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {stats && (
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-2">Produits</p>
                  <p className="text-4xl font-serif font-bold text-brand-chocolate">{stats.totalProducts}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-2">Commandes en attente</p>
                  <p className="text-4xl font-serif font-bold text-brand-chocolate">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-2">Produits vedettes</p>
                  <p className="text-4xl font-serif font-bold text-brand-chocolate">{stats.featuredProducts}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-caramel mb-2">Total commandes</p>
                  <p className="text-4xl font-serif font-bold text-brand-chocolate">{stats.totalOrders || orders.length}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                <h3 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Dernières commandes</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-brand-beige rounded-xl">
                      <div>
                        <p className="font-bold text-brand-chocolate">{order.customer_name}</p>
                        <p className="text-xs text-brand-chocolate/50">{order.total_price.toLocaleString()} FCFA</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-cream/30">
                <h3 className="text-xl font-serif font-bold text-brand-chocolate mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab("products"); setShowProductForm(true); }}
                    className="w-full bg-brand-chocolate text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    + Ajouter un produit
                  </button>
                  <button
                    onClick={handleImportProducts}
                    disabled={isImporting}
                    className="w-full bg-brand-caramel text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    {isImporting ? "Import en cours..." : "📥 Importer produits"}
                  </button>
                  <button
                    onClick={() => { setActiveTab("ads"); setShowAdForm(true); }}
                    className="w-full bg-brand-accent text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    + Ajouter une publicité
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab - Continuer dans le prochain message car trop long */}
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            editingProduct={editingProduct}
            showProductForm={showProductForm}
            isImporting={isImporting}
            onImport={handleImportProducts}
            onEdit={(p: Product | null) => { setEditingProduct(p); setShowProductForm(true); }}
            onDelete={handleDeleteProduct}
            onSave={handleSaveProduct}
            onClose={() => { setEditingProduct(null); setShowProductForm(false); }}
            onRefresh={fetchProducts}
          />
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onRefresh={fetchOrders}
          />
        )}

        {/* Ads Tab */}
        {activeTab === "ads" && (
          <AdsTab
            ads={ads}
            editingAd={editingAd}
            showAdForm={showAdForm}
            onEdit={(a: Ad | null) => { setEditingAd(a); setShowAdForm(true); }}
            onDelete={handleDeleteAd}
            onSave={handleSaveAd}
            onClose={() => { setEditingAd(null); setShowAdForm(false); }}
            onRefresh={fetchAds}
          />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

// Composants pour chaque onglet
interface ProductsTabProps {
  products: Product[];
  editingProduct: Product | null;
  showProductForm: boolean;
  isImporting: boolean;
  onImport: () => void;
  onEdit: (product: Product | null) => void;
  onDelete: (id: string) => void;
  onSave: (data: any) => void;
  onClose: () => void;
  onRefresh: () => void;
}

function ProductsTab({ products, editingProduct, showProductForm, isImporting, onImport, onEdit, onDelete, onSave, onClose, onRefresh }: ProductsTabProps) {
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    mainCategory: string;
    category: string;
    price: number;
    description: string;
    image: string;
    images: string[];
    inStock: boolean;
    featured: boolean;
  }>({
    id: "",
    name: "",
    mainCategory: "Alimentaire",
    category: "chocolats",
    price: 0,
    description: "",
    image: "",
    images: [],
    inStock: true,
    featured: false,
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        name: editingProduct.name,
        mainCategory: editingProduct.main_category,
        category: editingProduct.category,
        price: editingProduct.price,
        description: editingProduct.description || "",
        image: editingProduct.image || "",
        images: editingProduct.images || [],
        inStock: editingProduct.in_stock,
        featured: editingProduct.featured,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        mainCategory: "Alimentaire",
        category: "chocolats",
        price: 0,
        description: "",
        image: "",
        images: [],
        inStock: true,
        featured: false,
      });
    }
  }, [editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-bold text-brand-chocolate">Gestion des Produits</h2>
        <div className="flex gap-3">
          <button
            onClick={onImport}
            disabled={isImporting}
            className="btn-animate bg-brand-caramel text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-50"
          >
            {isImporting ? "Import..." : "📥 Importer"}
          </button>
          <button
            onClick={() => { onEdit(null); }}
            className="btn-animate bg-brand-chocolate text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            + Nouveau
          </button>
        </div>
      </div>

      {showProductForm && (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-cream/30">
          <h3 className="text-2xl font-serif font-bold text-brand-chocolate mb-6">
            {editingProduct ? "Modifier le produit" : "Nouveau produit"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  required
                  disabled={!!editingProduct}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Catégorie principale</label>
                <select
                  value={formData.mainCategory}
                  onChange={(e) => setFormData({ ...formData, mainCategory: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                >
                  <option value="Alimentaire">Alimentaire</option>
                  <option value="Divers">Divers</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                >
                  <option value="chocolats">Chocolats</option>
                  <option value="biscuits">Biscuits</option>
                  <option value="boissons">Boissons</option>
                  <option value="autres">Autres</option>
                  <option value="jeux">Jeux</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Prix (FCFA)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Image</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  placeholder="/products/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm h-24"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-bold text-brand-chocolate">En stock</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-bold text-brand-chocolate">Produit vedette</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-animate bg-brand-chocolate text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                {editingProduct ? "Modifier" : "Créer"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-animate bg-white text-brand-chocolate border border-brand-cream px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-brand-cream/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-cream/30">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Image</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Nom</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Catégorie</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Prix</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Stock</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-brand-chocolate/50">
                    Aucun produit. Cliquez sur "📥 Importer" pour importer les produits.
                  </td>
                </tr>
              ) : (
                products.map((product: Product) => (
                  <tr key={product.id} className="border-b border-brand-cream/10 hover:bg-brand-beige/30">
                    <td className="py-4 px-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-beige">
                        <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-brand-chocolate text-sm">{product.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-caramel bg-brand-cream/30 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-brand-chocolate">{product.price.toLocaleString()} FCFA</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.in_stock ? "En stock" : "Rupture"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="text-xs font-bold text-brand-caramel hover:text-brand-chocolate"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (id: number, status: string) => void;
  onRefresh: () => void;
}

function OrdersTab({ orders, onUpdateStatus, onRefresh }: OrdersTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold text-brand-chocolate">Gestion des Commandes</h2>
      
      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-brand-cream/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-cream/30">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">ID</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Client</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Téléphone</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Total</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Statut</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Date</th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-brand-chocolate">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-brand-chocolate/50">
                    Aucune commande
                  </td>
                </tr>
              ) : (
                orders.map((order: Order) => (
                  <tr key={order.id} className="border-b border-brand-cream/10 hover:bg-brand-beige/30">
                    <td className="py-4 px-4 text-sm font-bold text-brand-chocolate">#{order.id}</td>
                    <td className="py-4 px-4 text-sm font-bold text-brand-chocolate">{order.customer_name}</td>
                    <td className="py-4 px-4 text-sm text-brand-chocolate/70">{order.customer_phone}</td>
                    <td className="py-4 px-4 text-sm font-bold text-brand-chocolate">{order.total_price.toLocaleString()} FCFA</td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border-0 ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En cours</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-xs text-brand-chocolate/50">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          const items = Array.isArray(order.items) ? order.items : [];
                          alert(`Détails:\n${items.map((item: any) => `- ${item.name} x${item.quantity}`).join('\n')}`);
                        }}
                        className="text-xs font-bold text-brand-caramel hover:text-brand-chocolate"
                      >
                        👁️ Voir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface AdsTabProps {
  ads: Ad[];
  editingAd: Ad | null;
  showAdForm: boolean;
  onEdit: (ad: Ad | null) => void;
  onDelete: (id: number) => void;
  onSave: (data: any) => void;
  onClose: () => void;
  onRefresh: () => void;
}

function AdsTab({ ads, editingAd, showAdForm, onEdit, onDelete, onSave, onClose, onRefresh }: AdsTabProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    active: true,
    position: "homepage",
  });

  useEffect(() => {
    if (editingAd) {
      setFormData({
        title: editingAd.title,
        description: editingAd.description || "",
        image: editingAd.image || "",
        link: editingAd.link || "",
        active: editingAd.active,
        position: editingAd.position || "homepage",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        active: true,
        position: "homepage",
      });
    }
  }, [editingAd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-bold text-brand-chocolate">Gestion des Publicités</h2>
        <button
          onClick={() => { onEdit(null); }}
          className="btn-animate bg-brand-chocolate text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          + Nouvelle publicité
        </button>
      </div>

      {showAdForm && (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-cream/30">
          <h3 className="text-2xl font-serif font-bold text-brand-chocolate mb-6">
            {editingAd ? "Modifier la publicité" : "Nouvelle publicité"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm h-24"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  placeholder="/ads/image.jpg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Lien</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
                >
                  <option value="homepage">Page d'accueil</option>
                  <option value="boutique">Boutique</option>
                  <option value="sidebar">Barre latérale</option>
                </select>
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-bold text-brand-chocolate">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="btn-animate bg-brand-chocolate text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                {editingAd ? "Modifier" : "Créer"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-animate bg-white text-brand-chocolate border border-brand-cream px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-brand-cream/30">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.length === 0 ? (
            <div className="col-span-full text-center py-20 text-brand-chocolate/50">
              Aucune publicité. Cliquez sur "+ Nouvelle publicité" pour en créer une.
            </div>
          ) : (
            ads.map((ad: Ad) => (
              <div key={ad.id} className="bg-brand-beige rounded-xl p-4 border border-brand-cream/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-brand-chocolate">{ad.title}</h4>
                    <p className="text-xs text-brand-chocolate/50">{ad.position}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    ad.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {ad.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {ad.image && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-white mb-3">
                    <Image src={ad.image} alt={ad.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(ad)}
                    className="text-xs font-bold text-brand-caramel hover:text-brand-chocolate"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => onDelete(ad.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold text-brand-chocolate">Paramètres</h2>
      
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-brand-cream/30">
        <h3 className="text-xl font-serif font-bold text-brand-chocolate mb-6">Informations du site</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Nom du site</label>
            <input
              type="text"
              defaultValue="Abou Family"
              className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Email de contact</label>
            <input
              type="email"
              defaultValue="contact@aboufamily.com"
              className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-chocolate mb-2">Téléphone</label>
            <input
              type="tel"
              defaultValue="+221 78 013 26 28"
              className="w-full bg-brand-beige border border-brand-cream rounded-xl py-3 px-4 text-sm"
            />
          </div>
          <button className="btn-animate bg-brand-chocolate text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
