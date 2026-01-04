/*
 * Core application logic for Quirky Treasures.
 *
 * This file implements data fetching from a published Google Sheet
 * (CSV), parsing, filtering, sorting and rendering of products on the
 * homepage. It also powers the product detail and category pages.
 */

(function () {
  'use strict';

  /**
   * Local fallback dataset used when the Google Sheet cannot be fetched.
   * Feel free to edit these entries to personalise your demo. Each object
   * follows the schema defined in the README.
   */
  const FallbackData = [
    {
      id: 1,
      slug: "screaming-chicken-keychain",
      title: "Screaming Chicken Keychain",
      description: "A mini keychain that screams when squeezed.",
      price_inr: 299,
      category: "Gadgets",
      platform: "Amazon",
      image_url: "https://placehold.co/600x400?text=Chicken+Keychain",
      affiliate_url: "#",
      added_date: "2025-12-01",
      tags: "quirky,gift,under-499",
      featured: true,
      popularity: 95
    },
    {
      id: 2,
      slug: "levitating-plant-pot",
      title: "Levitating Plant Pot",
      description: "Make your plant float in mid‑air using magnets.",
      price_inr: 2499,
      category: "Home",
      platform: "Amazon",
      image_url: "https://placehold.co/600x400?text=Levitating+Pot",
      affiliate_url: "#",
      added_date: "2025-11-15",
      tags: "home,decor,unique",
      featured: false,
      popularity: 80
    },
    {
      id: 3,
      slug: "led-message-fan",
      title: "LED Message Fan",
      description: "Spins to display your custom message in lights.",
      price_inr: 699,
      category: "Desk",
      platform: "Flipkart",
      image_url: "https://placehold.co/600x400?text=LED+Fan",
      affiliate_url: "#",
      added_date: "2025-12-20",
      tags: "desk,gadget,light",
      featured: false,
      popularity: 60
    },
    {
      id: 4,
      slug: "portable-smores-maker",
      title: "Portable S'mores Maker",
      description: "Enjoy gooey s'mores anytime, anywhere.",
      price_inr: 1299,
      category: "Food & Drink",
      platform: "Amazon",
      image_url: "https://placehold.co/600x400?text=Smores+Maker",
      affiliate_url: "#",
      added_date: "2025-10-05",
      tags: "food,party,camping",
      featured: true,
      popularity: 70
    },
    {
      id: 5,
      slug: "rainbow-unicorn-slippers",
      title: "Rainbow Unicorn Slippers",
      description: "Keep your feet cosy with light‑up unicorn slippers.",
      price_inr: 899,
      category: "Fashion",
      platform: "Flipkart",
      image_url: "https://placehold.co/600x400?text=Unicorn+Slippers",
      affiliate_url: "#",
      added_date: "2025-11-01",
      tags: "fashion,cozy,gift",
      featured: false,
      popularity: 50
    },
    {
      id: 6,
      slug: "inflatable-cup-holder",
      title: "Inflatable Cup Holder",
      description: "Let your drink float beside you in the pool.",
      price_inr: 199,
      category: "Party",
      platform: "Other",
      image_url: "https://placehold.co/600x400?text=Cup+Holder",
      affiliate_url: "#",
      added_date: "2025-09-25",
      tags: "party,pool,summer",
      featured: false,
      popularity: 40
    },
    {
      id: 7,
      slug: "retro-handheld-game-console",
      title: "Retro Handheld Game Console",
      description: "Pocket‑sized console with 400 classic games.",
      price_inr: 1599,
      category: "Gadgets",
      platform: "Amazon",
      image_url: "https://placehold.co/600x400?text=Retro+Console",
      affiliate_url: "#",
      added_date: "2025-12-10",
      tags: "gadget,gaming,nostalgia",
      featured: true,
      popularity: 85
    },
    {
      id: 8,
      slug: "dog-shark-life-jacket",
      title: "Dog Shark Life Jacket",
      description: "Give your pet a cute shark fin for safety & style.",
      price_inr: 1299,
      category: "Pets",
      platform: "Flipkart",
      image_url: "https://placehold.co/600x400?text=Dog+Life+Jacket",
      affiliate_url: "#",
      added_date: "2025-07-30",
      tags: "pets,travel,funny",
      featured: false,
      popularity: 30
    },
    {
      id: 9,
      slug: "travel-utensil-kit",
      title: "Travel Utensil Kit",
      description: "Reusable cutlery set with case for zero‑waste travel.",
      price_inr: 499,
      category: "Travel",
      platform: "Other",
      image_url: "https://placehold.co/600x400?text=Travel+Utensils",
      affiliate_url: "#",
      added_date: "2025-08-15",
      tags: "travel,eco,under-499",
      featured: false,
      popularity: 55
    },
    {
      id: 10,
      slug: "glow-in-dark-pillow",
      title: "Glow‑in‑the‑Dark Pillow",
      description: "A soft pillow that glows softly at night.",
      price_inr: 1099,
      category: "Home",
      platform: "Amazon",
      image_url: "https://placehold.co/600x400?text=Glow+Pillow",
      affiliate_url: "#",
      added_date: "2025-11-25",
      tags: "home,decor,glow",
      featured: true,
      popularity: 65
    }
  ];

  // Global array of parsed product objects
  let products = [];

  /**
   * Fetch the CSV from the configured Google Sheet.
   * Throws an error if the configuration is missing or fetch fails.
   */
  async function fetchCSV() {
    if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('PASTE_PUBLISHED_CSV_URL_HERE')) {
      throw new Error('Please configure SHEET_CSV_URL in assets/config.js');
    }
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV (status ${response.status})`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  }

  /**
   * Convert raw objects (strings) into typed product objects.
   */
  function parseProducts(arr) {
    return arr.map(item => {
      return {
        id: toInt(item.id),
        slug: item.slug || '',
        title: item.title || '',
        description: item.description || '',
        price_inr: toInt(item.price_inr),
        category: item.category || '',
        platform: item.platform || '',
        image_url: item.image_url || '',
        affiliate_url: item.affiliate_url || '',
        added_date: item.added_date || '',
        tags: item.tags || '',
        featured: toBool(item.featured),
        popularity: toInt(item.popularity)
      };
    });
  }

  function toInt(value) {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }
  function toBool(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.trim().toLowerCase() === 'true';
    }
    return false;
  }

  /**
   * Show or hide the warning banner with a message. The banner exists
   * only on the homepage.
   */
  function showWarningBanner(show, message) {
    const banner = document.getElementById('warningBanner');
    const msgEl = document.getElementById('warningMessage');
    const retry = document.getElementById('retryBtn');
    if (!banner || !msgEl || !retry) return;
    if (show) {
      banner.style.display = 'block';
      msgEl.textContent = message || 'Using fallback data because the sheet could not be loaded.';
      retry.onclick = () => {
        banner.style.display = 'none';
        loadCatalog();
      };
    } else {
      banner.style.display = 'none';
    }
  }

  /**
   * Load the catalog for the home page: fetch the CSV, parse products,
   * initialise filters and render.
   */
  async function loadCatalog() {
    let data;
    try {
      const csvData = await fetchCSV();
      if (!csvData || !csvData.length) throw new Error('No data returned');
      // Validate required columns
      const first = csvData[0];
      if (!('slug' in first) || !('title' in first)) {
        throw new Error('CSV is missing required columns');
      }
      data = parseProducts(csvData);
      showWarningBanner(false);
    } catch (err) {
      console.warn('Falling back to local data:', err.message);
      data = FallbackData;
      showWarningBanner(true, err.message);
    }
    products = data;
    initFilters();
    applyFilters();
  }

  /**
   * Initialise category filter options and attach event listeners.
   */
  function initFilters() {
    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect) {
      // remove old options beyond the first
      while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
      }
      const categories = Array.from(new Set(products.map(p => p.category))).sort();
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });
    }
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    const filterElements = ['filterCategory', 'filterPrice', 'filterPlatform', 'sortBy'];
    filterElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', applyFilters);
    });
    const featuredCheck = document.getElementById('filterFeatured');
    if (featuredCheck) featuredCheck.addEventListener('change', applyFilters);
  }

  /**
   * Apply search and filter criteria then render results.
   */
  function applyFilters() {
    let list = products.slice();
    const searchInput = document.getElementById('searchInput');
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = valueOf('filterCategory');
    const price = valueOf('filterPrice');
    const platform = valueOf('filterPlatform');
    const featured = document.getElementById('filterFeatured');
    const sortBy = valueOf('sortBy') || 'latest';

    // Filter by search query
    if (q) {
      list = list.filter(prod => {
        return (
          (prod.title && prod.title.toLowerCase().includes(q)) ||
          (prod.description && prod.description.toLowerCase().includes(q)) ||
          (prod.tags && prod.tags.toLowerCase().includes(q))
        );
      });
    }
    // Filter by category
    if (category) {
      list = list.filter(prod => prod.category === category);
    }
    // Filter by platform
    if (platform) {
      list = list.filter(prod => prod.platform === platform);
    }
    // Filter by featured
    if (featured && featured.checked) {
      list = list.filter(prod => prod.featured === true);
    }
    // Filter by price range
    if (price) {
      list = list.filter(prod => {
        const priceVal = prod.price_inr;
        switch (price) {
          case 'under-499':
            return priceVal < 500;
          case '500-999':
            return priceVal >= 500 && priceVal < 1000;
          case '1000-1999':
            return priceVal >= 1000 && priceVal < 2000;
          case '2000-plus':
            return priceVal >= 2000;
          default:
            return true;
        }
      });
    }
    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price_inr - b.price_inr;
        case 'price-high-low':
          return b.price_inr - a.price_inr;
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'latest':
        default:
          return new Date(b.added_date) - new Date(a.added_date);
      }
    });
    renderProducts(list);
  }

  /**
   * Helper to get selected value of a select element by id.
   */
  function valueOf(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  /**
   * Render product cards on the homepage or category page.
   */
  function renderProducts(list) {
    const container = document.getElementById('productsSection') || document.getElementById('categoryProducts');
    if (!container) return;
    const noResultsEl = document.getElementById('noResults') || document.getElementById('noCategoryResults');
    if (!list || list.length === 0) {
      container.innerHTML = '';
      if (noResultsEl) noResultsEl.style.display = 'block';
      return;
    }
    if (noResultsEl) noResultsEl.style.display = 'none';
    const html = list.map(prod => cardHTML(prod)).join('');
    container.innerHTML = html;
  }

  /**
   * Create HTML string for a product card.
   */
  function cardHTML(prod) {
    const priceFormatted = formatPrice(prod.price_inr);
    // Build share slug for copy
    return `
      <div class="card">
        <img src="${prod.image_url}" alt="${escapeHtml(prod.title)}">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(prod.title)}</h3>
          <p class="card-desc">${escapeHtml(prod.description)}</p>
          <div class="pills">
            <span class="pill">${escapeHtml(prod.category)}</span>
            <span class="pill">${escapeHtml(prod.platform)}</span>
          </div>
          <p class="price">${priceFormatted}</p>
          <div class="card-footer">
            <a href="${prod.affiliate_url}" target="_blank" rel="nofollow sponsored noopener">View Deal</a>
            <button class="share" onclick="shareProduct('${encodeURIComponent(prod.slug)}')">Share</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML special characters to prevent XSS in generated strings.
   */
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  }

  /**
   * Format a number as Indian Rupee currency. Uses Intl.NumberFormat with
   * locale 'en-IN' which uses lakh/crore separators【941623644409432†L323-L326】.
   */
  function formatPrice(number) {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(number);
    } catch (e) {
      return '₹' + number;
    }
  }

  /**
   * Copy product link to clipboard for sharing. Falls back to prompt
   * if clipboard API is unavailable.
   */
  function shareProduct(slugEnc) {
    const slug = decodeURIComponent(slugEnc);
    // Build base URL relative to current page
    const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const url = `${base}product.html?slug=${encodeURIComponent(slug)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Product link copied to clipboard!');
      }).catch(() => {
        window.prompt('Copy this link:', url);
      });
    } else {
      window.prompt('Copy this link:', url);
    }
  }

  /**
   * Load a single product on the product detail page.
   */
  async function loadProductPage() {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const container = document.getElementById('productContainer');
    if (!container) return;
    if (!slug) {
      container.innerHTML = '<p>Missing product identifier.</p>';
      return;
    }
    let items;
    try {
      const csvData = await fetchCSV();
      items = parseProducts(csvData);
    } catch (err) {
      console.warn('Using fallback data for product page:', err.message);
      items = FallbackData;
    }
    const prod = items.find(p => p.slug === slug);
    if (!prod) {
      container.innerHTML = '<p>Product not found.</p>';
      return;
    }
    // Update meta tags for SEO and social sharing
    updateMeta('description', prod.description);
    updateMetaProperty('og:title', `${prod.title} – Quirky Treasures`);
    updateMetaProperty('og:description', prod.description);
    updateMetaProperty('og:image', prod.image_url);
    updateMetaProperty('og:url', window.location.href);
    document.title = `${prod.title} – Quirky Treasures`;
    // Render product details
    const detailsHTML = `
      <img src="${prod.image_url}" alt="${escapeHtml(prod.title)}">
      <h1>${escapeHtml(prod.title)}</h1>
      <div class="meta">
        <span class="pill">${escapeHtml(prod.category)}</span>
        <span class="pill">${escapeHtml(prod.platform)}</span>
      </div>
      <p class="price">${formatPrice(prod.price_inr)}</p>
      <p class="description">${escapeHtml(prod.description)}</p>
      <a class="btn-buy" href="${prod.affiliate_url}" target="_blank" rel="nofollow sponsored noopener">Buy Now</a>
    `;
    // Similar products: same category or sharing at least one tag
    let similar = items.filter(p => p.slug !== slug && (p.category === prod.category || shareTags(p.tags, prod.tags))).slice(0, 4);
    const similarHTML = similar.map(p => {
      return `
        <div class="card">
          <img src="${p.image_url}" alt="${escapeHtml(p.title)}">
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(p.title)}</h3>
            <p class="price">${formatPrice(p.price_inr)}</p>
            <div class="card-footer">
              <a href="${p.affiliate_url}" target="_blank" rel="nofollow sponsored noopener">Deal</a>
              <button class="share" onclick="shareProduct('${encodeURIComponent(p.slug)}')">Share</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    container.innerHTML = `<article class="product-detail">${detailsHTML}</article>${similar.length ? `<div class="similar-section"><h2>Similar finds</h2><div class="similar-grid">${similarHTML}</div></div>` : ''}`;
  }

  /**
   * Determine if two tag strings share any tag.
   */
  function shareTags(tagsA, tagsB) {
    if (!tagsA || !tagsB) return false;
    const setA = new Set(tagsA.toLowerCase().split(/\s*,\s*/));
    const setB = new Set(tagsB.toLowerCase().split(/\s*,\s*/));
    for (const tag of setA) {
      if (setB.has(tag)) return true;
    }
    return false;
  }

  /**
   * Load a category page using the category query parameter.
   */
  async function loadCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || '';
    const heroTitleEl = document.getElementById('categoryTitle');
    if (heroTitleEl) {
      heroTitleEl.textContent = category ? category : 'Category';
    }
    let items;
    try {
      const csvData = await fetchCSV();
      items = parseProducts(csvData);
      showWarningBanner(false);
    } catch (err) {
      items = FallbackData;
      showWarningBanner(true, err.message);
    }
    const filtered = category ? items.filter(p => p.category === category) : items;
    renderProducts(filtered);
  }

  /**
   * Helpers to update meta tags on the fly. Only used on the product
   * detail page to improve SEO/share details.
   */
  function updateMeta(name, content) {
    const meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) meta.setAttribute('content', content);
  }
  function updateMetaProperty(prop, content) {
    const meta = document.querySelector(`meta[property="${prop}"]`);
    if (meta) meta.setAttribute('content', content);
  }

  // Expose functions globally for inline event handlers and page initialisation
  window.loadCatalog = loadCatalog;
  window.applyFilters = applyFilters;
  window.loadProductPage = loadProductPage;
  window.loadCategoryPage = loadCategoryPage;
  window.shareProduct = shareProduct;
})();