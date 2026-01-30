/**
 * Script pour extraire les vraies URLs d'images depuis aboubusinesscompany.com
 * en visitant chaque page produit individuellement
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.aboubusinesscompany.com';

// Liste des produits avec leurs URLs (récupérées du scraping précédent)
const productPages = [
  { name: 'Nutella 3kg', url: 'https://aboubusinesscompany.com/?product=nutella-3kg' },
  { name: 'Fix Dessert Chocolatier', url: 'https://aboubusinesscompany.com/?product=fix-dessert-chocolatier' },
  { name: 'Dubai Chocolat Cotton Candy', url: 'https://aboubusinesscompany.com/?product=dubai-chocolat-cotton-candy' },
  { name: 'Chocolat Dubai 200g', url: 'https://aboubusinesscompany.com/?product=chocolat-dubai-200g' },
  { name: 'Casamancaise mangue-madd', url: 'https://aboubusinesscompany.com/?product=jus-casamancaise-mangue-madd' },
  { name: 'Cookies KINDER 136g', url: 'https://aboubusinesscompany.com/?product=cookies-crunchy-pepites-de-chocolat-au-lait-et-chocolat-blanc-kinderle-paquet-de-136g' },
  { name: 'Loup Garou', url: 'https://aboubusinesscompany.com/?product=loup-garou' },
  { name: 'UNO Geant', url: 'https://aboubusinesscompany.com/?product=uno-geant' },
  { name: 'ANTEPYA Chocolat Dubai', url: 'https://aboubusinesscompany.com/?product=antepyachocolat-dubai' },
  { name: 'MONTANA Chocolate Bar', url: 'https://aboubusinesscompany.com/?product=montane-chocolate-bar-cotton-candy-pistachio' },
  { name: 'POEME Pistache Fusion', url: 'https://aboubusinesscompany.com/?product=poemepot-a-tartiner-poeme-pistache-fusion' },
  { name: 'Nella Delice', url: 'https://aboubusinesscompany.com/?product=nella-delice' },
  { name: 'Milsani 10%', url: 'https://aboubusinesscompany.com/?product=le-lait-milsani-kondensmilch-10' },
  { name: 'Milsani 7.5%', url: 'https://aboubusinesscompany.com/?product=milsani-kondensmilch-75-340-g' },
  { name: 'Milka Oreo', url: 'https://aboubusinesscompany.com/?product=milka-oreo-milka-oreo-choco' },
  { name: 'Chocolat Dubai', url: 'https://aboubusinesscompany.com/?product=chocolat-dubai' },
  { name: 'Chewing gum EXTRA', url: 'https://aboubusinesscompany.com/?product=chewing-gum-extra' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

function extractImageUrl(html) {
  const $ = cheerio.load(html);
  
  // Chercher les images dans différents sélecteurs
  const imageSelectors = [
    '.woocommerce-product-gallery__image img',
    '.product-gallery img',
    '.wp-post-image',
    '.product-image img',
    '.single-product-image img',
    'figure img',
    '.attachment-woocommerce_single',
    'img.wp-post-image',
    '.product img',
  ];

  for (const selector of imageSelectors) {
    const $img = $(selector).first();
    
    // Essayer différents attributs
    const src = $img.attr('data-large_image') || 
                $img.attr('data-src') || 
                $img.attr('src') || 
                $img.attr('data-lazy-src') ||
                $img.attr('srcset')?.split(' ')[0];
    
    if (src && !src.includes('data:image') && !src.includes('placeholder')) {
      // Convertir en URL absolue
      if (src.startsWith('//')) return 'https:' + src;
      if (src.startsWith('/')) return BASE_URL + src;
      return src;
    }
  }

  // Chercher dans le HTML brut pour les URLs d'images
  const imgMatches = html.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp|gif)/gi);
  if (imgMatches) {
    // Filtrer pour trouver les images de produits
    const productImages = imgMatches.filter(url => 
      url.includes('uploads') || 
      url.includes('product') || 
      url.includes('wp-content')
    );
    if (productImages.length > 0) {
      return productImages[0];
    }
  }

  return null;
}

async function scrapeImages() {
  console.log('🖼️  Extracting product images from', BASE_URL);
  console.log('─'.repeat(60));

  const results = [];

  // D'abord, récupérer la page d'accueil pour voir la structure
  const homepageHtml = await fetchPage(BASE_URL);
  if (homepageHtml) {
    const $ = cheerio.load(homepageHtml);
    
    // Chercher toutes les images sur la page d'accueil
    console.log('\n📸 Searching for images on homepage...\n');
    
    // Chercher les images dans les cartes produits
    $('.product').each((i, el) => {
      const $el = $(el);
      const name = $el.find('.woocommerce-loop-product__title, .product-title, h2').text().trim();
      
      // Chercher l'image
      const $img = $el.find('img').first();
      const imgUrl = $img.attr('data-src') || 
                     $img.attr('data-lazy-src') || 
                     $img.attr('src') ||
                     $img.attr('srcset')?.split(' ')[0];
      
      if (name && imgUrl && !imgUrl.includes('data:image')) {
        let finalUrl = imgUrl;
        if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;
        if (finalUrl.startsWith('/')) finalUrl = BASE_URL + finalUrl;
        
        results.push({ name, image: finalUrl });
        console.log(`✅ ${name}`);
        console.log(`   ${finalUrl}\n`);
      }
    });
  }

  // Si on n'a pas trouvé d'images, visiter chaque page produit
  if (results.length === 0) {
    console.log('\n⚠️  No images found on homepage, visiting individual product pages...\n');
    
    for (const product of productPages) {
      await sleep(1000);
      const html = await fetchPage(product.url);
      
      if (html) {
        const imageUrl = extractImageUrl(html);
        if (imageUrl) {
          results.push({ name: product.name, image: imageUrl });
          console.log(`✅ ${product.name}`);
          console.log(`   ${imageUrl}\n`);
        } else {
          console.log(`❌ ${product.name} - No image found\n`);
        }
      }
    }
  }

  // Sauvegarder les résultats
  console.log('\n' + '─'.repeat(60));
  console.log(`📦 Total images found: ${results.length}`);

  if (results.length > 0) {
    const outputPath = path.join(__dirname, '../data/product-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`💾 Saved to: ${outputPath}`);

    // Afficher les commandes curl pour télécharger les images
    console.log('\n📥 Commands to download images:\n');
    results.forEach((r, i) => {
      const filename = r.name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const ext = r.image.split('.').pop()?.split('?')[0] || 'jpg';
      console.log(`curl -o "public/products/${filename}.${ext}" "${r.image}"`);
    });
  }

  return results;
}

scrapeImages().catch(console.error);
