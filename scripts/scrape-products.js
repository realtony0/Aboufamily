/**
 * Script de scraping pour extraire les produits de www.aboubusinesscompany.com
 * 
 * Usage: node scripts/scrape-products.js
 * 
 * Ce script va:
 * 1. Récupérer toutes les pages du site
 * 2. Extraire les produits (nom, prix, description, image)
 * 3. Générer un fichier JSON avec tous les produits
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.aboubusinesscompany.com';

// Configuration
const config = {
  baseUrl: BASE_URL,
  outputFile: path.join(__dirname, '../data/scraped-products.json'),
  delay: 1000, // Délai entre les requêtes (ms) pour ne pas surcharger le serveur
};

// Fonction pour attendre
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour récupérer une page
async function fetchPage(url) {
  try {
    console.log(`📥 Fetching: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error.message);
    return null;
  }
}

// Fonction pour extraire les produits d'une page
function extractProducts(html, pageUrl) {
  const $ = cheerio.load(html);
  const products = [];

  // Sélecteurs communs pour les sites e-commerce
  // Ces sélecteurs devront peut-être être ajustés selon la structure du site
  const selectors = [
    // Shopify
    '.product-card',
    '.product-item',
    '.product',
    // WooCommerce
    '.woocommerce-loop-product__link',
    '.product-grid-item',
    // Génériques
    '[data-product]',
    '.grid-product',
    '.product-block',
    'article.product',
    '.product-tile',
  ];

  // Essayer chaque sélecteur
  for (const selector of selectors) {
    const items = $(selector);
    if (items.length > 0) {
      console.log(`✅ Found ${items.length} products with selector: ${selector}`);
      
      items.each((i, el) => {
        const $el = $(el);
        
        // Extraire les informations du produit
        const product = {
          name: extractText($el, [
            '.product-title',
            '.product-name',
            '.product-card__title',
            'h2',
            'h3',
            '.title',
            '[data-product-title]',
          ]),
          price: extractPrice($el, [
            '.price',
            '.product-price',
            '.product-card__price',
            '[data-product-price]',
            '.money',
            '.amount',
          ]),
          description: extractText($el, [
            '.product-description',
            '.description',
            '.product-card__description',
            'p',
          ]),
          image: extractImage($el, [
            'img',
            '[data-src]',
            '.product-image img',
          ]),
          link: extractLink($el),
          category: detectCategory(extractText($el, ['.product-title', '.product-name', 'h2', 'h3'])),
        };

        if (product.name) {
          products.push(product);
        }
      });
      
      break; // Stop après avoir trouvé des produits
    }
  }

  return products;

  // Helpers
  function extractText($el, selectors) {
    for (const sel of selectors) {
      const text = $el.find(sel).first().text().trim();
      if (text) return text;
    }
    return $el.text().trim().split('\n')[0]?.trim() || '';
  }

  function extractPrice($el, selectors) {
    for (const sel of selectors) {
      let priceText = $el.find(sel).first().text().trim();
      if (priceText) {
        // Nettoyer le prix
        const priceMatch = priceText.match(/[\d.,]+/);
        if (priceMatch) {
          return parseFloat(priceMatch[0].replace(',', '.'));
        }
      }
    }
    return 0;
  }

  function extractImage($el, selectors) {
    for (const sel of selectors) {
      const $img = $el.find(sel).first();
      const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
      if (src) {
        // Convertir en URL absolue si nécessaire
        if (src.startsWith('//')) return 'https:' + src;
        if (src.startsWith('/')) return BASE_URL + src;
        return src;
      }
    }
    return '';
  }

  function extractLink($el) {
    const href = $el.find('a').first().attr('href') || $el.attr('href');
    if (href) {
      if (href.startsWith('/')) return BASE_URL + href;
      return href;
    }
    return '';
  }

  function detectCategory(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('nutella') || nameLower.includes('chocolat') || nameLower.includes('kinder') || nameLower.includes('milka') || nameLower.includes('dubai') || nameLower.includes('ferrero')) {
      return 'chocolats';
    }
    if (nameLower.includes('biscuit') || nameLower.includes('lotus') || nameLower.includes('biscoff') || nameLower.includes('chewing') || nameLower.includes('extra')) {
      return 'biscuits';
    }
    if (nameLower.includes('casamançaise') || nameLower.includes('casamancaise') || nameLower.includes('jus') || nameLower.includes('boisson')) {
      return 'boissons';
    }
    if (nameLower.includes('uno') || nameLower.includes('monopoly') || nameLower.includes('jenga') || nameLower.includes('jeu')) {
      return 'jeux';
    }
    if (nameLower.includes('milsani') || nameLower.includes('lait')) {
      return 'autres';
    }
    return 'autres';
  }
}

// Fonction pour trouver toutes les pages de produits
async function findProductPages(html) {
  const $ = cheerio.load(html);
  const pages = new Set();
  
  // Chercher les liens vers les pages de catégories/produits
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && (
      href.includes('/product') ||
      href.includes('/shop') ||
      href.includes('/boutique') ||
      href.includes('/collection') ||
      href.includes('/categorie') ||
      href.includes('/category')
    )) {
      if (href.startsWith('/')) {
        pages.add(BASE_URL + href);
      } else if (href.startsWith(BASE_URL)) {
        pages.add(href);
      }
    }
  });

  return Array.from(pages);
}

// Fonction principale
async function scrape() {
  console.log('🚀 Starting scrape of', BASE_URL);
  console.log('─'.repeat(50));

  const allProducts = [];
  const visitedUrls = new Set();

  // 1. Récupérer la page d'accueil
  const homepageHtml = await fetchPage(BASE_URL);
  if (!homepageHtml) {
    console.error('❌ Could not fetch homepage');
    return;
  }

  // 2. Extraire les produits de la page d'accueil
  const homepageProducts = extractProducts(homepageHtml, BASE_URL);
  allProducts.push(...homepageProducts);
  visitedUrls.add(BASE_URL);

  // 3. Trouver les pages de produits
  const productPages = await findProductPages(homepageHtml);
  console.log(`\n📄 Found ${productPages.length} potential product pages`);

  // 4. Visiter chaque page
  for (const pageUrl of productPages) {
    if (visitedUrls.has(pageUrl)) continue;
    visitedUrls.add(pageUrl);

    await sleep(config.delay);
    const pageHtml = await fetchPage(pageUrl);
    
    if (pageHtml) {
      const pageProducts = extractProducts(pageHtml, pageUrl);
      
      // Éviter les doublons
      for (const product of pageProducts) {
        const isDuplicate = allProducts.some(p => p.name === product.name);
        if (!isDuplicate) {
          allProducts.push(product);
        }
      }
    }
  }

  // 5. Afficher les résultats
  console.log('\n' + '─'.repeat(50));
  console.log(`✅ Scraping complete!`);
  console.log(`📦 Total products found: ${allProducts.length}`);
  
  if (allProducts.length > 0) {
    console.log('\n📋 Products:');
    allProducts.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - ${p.price}€ [${p.category}]`);
    });

    // 6. Sauvegarder dans un fichier JSON
    const output = {
      scrapedAt: new Date().toISOString(),
      source: BASE_URL,
      totalProducts: allProducts.length,
      products: allProducts.map((p, index) => ({
        id: `product-${index + 1}`,
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description || `Découvrez ${p.name}, un produit de qualité premium.`,
        image: p.image,
        link: p.link,
        inStock: true,
      })),
    };

    fs.writeFileSync(config.outputFile, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to: ${config.outputFile}`);
  } else {
    console.log('\n⚠️  No products found. The site structure might be different.');
    console.log('    Try manually copying the products or check the site structure.');
  }
}

// Exécuter le script
scrape().catch(console.error);
