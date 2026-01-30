/**
 * Script pour importer les produits depuis data/products.ts vers la base de données Neon
 * 
 * Usage: node scripts/import-products.js
 */

const { neon } = require('@neondatabase/serverless');

// Charger les produits depuis le fichier TypeScript
// Note: En production, on devrait utiliser un fichier JSON ou une autre méthode
const products = [
  {
    id: "nutella-3kg",
    name: "Nutella 3 kg",
    mainCategory: "Alimentaire",
    category: "chocolats",
    price: 25000,
    description: "L'incontournable pâte à tartiner aux noisettes et cacao, format géant 3kg.",
    image: "/products/nutella-3kg-new.jpeg",
    images: ["/products/nutella-3kg-new.jpeg"],
    inStock: true,
    featured: true,
  },
  // Ajouter tous les autres produits ici...
  // Pour simplifier, on va créer un script qui lit directement depuis le fichier
];

async function importProducts() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.includes('dummy')) {
    console.error('❌ DATABASE_URL not configured');
    console.log('Set DATABASE_URL environment variable first');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log('🔄 Importing products...');
    
    // Pour l'instant, on va juste créer un exemple
    // En production, il faudrait lire depuis data/products.ts ou un fichier JSON
    
    const sampleProduct = {
      id: "nutella-3kg",
      name: "Nutella 3 kg",
      main_category: "Alimentaire",
      category: "chocolats",
      price: 25000,
      description: "L'incontournable pâte à tartiner aux noisettes et cacao, format géant 3kg.",
      image: "/products/nutella-3kg-new.jpeg",
      images: ["/products/nutella-3kg-new.jpeg"],
      in_stock: true,
      featured: true,
    };

    // Vérifier si le produit existe déjà
    const existing = await sql`
      SELECT id FROM products WHERE id = ${sampleProduct.id}
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO products (
          id, name, main_category, category, price, description, 
          image, images, in_stock, featured
        )
        VALUES (
          ${sampleProduct.id},
          ${sampleProduct.name},
          ${sampleProduct.main_category},
          ${sampleProduct.category},
          ${sampleProduct.price},
          ${sampleProduct.description},
          ${sampleProduct.image},
          ${sampleProduct.images},
          ${sampleProduct.in_stock},
          ${sampleProduct.featured}
        )
      `;
      console.log(`✅ Imported: ${sampleProduct.name}`);
    } else {
      console.log(`⏭️  Skipped (already exists): ${sampleProduct.name}`);
    }

    console.log('✅ Import complete!');
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
}

importProducts();
