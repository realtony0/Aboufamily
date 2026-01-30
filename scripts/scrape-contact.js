const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeContactInfo() {
  console.log('📇 Extracting contact info from aboubusinesscompany.com...\n');
  
  try {
    const response = await axios.get('https://www.aboubusinesscompany.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    
    const $ = cheerio.load(response.data);
    
    // Chercher les infos de contact
    const info = {
      phones: [],
      emails: [],
      addresses: [],
      socials: [],
      currency: null,
      companyName: null,
    };

    // Nom de l'entreprise
    const title = $('title').text();
    const logoText = $('.site-title, .logo-text, header h1').text();
    info.companyName = logoText || title;

    // Téléphones
    $('a[href^="tel:"]').each((i, el) => {
      const phone = $(el).attr('href').replace('tel:', '').trim();
      if (phone && !info.phones.includes(phone)) {
        info.phones.push(phone);
      }
    });
    
    // Chercher les numéros dans le texte
    const phoneRegex = /(\+?\d{1,3}[-.\s]?\d{2,3}[-.\s]?\d{2,3}[-.\s]?\d{2,3}[-.\s]?\d{2,4})/g;
    const bodyText = $('body').text();
    const foundPhones = bodyText.match(phoneRegex);
    if (foundPhones) {
      foundPhones.forEach(p => {
        const cleaned = p.trim();
        if (cleaned.length >= 10 && !info.phones.includes(cleaned)) {
          info.phones.push(cleaned);
        }
      });
    }

    // Emails
    $('a[href^="mailto:"]').each((i, el) => {
      const email = $(el).attr('href').replace('mailto:', '').trim();
      if (email && !info.emails.includes(email)) {
        info.emails.push(email);
      }
    });

    // Chercher les emails dans le texte
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const foundEmails = bodyText.match(emailRegex);
    if (foundEmails) {
      foundEmails.forEach(e => {
        if (!info.emails.includes(e)) {
          info.emails.push(e);
        }
      });
    }

    // Adresses
    $('address, .address, .contact-address, [itemprop="address"]').each((i, el) => {
      const addr = $(el).text().trim();
      if (addr && !info.addresses.includes(addr)) {
        info.addresses.push(addr);
      }
    });

    // Réseaux sociaux
    $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="twitter.com"], a[href*="tiktok.com"], a[href*="whatsapp"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href && !info.socials.includes(href)) {
        info.socials.push(href);
      }
    });

    // Devise
    const priceText = $('.price, .woocommerce-Price-amount, .amount').first().text();
    if (priceText.includes('€')) {
      info.currency = 'EUR';
    } else if (priceText.includes('CFA') || priceText.includes('FCFA') || priceText.includes('XOF')) {
      info.currency = 'CFA';
    } else if (priceText.includes('$')) {
      info.currency = 'USD';
    }

    // Chercher dans le footer
    const footerText = $('footer, .footer, #footer').text();
    console.log('Footer text (first 500 chars):');
    console.log(footerText.substring(0, 500));
    console.log('\n---\n');

    // Afficher les résultats
    console.log('📋 CONTACT INFO FOUND:\n');
    console.log('Company Name:', info.companyName || 'Not found');
    console.log('Currency:', info.currency || 'Not detected');
    console.log('Phones:', info.phones.length ? info.phones.join(', ') : 'Not found');
    console.log('Emails:', info.emails.length ? info.emails.join(', ') : 'Not found');
    console.log('Addresses:', info.addresses.length ? info.addresses.join(' | ') : 'Not found');
    console.log('Social Media:', info.socials.length ? info.socials.join('\n  ') : 'Not found');

    // Chercher le texte WhatsApp
    const whatsappLink = $('a[href*="whatsapp"], a[href*="wa.me"]').attr('href');
    if (whatsappLink) {
      console.log('WhatsApp:', whatsappLink);
    }

    return info;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeContactInfo();
