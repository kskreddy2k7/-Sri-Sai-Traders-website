/**
 * Sri Sai Traders — Dedicated Kirana & Dairy Shop Application
 * Single Source of Truth: Google Sheets + Fallback Local Catalog
 * Design Inspiration: Swiggy Instamart, Blinkit & Zepto with Heritage Brand Identity
 */

(function () {
    'use strict';

    // ========== 1. CONFIGURATION & STATE ==========
    const CONFIG = {
        // Real Google Sheet ID for Sri Sai Traders
        SHEET_ID: '1rqp8dCSxG53mCpmM8XmU0tiFcIblpqT6',
        SHEET_NAME_PRODUCTS: 'Products',
        SHEET_NAME_SETTINGS: 'Settings',
        DEFAULT_WA_NUMBER: '918639602820',
        DEFAULT_STORE_NAME: 'Sri Sai Traders',
        DEFAULT_CURRENCY: '₹',
        STORE_ADDRESS: 'Vijaya Durga College Road, B-Camp, Kurnool, AP 518002',
        TIMEOUT_MS: 4000
    };

    // Construct Direct Google Query & Export URLs with Cache-Busting
    function getGoogleCsvEndpoints() {
        const nc = Date.now();
        return [
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(CONFIG.SHEET_NAME_PRODUCTS)}&_nc=${nc}`,
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(CONFIG.SHEET_NAME_PRODUCTS)}&_nc=${nc}`,
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=0&_nc=${nc}`,
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&_nc=${nc}`
        ];
    }

    function getGoogleSettingsEndpoints() {
        const nc = Date.now();
        return [
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(CONFIG.SHEET_NAME_SETTINGS)}&_nc=${nc}`,
            `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(CONFIG.SHEET_NAME_SETTINGS)}&_nc=${nc}`
        ];
    }

    // State
    let allProducts = [];
    let settings = {
        business_name: CONFIG.DEFAULT_STORE_NAME,
        whatsapp_number: CONFIG.DEFAULT_WA_NUMBER,
        currency: CONFIG.DEFAULT_CURRENCY,
        store_address: CONFIG.STORE_ADDRESS
    };
    let currentCategory = 'All';
    let searchQuery = '';
    let sortMode = 'featured';
    let inStockOnly = false;
    let cart = [];

    // Clean Branded Sri Sai Traders SVG Placeholders (1:1 Square, Elegant Cream & Gold Vector Art)
    const CATEGORY_PLACEHOLDERS = {
        'Our Own Dairy': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M165 125h70v24h-70zm12 24h46l14 62v85H163v-85z" fill="%233E1F0E"/><path d="M175 195h50v55h-50z" fill="%23754522"/><circle cx="200" cy="222" r="14" fill="%23FAF7F0"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">PURE BUFFALO DAIRY • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23D4A24A" text-anchor="middle">FARM FRESH PRODUCT</text></svg>`,
        'Rice & Grains': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M150 155c0-40 50-65 50-65s50 25 50 65c0 52-50 100-50 100s-50-48-50-100z" fill="%23D4A24A"/><path d="M200 95v150M170 145l30 20 30-20M165 180l35 22 35-22" stroke="%23FAF7F0" stroke-width="3" stroke-linecap="round"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">RICE &amp; GRAINS • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23D4A24A" text-anchor="middle">PREMIUM AGED STAPLES</text></svg>`,
        'Oils': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M175 115h50v35h-50zm-15 35h80l12 50v95H148v-95z" fill="%23D4A24A"/><circle cx="200" cy="230" r="20" fill="%23FAF7F0"/><path d="M200 216c0 0 10 12 10 18a10 10 0 0 1-20 0c0-6 10-18 10-18z" fill="%23D4A24A"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">COOKING OILS • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23D4A24A" text-anchor="middle">PURE &amp; REFINED OILS</text></svg>`,
        'Spices & Pastes': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M145 180c0 42 35 68 55 68s55-26 55-68zm-15-18h140v12H130z" fill="%23B33927"/><path d="M220 120l-30 45" stroke="%233E1F0E" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="205" r="12" fill="%23D4A24A"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">SPICES &amp; PASTES • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23B33927" text-anchor="middle">AUTHENTIC AROMATIC SPICES</text></svg>`,
        'Snacks & Chocolates': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><rect x="145" y="135" width="110" height="115" rx="10" fill="%235A3219"/><circle cx="170" cy="165" r="8" fill="%23D4A24A"/><circle cx="230" cy="165" r="8" fill="%23D4A24A"/><circle cx="200" cy="210" r="8" fill="%23D4A24A"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">SNACKS &amp; SWEETS • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23D4A24A" text-anchor="middle">CRUNCHY &amp; DELICIOUS</text></svg>`,
        'Cool Drinks': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M180 115h40v30h-40zm-12 30h64l10 50v95H158v-95z" fill="%231E6091"/><rect x="175" y="200" width="50" height="50" rx="4" fill="%23FAF7F0"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">COOL DRINKS • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%231E6091" text-anchor="middle">CHILLED BEVERAGES</text></svg>`,
        'Daily Essentials': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M135 170h130l-18 90H153zm65-55c26 0 40 20 40 40h-14c0-14-10-26-26-26s-26 12-26 26h-14c0-20 14-40 40-40z" fill="%23754522"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">DAILY ESSENTIALS • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23D4A24A" text-anchor="middle">QUALITY STORE SELECTION</text></svg>`,
        'Home Cleaning': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><path d="M180 120h40v36h-40zm-20 36h80l6 50v84H154v-84z" fill="%231F7A4C"/><path d="M225 105l25 15-20 8z" fill="%23D4A24A"/><circle cx="200" cy="225" r="14" fill="%23FAF7F0"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">HOME CLEANING • KURNOOL</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%231F7A4C" text-anchor="middle">CLEAN &amp; FRESH HOME</text></svg>`,
        'Disposable & Packaging': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23FAF7F0"/><circle cx="200" cy="190" r="115" fill="%23F4ECE1" stroke="%23D4A24A" stroke-width="2" stroke-dasharray="6,4"/><rect x="140" y="145" width="120" height="110" rx="8" fill="%238C7B71"/><path d="M140 175h120M200 145v110" stroke="%23FAF7F0" stroke-width="4"/><circle cx="200" cy="190" r="18" fill="%23D4A24A"/><text x="200" y="55" font-family="'Playfair Display',serif,sans-serif" font-size="16" font-weight="bold" fill="%233E1F0E" text-anchor="middle" letter-spacing="2">SRI SAI TRADERS</text><text x="200" y="78" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23754522" text-anchor="middle" letter-spacing="1.5">DISPOSABLE &amp; PACKAGING</text><text x="200" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="%238C7B71" text-anchor="middle">PLATES, CUPS &amp; COVERS</text></svg>`
    };

    function getFallbackImage(category) {
        if (!category) return CATEGORY_PLACEHOLDERS['Daily Essentials'];
        const normalized = normalizeCategoryName(category);
        return CATEGORY_PLACEHOLDERS[normalized] || CATEGORY_PLACEHOLDERS['Daily Essentials'];
    }

    function normalizeCategoryName(cat) {
        if (!cat) return 'Daily Essentials';
        const c = cat.toLowerCase();
        if (c.includes('dairy') || c.includes('milk')) return 'Our Own Dairy';
        if (c.includes('rice') || c.includes('grain') || c.includes('dal') || c.includes('atta')) return 'Rice & Grains';
        if (c.includes('oil')) return 'Oils';
        if (c.includes('spice') || c.includes('paste') || c.includes('masala') || c.includes('chilli') || c.includes('turmeric')) return 'Spices & Pastes';
        if (c.includes('snack') || c.includes('sweet') || c.includes('chocolate') || c.includes('biscuit') || c.includes('namkeen')) return 'Snacks & Chocolates';
        if (c.includes('drink') || c.includes('beverage') || c.includes('soda')) return 'Cool Drinks';
        if (c.includes('clean') || c.includes('detergent') || c.includes('wash') || c.includes('soaps') || c.includes('floor')) return 'Home Cleaning';
        if (c.includes('disposable') || c.includes('cover') || c.includes('plate') || c.includes('packaging')) return 'Disposable & Packaging';
        return 'Daily Essentials';
    }

    /**
     * Resolves and formats product image URLs from Google Sheets.
     * Supports:
     *   - Google Drive shared links (converts to high-res Google UserContent CDN link)
     *   - Google Images search URLs (extracts the actual image URL from imgurl= parameter)
     *   - Dropbox shared links (converts dl=0 to raw=1 for direct image loading)
     *   - Imgur & Postimages page links (converts to direct image file links)
     *   - Direct public HTTPS image URLs from any CDN or e-commerce host
     *   - Valid local project assets (assets/...)
     * Filters out:
     *   - Local offline filenames (e.g. "MILK IMAGE.png") -> cleanly returns branded category placeholder.
     */
    function resolveProductImage(rawUrl, category) {
        if (!rawUrl || typeof rawUrl !== 'string') {
            return getFallbackImage(category);
        }

        let trimmed = rawUrl.trim();
        if (!trimmed) {
            return getFallbackImage(category);
        }

        // 1. Google Images Search Result URL (extracts direct image URL from imgurl= parameter)
        if (trimmed.includes('google.com/imgres') || trimmed.includes('google.co.in/imgres')) {
            try {
                const urlObj = new URL(trimmed);
                const actualImg = urlObj.searchParams.get('imgurl');
                if (actualImg) {
                    trimmed = decodeURIComponent(actualImg);
                }
            } catch (e) {
                // proceed with trimmed
            }
        }

        // 2. Google Drive URLs (extracts file ID and routes to Google's public UserContent CDN)
        if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com') || trimmed.includes('lh3.googleusercontent.com')) {
            const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                          trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                          trimmed.match(/fileId=([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                const fileId = match[1];
                // Google UserContent CDN (Fastest, unthrottled, zero cookie restrictions, optimized image size)
                return `https://lh3.googleusercontent.com/d/${fileId}=w600`;
            }
        }

        // 3. Dropbox links (converts preview page to direct image raw stream)
        if (trimmed.includes('dropbox.com')) {
            return trimmed.replace('dl=0', 'raw=1').replace('?dl=0', '?raw=1');
        }

        // 4. Imgur page links (e.g. imgur.com/XYZ -> i.imgur.com/XYZ.jpg)
        if (/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/i.test(trimmed)) {
            const id = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)/)[1];
            return `https://i.imgur.com/${id}.jpg`;
        }

        // 5. Postimages page links
        if (/^https?:\/\/postimg\.cc\/([a-zA-Z0-9]+)$/i.test(trimmed)) {
            const id = trimmed.match(/postimg\.cc\/([a-zA-Z0-9]+)/)[1];
            return `https://i.postimg.cc/${id}/image.jpg`;
        }

        // 6. Direct HTTP or HTTPS image URLs
        if (/^https?:\/\//i.test(trimmed)) {
            try {
                return encodeURI(decodeURI(trimmed));
            } catch (e) {
                return trimmed;
            }
        }

        // 7. Known valid local asset path
        if (trimmed.startsWith('assets/')) {
            return trimmed;
        }

        // 8. Do NOT treat local raw filenames like "MILK IMAGE.png" as working online URLs
        return getFallbackImage(category);
    }

    /**
     * Resilient Multi-Tier Image Error Recovery Handler.
     * If an external image fails to load, it attempts alternative Google CDNs before falling back to SVG.
     */
    window.handleImageError = (imgEl, category) => {
        if (!imgEl) return;
        const currentSrc = imgEl.src || '';
        const retryCount = Number(imgEl.dataset.retry || 0);

        // Check if this was a Google Drive file ID
        const driveMatch = currentSrc.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                           currentSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/);

        if (driveMatch && driveMatch[1] && retryCount < 2) {
            const fileId = driveMatch[1];
            imgEl.dataset.retry = retryCount + 1;
            if (retryCount === 0) {
                // Tier 2: Try Google Drive thumbnail endpoint
                imgEl.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                return;
            } else if (retryCount === 1) {
                // Tier 3: Try Google Drive export view endpoint
                imgEl.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
                return;
            }
        }

        // Final Tier: Clean Branded Sri Sai Traders SVG Placeholder
        imgEl.onerror = null;
        imgEl.src = getFallbackImage(category);
        imgEl.classList.add('is-fallback');
    };

    // Escape HTML Helper
    function escapeHtml(str) {
        if (!str && str !== 0) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // CSV Parser with Quotes Handling
    function parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let insideQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if ((char === '\r' || char === '\n') && !insideQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
                currentRow.push(currentCell.trim());
                if (currentRow.some(c => c !== '')) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += char;
            }
        }

        if (currentCell !== '' || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c !== '')) {
                rows.push(currentRow);
            }
        }

        return rows;
    }

    // ========== 2. DATA LOADING, CACHING & FAST SYNCHRONIZATION ==========
    const CACHE_KEYS = {
        PRODUCTS: 'sst_products_catalog_v3',
        SETTINGS: 'sst_store_settings_v3',
        TIMESTAMP: 'sst_catalog_timestamp_v3'
    };

    let lateLoaderTimer = null;
    let lateLoaderUpdateTimer = null;

    function showLateLoader() {
        const el = document.getElementById('shop-late-loader');
        if (el) {
            el.style.display = 'block';
            el.classList.remove('fade-out');
        }
    }

    function updateLateLoaderMessage(text) {
        const desc = document.getElementById('late-loader-desc');
        if (desc) {
            desc.textContent = text;
        }
    }

    function hideLateLoader() {
        if (lateLoaderTimer) {
            clearTimeout(lateLoaderTimer);
            lateLoaderTimer = null;
        }
        if (lateLoaderUpdateTimer) {
            clearTimeout(lateLoaderUpdateTimer);
            lateLoaderUpdateTimer = null;
        }
        const el = document.getElementById('shop-late-loader');
        if (el) {
            el.classList.add('fade-out');
            setTimeout(() => {
                if (el.classList.contains('fade-out')) {
                    el.style.display = 'none';
                }
            }, 300);
        }
    }

    /**
     * Ultra-Fast Catalog Loader:
     * 1. Instant Cache Render (<10ms): If localStorage contains valid products, render immediately.
     * 2. Instant Local Fallback (<40ms): If cache is empty, load products.json immediately.
     * 3. Late Animation: If loading takes >280ms, gracefully display the animated grocery loader.
     * 4. Seamless Background Sync: Synchronize with live Google Sheet without delaying page load.
     */
    async function loadCatalog() {
        let initialRenderDone = false;

        // 1. Try instant localStorage cache
        try {
            const cachedProducts = localStorage.getItem(CACHE_KEYS.PRODUCTS);
            const cachedSettings = localStorage.getItem(CACHE_KEYS.SETTINGS);
            if (cachedProducts) {
                const parsedCached = JSON.parse(cachedProducts);
                if (Array.isArray(parsedCached) && parsedCached.length > 0) {
                    allProducts = parsedCached;
                    if (cachedSettings) {
                        try {
                            const parsedSet = JSON.parse(cachedSettings);
                            settings = Object.assign(settings, parsedSet);
                        } catch (e) {}
                    }
                    finishLoading();
                    initialRenderDone = true;
                }
            }
        } catch (e) {
            console.warn('[Sri Sai Traders] Cache read warning:', e);
        }

        // 2. If no cache, render skeletons & set late animation timer (triggers only if slow > 280ms)
        if (!initialRenderDone) {
            renderSkeletons();
            lateLoaderTimer = setTimeout(() => {
                showLateLoader();
                lateLoaderUpdateTimer = setTimeout(() => {
                    updateLateLoaderMessage('Syncing live store inventory & available stock...');
                }, 2200);
            }, 280);

            // Fetch local bundled catalog immediately (fastest cold start < 40ms)
            try {
                const fallbackRes = await fetch('products.json?v=' + Date.now());
                if (fallbackRes.ok) {
                    const data = await fallbackRes.json();
                    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                        allProducts = data.products.map(p => ({
                            id: p.product_id,
                            name: p.product_name,
                            category: p.category,
                            description: p.description || '',
                            price: p.price !== null && p.price !== '' ? Number(p.price) : null,
                            price_type: p.price_type || 'fixed',
                            unit: p.unit || '',
                            image: resolveProductImage(p.image_url, p.category),
                            stock_quantity: Number(p.stock_quantity) || 0,
                            low_stock_threshold: Number(p.low_stock_threshold) || 5,
                            is_active: p.is_active === true || String(p.is_active).toUpperCase() === 'TRUE',
                            is_featured: p.is_featured === true || String(p.is_featured).toUpperCase() === 'TRUE',
                            sort_order: Number(p.sort_order) || 999,
                            updated_at: p.updated_at || ''
                        }));
                        hideLateLoader();
                        finishLoading();
                        initialRenderDone = true;
                        try {
                            localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(allProducts));
                        } catch (e) {}
                    }
                }
            } catch (fallbackErr) {
                console.warn('[Sri Sai Traders] Local fallback fetch error:', fallbackErr);
            }
        }

        // 3. Trigger non-blocking live Google Sheet synchronization in background
        syncGoogleSheetInBackground(initialRenderDone);
    }

    /**
     * Non-blocking background sync with Google Sheet.
     * Keeps prices, stock, and new items 100% up to date without slowing down page load.
     */
    async function syncGoogleSheetInBackground(alreadyRendered) {
        let liveProducts = null;

        for (const endpoint of getGoogleCsvEndpoints()) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3500);
                const res = await fetch(endpoint, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const text = await res.text();
                    if (!text.trim().startsWith('<') && !text.includes('ServiceLogin') && !text.includes('google-site-verification')) {
                        const parsed = parseProductsCSV(text);
                        if (parsed && parsed.length > 0) {
                            liveProducts = parsed;
                            break;
                        }
                    }
                }
            } catch (err) {
                // Continue to next endpoint
            }
        }

        if (liveProducts && liveProducts.length > 0) {
            allProducts = liveProducts;
            try {
                localStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(liveProducts));
                localStorage.setItem(CACHE_KEYS.TIMESTAMP, String(Date.now()));
            } catch (e) {}

            // Sync settings if available
            for (const setEndpoint of getGoogleSettingsEndpoints()) {
                try {
                    const setRes = await fetch(setEndpoint);
                    if (setRes.ok) {
                        const setText = await setRes.text();
                        if (!setText.trim().startsWith('<')) {
                            parseSettingsCSV(setText);
                            try {
                                localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(settings));
                            } catch (e) {}
                            break;
                        }
                    }
                } catch (e) {}
            }

            hideLateLoader();

            // Seamlessly update catalog and categories without disrupting user's search or cart
            updateCategoryCounts();
            renderProducts();
            updateCartUI();
        } else if (!alreadyRendered) {
            hideLateLoader();
            renderErrorState();
        }
    }

    function parseProductsCSV(csvText) {
        const rows = parseCSV(csvText);
        if (rows.length < 2) return [];

        // Flexible and tolerant header matching
        const headers = rows[0].map(h => h.toLowerCase().trim().replace(/[\s_-]+/g, ''));
        const getIdx = (...patterns) => {
            const cleanPatterns = patterns.map(p => p.toLowerCase().trim().replace(/[\s_-]+/g, ''));
            return headers.findIndex(h => cleanPatterns.some(p => h === p || h.includes(p)));
        };

        const idIdx = getIdx('product_id', 'productid', 'id', 'itemid');
        const nameIdx = getIdx('product_name', 'productname', 'itemname', 'name', 'title');
        const catIdx = getIdx('category', 'categoryname', 'cat');
        const descIdx = getIdx('description', 'desc', 'details');
        const priceIdx = getIdx('price', 'rate', 'cost', 'mrp');
        const priceTypeIdx = getIdx('price_type', 'pricetype', 'type');
        const unitIdx = getIdx('unit', 'pack', 'measure', 'size', 'weight');
        const imgIdx = getIdx('image_url', 'imageurl', 'image', 'photo', 'img');
        const stockIdx = getIdx('stock_quantity', 'stockquantity', 'stock', 'qty', 'quantity');
        const thresholdIdx = getIdx('low_stock_threshold', 'lowstockthreshold', 'threshold', 'lowstock');
        const activeIdx = getIdx('is_active', 'isactive', 'active', 'status', 'enabled');
        const featIdx = getIdx('is_featured', 'isfeatured', 'featured', 'bestseller');
        const sortIdx = getIdx('sort_order', 'sortorder', 'sort', 'order');
        const updateIdx = getIdx('updated_at', 'updatedat', 'updated', 'date');

        const products = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
            if (!name) continue;

            const id = idIdx !== -1 && row[idIdx] ? row[idIdx].trim() : `P-${i}`;
            const cat = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : 'Daily Essentials';
            const desc = descIdx !== -1 ? (row[descIdx] || '').trim() : '';
            
            // Clean price: remove non-numeric currency symbols if present
            const rawPrice = priceIdx !== -1 ? String(row[priceIdx] || '').replace(/[₹,$\s]/g, '') : '';
            const price = rawPrice !== '' && !isNaN(rawPrice) ? Number(rawPrice) : null;
            
            const rawPriceType = priceTypeIdx !== -1 ? (row[priceTypeIdx] || 'fixed').toLowerCase().trim() : 'fixed';
            const priceType = (rawPriceType.includes('variable') || rawPriceType.includes('market')) 
                ? 'variable' 
                : (rawPriceType.includes('request') ? 'on_request' : 'fixed');

            const unit = unitIdx !== -1 ? (row[unitIdx] || '').trim() : '';
            const rawImg = imgIdx !== -1 ? (row[imgIdx] || '').trim() : '';
            const stock = stockIdx !== -1 && !isNaN(row[stockIdx]) ? Number(row[stockIdx]) : 10;
            const threshold = thresholdIdx !== -1 && !isNaN(row[thresholdIdx]) ? Number(row[thresholdIdx]) : 5;
            
            const rawActive = activeIdx !== -1 ? String(row[activeIdx]).toUpperCase().trim() : 'TRUE';
            const isActive = rawActive === 'TRUE' || rawActive === '1' || rawActive === 'YES';
            
            const rawFeat = featIdx !== -1 ? String(row[featIdx]).toUpperCase().trim() : 'FALSE';
            const isFeatured = rawFeat === 'TRUE' || rawFeat === '1' || rawFeat === 'YES';
            
            const sortOrder = sortIdx !== -1 && !isNaN(row[sortIdx]) ? Number(row[sortIdx]) : 999;
            const updatedAt = updateIdx !== -1 ? (row[updateIdx] || '').trim() : '';

            products.push({
                id,
                name,
                category: cat,
                description: desc,
                price,
                price_type: priceType,
                unit,
                image: resolveProductImage(rawImg, cat),
                stock_quantity: stock,
                low_stock_threshold: threshold,
                is_active: isActive,
                is_featured: isFeatured,
                sort_order: sortOrder,
                updated_at: updatedAt
            });
        }

        return products;
    }

    function parseSettingsCSV(csvText) {
        const rows = parseCSV(csvText);
        if (rows.length < 2) return;
        const headers = rows[0].map(h => h.toLowerCase().trim());
        const row = rows[1];

        const nameIdx = headers.indexOf('business_name');
        const waIdx = headers.indexOf('whatsapp_number');
        const curIdx = headers.indexOf('currency');

        if (nameIdx !== -1 && row[nameIdx]) settings.business_name = row[nameIdx];
        if (waIdx !== -1 && row[waIdx]) {
            const cleanWa = row[waIdx].replace(/[^0-9]/g, '');
            if (cleanWa) settings.whatsapp_number = cleanWa;
        }
        if (curIdx !== -1 && row[curIdx]) settings.currency = row[curIdx];
    }

    function finishLoading() {
        updateCategoryCounts();
        renderProducts();
        initCartFromStorage();
        updateCartUI();
    }

    function updateCategoryCounts() {
        const activeItems = allProducts.filter(p => p.is_active);

        const countMap = {
            'All': activeItems.length,
            'Our Own Dairy': 0,
            'Rice & Grains': 0,
            'Oils': 0,
            'Spices & Pastes': 0,
            'Snacks & Chocolates': 0,
            'Cool Drinks': 0,
            'Daily Essentials': 0,
            'Home Cleaning': 0,
            'Disposable & Packaging': 0
        };

        activeItems.forEach(p => {
            const norm = normalizeCategoryName(p.category);
            if (countMap[norm] !== undefined) {
                countMap[norm]++;
            }
        });

        // Update chip badge elements
        const idMap = {
            'All': 'cat-count-all',
            'Our Own Dairy': 'cat-count-dairy',
            'Rice & Grains': 'cat-count-grains',
            'Oils': 'cat-count-oils',
            'Spices & Pastes': 'cat-count-spices',
            'Snacks & Chocolates': 'cat-count-snacks',
            'Cool Drinks': 'cat-count-drinks',
            'Daily Essentials': 'cat-count-essentials',
            'Home Cleaning': 'cat-count-cleaning',
            'Disposable & Packaging': 'cat-count-disposable'
        };

        for (const [catName, id] of Object.entries(idMap)) {
            const el = document.getElementById(id);
            if (el) el.textContent = countMap[catName] !== undefined ? countMap[catName] : '0';
        }
    }

    // ========== 3. FILTERING & SORTING ==========
    function getFilteredProducts() {
        let list = allProducts.filter(p => p.is_active);

        // Category Filter
        if (currentCategory !== 'All') {
            list = list.filter(p => {
                const normSelected = normalizeCategoryName(currentCategory);
                const normProd = normalizeCategoryName(p.category);
                return normSelected === normProd;
            });
        }

        // Search Query Filter
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.unit && p.unit.toLowerCase().includes(q))
            );
        }

        // In-Stock Only
        if (inStockOnly) {
            list = list.filter(p => p.stock_quantity > 0);
        }

        // Sorting
        list.sort((a, b) => {
            if (sortMode === 'featured') {
                if (a.is_featured !== b.is_featured) {
                    return a.is_featured ? -1 : 1;
                }
                return a.sort_order - b.sort_order;
            } else if (sortMode === 'price-low') {
                const priceA = a.price !== null ? a.price : 999999;
                const priceB = b.price !== null ? b.price : 999999;
                return priceA - priceB;
            } else if (sortMode === 'price-high') {
                const priceA = a.price !== null ? a.price : -1;
                const priceB = b.price !== null ? b.price : -1;
                return priceB - priceA;
            } else if (sortMode === 'name-az') {
                return a.name.localeCompare(b.name);
            } else if (sortMode === 'newest') {
                return (b.updated_at || '').localeCompare(a.updated_at || '');
            }
            return 0;
        });

        return list;
    }

    // ========== 4. RENDERING PRODUCT CARDS ==========
    function renderProducts() {
        const grid = document.getElementById('shop-product-grid');
        const countLabel = document.getElementById('product-count-label');
        const activeTitleEl = document.getElementById('active-category-title');

        if (!grid) return;

        const filtered = getFilteredProducts();

        // Update title & counter
        if (activeTitleEl) activeTitleEl.textContent = currentCategory === 'All' ? 'All Items' : currentCategory;
        if (countLabel) {
            countLabel.textContent = `${filtered.length} product${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = renderEmptyState();
            return;
        }

        grid.innerHTML = filtered.map((p, idx) => renderCardHTML(p, idx)).join('');
    }

    function renderCardHTML(p, idx) {
        const isOutOfStock = p.stock_quantity <= 0;
        const isLowStock = !isOutOfStock && p.stock_quantity <= p.low_stock_threshold;

        const cartItem = cart.find(item => item.id === p.id);
        const qtyInCart = cartItem ? cartItem.quantity : 0;
        const isAtMaxStock = qtyInCart >= p.stock_quantity;

        // Above-the-fold image priority loading for ultra-fast perceived performance
        const isPriority = typeof idx === 'number' && idx < 6;
        const imgLoadingAttrs = isPriority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';

        // Pricing Format
        let priceHtml = '';
        if (p.price_type === 'fixed' && p.price !== null) {
            priceHtml = `
                <div class="card-price-wrap">
                    <span class="price-main">₹${p.price}</span>
                    ${p.unit ? `<span class="price-unit-sub">/ ${escapeHtml(p.unit)}</span>` : ''}
                </div>
            `;
        } else if (p.price_type === 'variable') {
            priceHtml = `
                <div class="card-price-wrap">
                    <span class="price-main">₹${p.price || '--'}</span>
                    <span class="price-badge-variable"><i class="fas fa-scale-balanced"></i> Market Rate</span>
                </div>
            `;
        } else {
            priceHtml = `
                <div class="card-price-wrap">
                    <span class="price-badge-request"><i class="fas fa-comment-dots"></i> Price on Request</span>
                </div>
            `;
        }

        // Action controls (Add button vs Stepper)
        let actionHtml = '';
        if (isOutOfStock) {
            actionHtml = `
                <button class="btn-card-out" disabled title="Item is currently out of stock">
                    <i class="fas fa-ban"></i> Out of Stock
                </button>
            `;
        } else if (qtyInCart > 0) {
            actionHtml = `
                <div class="card-stepper" id="stepper-${p.id}">
                    <button class="card-stepper-btn minus" onclick="window.changeItemQty('${p.id}', -1)" aria-label="Decrease quantity">
                        <i class="fas ${qtyInCart === 1 ? 'fa-trash-can' : 'fa-minus'}"></i>
                    </button>
                    <span class="card-stepper-qty">${qtyInCart}</span>
                    <button class="card-stepper-btn plus" onclick="window.changeItemQty('${p.id}', 1)"
                        ${isAtMaxStock ? 'disabled title="Maximum available stock reached"' : ''} aria-label="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
        } else {
            actionHtml = `
                <button class="btn-card-add" onclick="window.addItemToCart('${p.id}')" aria-label="Add ${escapeHtml(p.name)} to cart">
                    <i class="fas fa-plus"></i> Add
                </button>
            `;
        }

        // Badges on image
        let badgeHtml = '';
        if (p.is_featured) {
            badgeHtml += `<span class="badge-featured"><i class="fas fa-star"></i> Featured</span>`;
        }
        if (isOutOfStock) {
            badgeHtml += `<span class="badge-stock out"><i class="fas fa-circle-xmark"></i> Out of Stock</span>`;
        } else if (isLowStock) {
            badgeHtml += `<span class="badge-stock low"><i class="fas fa-triangle-exclamation"></i> Only ${p.stock_quantity} left</span>`;
        }

        return `
            <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-id="${p.id}">
                <div class="card-image-wrap" onclick="window.openQuickViewModal('${p.id}')" role="button" tabindex="0" aria-label="View ${escapeHtml(p.name)}">
                    <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="card-product-img" ${imgLoadingAttrs} decoding="async" referrerpolicy="no-referrer" width="300" height="300"
                        onerror="window.handleImageError(this, '${escapeHtml(p.category)}');">
                    ${badgeHtml}
                </div>

                <div class="card-content">
                    <span class="card-category-tag">${escapeHtml(p.category)}</span>
                    <h3 class="card-title" onclick="window.openQuickViewModal('${p.id}')">
                        ${escapeHtml(p.name)}
                    </h3>

                    ${p.unit ? `<span class="card-unit-pill">${escapeHtml(p.unit)}</span>` : ''}

                    ${p.description ? `<p class="card-desc">${escapeHtml(p.description)}</p>` : ''}

                    <div class="card-bottom-row">
                        ${priceHtml}
                        <div class="card-action-wrap">
                            ${actionHtml}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    function renderEmptyState() {
        return `
            <div class="shop-empty-state">
                <div class="empty-icon-wrap">
                    <i class="fas fa-basket-shopping"></i>
                </div>
                <h3>No Products Found</h3>
                <p>We couldn't find items matching your criteria. Try resetting filters or search on WhatsApp.</p>
                <div class="empty-action-group">
                    <button class="btn-empty-reset" onclick="window.resetShopFilters()">
                        <i class="fas fa-rotate-left"></i> View All Products
                    </button>
                    <a href="https://wa.me/${settings.whatsapp_number}?text=Hi%20Sri%20Sai%20Traders,%20do%20you%20have%20${encodeURIComponent(searchQuery || 'this grocery item')}%20available%20in%20store?"
                        target="_blank" rel="noopener noreferrer" class="btn-empty-wa">
                        <i class="fab fa-whatsapp"></i> Ask on WhatsApp
                    </a>
                </div>
            </div>
        `;
    }

    function renderSkeletons() {
        const grid = document.getElementById('shop-product-grid');
        if (!grid) return;
        const skeletons = Array(8).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-box skeleton-img"></div>
                <div class="skeleton-box skeleton-tag"></div>
                <div class="skeleton-box skeleton-title"></div>
                <div class="skeleton-box skeleton-price"></div>
            </div>
        `).join('');
        grid.innerHTML = skeletons;
    }

    function renderErrorState() {
        const grid = document.getElementById('shop-product-grid');
        if (!grid) return;
        grid.innerHTML = `
            <div class="shop-empty-state">
                <div class="empty-icon-wrap" style="color: #C53030;">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>
                <h3>Unable to Load Products</h3>
                <p>We are having trouble connecting to the store inventory. Please refresh the page or message Sri Sai Traders on WhatsApp.</p>
                <div class="empty-action-group">
                    <button class="btn-empty-reset" onclick="window.location.reload()">
                        <i class="fas fa-arrow-rotate-right"></i> Refresh Page
                    </button>
                    <a href="https://wa.me/${CONFIG.DEFAULT_WA_NUMBER}?text=Hi%20Sri%20Sai%20Traders,%20the%20website%20product%20catalog%20is%20not%20loading."
                        target="_blank" rel="noopener noreferrer" class="btn-empty-wa">
                        <i class="fab fa-whatsapp"></i> Contact on WhatsApp
                    </a>
                </div>
            </div>
        `;
    }

    // ========== 5. CART OPERATIONS & STORAGE ==========
    function initCartFromStorage() {
        try {
            const saved = localStorage.getItem('sst_cart');
            if (saved) {
                cart = JSON.parse(saved);
                // Clean up stale or inactive items
                cart = cart.filter(item => {
                    const prod = allProducts.find(p => p.id === item.id);
                    return prod && prod.is_active;
                });
            }
        } catch (e) {
            cart = [];
        }
    }

    function saveCartToStorage() {
        try {
            localStorage.setItem('sst_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }

    window.addItemToCart = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        if (!product.is_active || product.stock_quantity <= 0) {
            showToast(`⚠️ ${product.name} is currently out of stock!`);
            return;
        }

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            if (existing.quantity >= product.stock_quantity) {
                showToast(`⚠️ Max available stock (${product.stock_quantity}) reached for ${product.name}`);
                return;
            }
            existing.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                price_type: product.price_type,
                unit: product.unit,
                image: product.image,
                quantity: 1
            });
        }

        saveCartToStorage();
        updateCartUI();
        renderProducts();
        showToast(`✓ Added ${product.name} to cart`);
    };

    window.changeItemQty = (productId, delta) => {
        const existing = cart.find(item => item.id === productId);
        if (!existing) return;

        const product = allProducts.find(p => p.id === productId);
        const maxStock = product ? product.stock_quantity : 999;

        if (delta > 0) {
            if (existing.quantity >= maxStock) {
                showToast(`⚠️ Only ${maxStock} available in stock!`);
                return;
            }
            existing.quantity++;
        } else if (delta < 0) {
            existing.quantity--;
            if (existing.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
                showToast(`Removed ${existing.name} from cart`);
            }
        }

        saveCartToStorage();
        updateCartUI();
        renderProducts();
    };

    window.removeItemFromCart = (productId) => {
        const item = cart.find(i => i.id === productId);
        const name = item ? item.name : 'Item';
        cart = cart.filter(i => i.id !== productId);
        saveCartToStorage();
        updateCartUI();
        renderProducts();
        showToast(`Removed ${name} from cart`);
    };

    window.clearCart = () => {
        if (cart.length === 0) return;
        if (confirm('Are you sure you want to clear your shopping cart?')) {
            cart = [];
            saveCartToStorage();
            updateCartUI();
            renderProducts();
            showToast('Shopping cart cleared');
        }
    };

    // ========== 6. CART UI & STICKY BAR UPDATES ==========
    function updateCartUI() {
        const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

        let fixedSubtotal = 0;
        let variableCount = 0;
        let allPricesFixed = true;

        cart.forEach(item => {
            if (item.price_type === 'fixed' && item.price !== null && !isNaN(item.price)) {
                fixedSubtotal += item.price * item.quantity;
            } else {
                allPricesFixed = false;
                variableCount += item.quantity;
            }
        });

        // 1. Header Cart Button
        const headerCount = document.getElementById('header-cart-count');
        const headerTotal = document.getElementById('header-cart-total');
        if (headerCount) headerCount.textContent = totalItemsCount;
        if (headerTotal) {
            if (totalItemsCount === 0) {
                headerTotal.textContent = '₹0';
            } else if (allPricesFixed) {
                headerTotal.textContent = `₹${fixedSubtotal}`;
            } else if (fixedSubtotal > 0) {
                headerTotal.textContent = `₹${fixedSubtotal}+`;
            } else {
                headerTotal.textContent = 'Enquiry';
            }
        }

        // 2. Cart Drawer Count & Totals
        const drawerCount = document.getElementById('cart-drawer-count');
        const totalCountEl = document.getElementById('cart-total-count');
        const subtotalDisplay = document.getElementById('cart-subtotal-display');
        const confirmationRow = document.getElementById('cart-confirmation-row');
        const confirmationBadge = document.getElementById('cart-confirmation-badge');
        const totalDisplay = document.getElementById('cart-total-display');
        const totalLabel = document.getElementById('cart-total-label');

        if (drawerCount) drawerCount.textContent = `${totalItemsCount} item${totalItemsCount === 1 ? '' : 's'}`;
        if (totalCountEl) totalCountEl.textContent = totalItemsCount;
        if (subtotalDisplay) subtotalDisplay.textContent = `₹${fixedSubtotal}`;

        if (confirmationRow && confirmationBadge) {
            if (!allPricesFixed && variableCount > 0) {
                confirmationRow.classList.remove('hide');
                confirmationBadge.textContent = `${variableCount} item(s) on confirmation`;
            } else {
                confirmationRow.classList.add('hide');
            }
        }

        if (totalDisplay && totalLabel) {
            if (allPricesFixed) {
                totalLabel.textContent = 'Total Amount:';
                totalDisplay.textContent = `₹${fixedSubtotal}`;
            } else if (fixedSubtotal > 0) {
                totalLabel.textContent = 'Estimated Total:';
                totalDisplay.textContent = `₹${fixedSubtotal} + Confirmation`;
            } else {
                totalLabel.textContent = 'Estimated Total:';
                totalDisplay.textContent = 'Price on Confirmation';
            }
        }

        // 3. Render Drawer Items
        const itemsContainer = document.getElementById('cart-items-container');
        if (itemsContainer) {
            if (cart.length === 0) {
                itemsContainer.innerHTML = `
                    <div class="cart-empty-view">
                        <div class="cart-empty-icon">
                            <i class="fas fa-basket-shopping"></i>
                        </div>
                        <h4>Your shopping cart is empty</h4>
                        <p>Browse our farm-fresh buffalo milk, cooking oils, rice, and daily groceries to place an order enquiry.</p>
                        <button class="btn-start-shopping" onclick="window.closeCartDrawer()">
                            <i class="fas fa-bag-shopping"></i> Start Shopping
                        </button>
                    </div>
                `;
            } else {
                itemsContainer.innerHTML = cart.map(item => {
                    const prod = allProducts.find(p => p.id === item.id);
                    const maxStock = prod ? prod.stock_quantity : 999;
                    const isAtMax = item.quantity >= maxStock;

                    let calcPrice = '';
                    if (item.price_type === 'fixed' && item.price !== null) {
                        const lineTotal = item.price * item.quantity;
                        calcPrice = `₹${item.price} each → <strong>₹${lineTotal}</strong>`;
                    } else if (item.price_type === 'variable') {
                        calcPrice = `<span class="price-badge-variable"><i class="fas fa-scale-balanced"></i> Market Rate</span>`;
                    } else {
                        calcPrice = `<span class="price-badge-request"><i class="fas fa-comment-dots"></i> Price on Request</span>`;
                    }

                    return `
                        <div class="cart-item-row">
                            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-thumb"
                                loading="lazy" decoding="async" referrerpolicy="no-referrer" width="60" height="60"
                                onerror="window.handleImageError(this, '${escapeHtml(item.category)}');">
                            <div class="cart-item-info">
                                <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
                                ${item.unit ? `<span class="cart-item-unit">${escapeHtml(item.unit)}</span>` : ''}
                                <div class="cart-item-price-calc">${calcPrice}</div>
                            </div>
                            <div class="cart-stepper-mini">
                                <button onclick="window.changeItemQty('${item.id}', -1)" aria-label="Decrease">
                                    <i class="fas ${item.quantity === 1 ? 'fa-trash-can' : 'fa-minus'}"></i>
                                </button>
                                <span>${item.quantity}</span>
                                <button onclick="window.changeItemQty('${item.id}', 1)"
                                    ${isAtMax ? 'disabled title="Max stock reached"' : ''} aria-label="Increase">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="cart-item-delete" onclick="window.removeItemFromCart('${item.id}')" title="Remove item">
                                <i class="fas fa-xmark"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
        }

        // 4. Update Instamart-Style Sticky Bottom Bar
        updateStickyBottomBar(totalItemsCount, fixedSubtotal, allPricesFixed);
    }

    function updateStickyBottomBar(count, subtotal, allFixed) {
        const bar = document.getElementById('sticky-cart-bar');
        const titleEl = document.getElementById('sticky-cart-title');
        const subEl = document.getElementById('sticky-cart-sub');
        if (!bar) return;

        if (count > 0) {
            bar.classList.add('visible');
            if (titleEl) {
                let priceText = '';
                if (allFixed) {
                    priceText = ` • ₹${subtotal}`;
                } else if (subtotal > 0) {
                    priceText = ` • ₹${subtotal} + Confirmation`;
                } else {
                    priceText = ' • Price on Confirmation';
                }
                titleEl.textContent = `${count} Item${count === 1 ? '' : 's'}${priceText}`;
            }
            if (subEl) {
                subEl.textContent = 'Tap to view cart & checkout on WhatsApp';
            }
        } else {
            bar.classList.remove('visible');
        }
    }

    // ========== 7. WHATSAPP CHECKOUT LOGIC ==========
    function validateCustomerName(rawName) {
        if (!rawName) return false;
        const trimmed = rawName.trim();
        // At least 2 characters with letters
        return trimmed.length >= 2 && /[a-zA-Z]/.test(trimmed);
    }

    function validateMobileNumber(rawPhone) {
        if (!rawPhone) return { isValid: false, cleanNumber: '' };
        let cleaned = String(rawPhone).replace(/[\s\-\(\)\.]/g, '');
        if (cleaned.startsWith('+91') && cleaned.length === 13) {
            cleaned = cleaned.substring(3);
        } else if (cleaned.startsWith('91') && cleaned.length === 12) {
            cleaned = cleaned.substring(2);
        } else if (cleaned.startsWith('0') && cleaned.length === 11) {
            cleaned = cleaned.substring(1);
        }
        // Valid Indian mobile: exactly 10 digits starting with 6, 7, 8, or 9
        const isValid = /^[6-9]\d{9}$/.test(cleaned);
        return { isValid, cleanNumber: cleaned };
    }

    function setupCheckout() {
        const checkoutBtn = document.getElementById('checkout-whatsapp');
        const nameInput = document.getElementById('order-customer-name');
        const phoneInput = document.getElementById('order-customer-phone');
        const collectionSelect = document.getElementById('order-collection-type');
        const nameErrorEl = document.getElementById('name-error-msg');
        const phoneErrorEl = document.getElementById('phone-error-msg');

        if (!checkoutBtn) return;

        // Restore previously saved customer details for fast repeat ordering
        try {
            const savedName = localStorage.getItem('sst_saved_customer_name');
            const savedPhone = localStorage.getItem('sst_saved_customer_phone');
            if (savedName && nameInput && !nameInput.value) nameInput.value = savedName;
            if (savedPhone && phoneInput && !phoneInput.value) phoneInput.value = savedPhone;
        } catch (e) {}

        // Real-time live validation listeners
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (validateCustomerName(nameInput.value)) {
                    nameInput.classList.remove('input-invalid');
                    if (nameErrorEl) nameErrorEl.style.display = 'none';
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                // Keep only numeric digits and max 10 digits
                phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '').slice(0, 10);
                if (validateMobileNumber(phoneInput.value).isValid) {
                    phoneInput.classList.remove('input-invalid');
                    if (phoneErrorEl) phoneErrorEl.style.display = 'none';
                }
            });
        }

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('⚠️ Your shopping cart is empty!');
                return;
            }

            const customerName = nameInput ? nameInput.value.trim() : '';
            const rawPhone = phoneInput ? phoneInput.value.trim() : '';
            const collectionMethod = collectionSelect ? collectionSelect.value : 'Store Pickup at B-Camp, Kurnool';

            // Strict Validation: Name and Valid Mobile Number are REQUIRED
            const isNameValid = validateCustomerName(customerName);
            const phoneValidation = validateMobileNumber(rawPhone);
            let hasError = false;

            if (!isNameValid) {
                hasError = true;
                if (nameInput) {
                    nameInput.classList.add('input-invalid');
                    nameInput.focus();
                }
                if (nameErrorEl) nameErrorEl.style.display = 'flex';
            } else {
                if (nameInput) nameInput.classList.remove('input-invalid');
                if (nameErrorEl) nameErrorEl.style.display = 'none';
            }

            if (!phoneValidation.isValid) {
                if (!hasError && phoneInput) {
                    phoneInput.focus();
                }
                hasError = true;
                if (phoneInput) phoneInput.classList.add('input-invalid');
                if (phoneErrorEl) phoneErrorEl.style.display = 'flex';
            } else {
                if (phoneInput) phoneInput.classList.remove('input-invalid');
                if (phoneErrorEl) phoneErrorEl.style.display = 'none';
            }

            // Block checkout if either field is missing or invalid
            if (hasError) {
                if (!isNameValid && !phoneValidation.isValid) {
                    showToast('⚠️ Please enter your name and a valid 10-digit mobile number.');
                } else if (!isNameValid) {
                    showToast('⚠️ Please enter your full name to proceed.');
                } else {
                    showToast('⚠️ Please enter a valid 10-digit mobile number.');
                }
                return;
            }

            // Save valid customer info for future checkouts
            try {
                localStorage.setItem('sst_saved_customer_name', customerName);
                localStorage.setItem('sst_saved_customer_phone', phoneValidation.cleanNumber);
            } catch (e) {}

            let fixedSubtotal = 0;
            const variableItems = [];
            let allFixed = true;

            const itemsText = cart.map((item, index) => {
                const unitStr = item.unit ? ` (${item.unit})` : '';
                let priceLine = '';

                if (item.price_type === 'fixed' && item.price !== null && !isNaN(item.price)) {
                    const lineTotal = item.price * item.quantity;
                    fixedSubtotal += lineTotal;
                    priceLine = `₹${item.price} each = ₹${lineTotal}`;
                } else if (item.price_type === 'variable') {
                    allFixed = false;
                    variableItems.push(item.name);
                    priceLine = `₹${item.price || '--'} (Market Rate - Confirm with store)`;
                } else {
                    allFixed = false;
                    variableItems.push(item.name);
                    priceLine = `Price on Request (Confirm with store)`;
                }

                return `${index + 1}. *${item.name}*${unitStr}\n   Qty: ${item.quantity} | ${priceLine}`;
            }).join('\n\n');

            let pricingSummary = '';
            if (allFixed) {
                pricingSummary = `*Total Amount:* ₹${fixedSubtotal}`;
            } else if (fixedSubtotal > 0) {
                pricingSummary = `*Subtotal (Fixed Items):* ₹${fixedSubtotal}\n*Items Needing Price Confirmation:* ${variableItems.join(', ')}\n*Estimated Total:* ₹${fixedSubtotal} + Confirmation`;
            } else {
                pricingSummary = `*Items Needing Price Confirmation:* ${variableItems.join(', ')}\n*Pricing:* To be confirmed by store on WhatsApp`;
            }

            const customerBlock =
                `*Customer Details:*\n` +
                `👤 *Name:* ${customerName}\n` +
                `📱 *Mobile:* +91 ${phoneValidation.cleanNumber}\n\n`;

            const message =
                `🛒 *ORDER ENQUIRY — SRI SAI TRADERS*\n` +
                `Dairy Farm & Kirana Store, Kurnool\n` +
                `----------------------------------------\n` +
                customerBlock +
                `----------------------------------------\n` +
                `${itemsText}\n` +
                `----------------------------------------\n` +
                `${pricingSummary}\n\n` +
                `*Order Preference:*\n` +
                `📍 ${collectionMethod}\n` +
                `----------------------------------------\n` +
                `⚠️ *Important Note:*\n` +
                `This is an order enquiry from our website. Sri Sai Traders will verify stock and reply to confirm your order. No payment or stock deduction has occurred.`;

            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/${settings.whatsapp_number}?text=${encoded}`, '_blank');
        });
    }

    // Direct WhatsApp Buy for single product
    window.buySingleWhatsApp = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        if (product.stock_quantity <= 0) {
            showToast(`⚠️ ${product.name} is currently out of stock!`);
            return;
        }

        const unitStr = product.unit ? ` (${product.unit})` : '';
        const priceStr = product.price_type === 'fixed' && product.price !== null
            ? `₹${product.price}`
            : (product.price_type === 'variable' ? `₹${product.price || '--'} (Market Rate)` : 'Price on Request');

        const message =
            `🛒 *INSTANT ORDER — SRI SAI TRADERS*\n` +
            `----------------------------------------\n` +
            `1. *${product.name}*${unitStr}\n` +
            `   Qty: 1 | Price: ${priceStr}\n` +
            `----------------------------------------\n` +
            `*Preference:* Store Pickup at B-Camp, Kurnool\n` +
            `Please confirm availability. Thank you!`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${settings.whatsapp_number}?text=${encoded}`, '_blank');
    };

    // ========== 8. DRAWER & MODAL CONTROLS ==========
    function setupDrawerAndModals() {
        const sidebar = document.getElementById('cart-sidebar');
        const backdrop = document.getElementById('cart-backdrop');
        const headerCartBtn = document.getElementById('header-cart-btn');
        const stickyCheckoutBtn = document.getElementById('sticky-cart-checkout-btn');
        const closeBtn = document.getElementById('close-cart-btn');
        const clearBtn = document.getElementById('clear-cart-btn');

        window.openCartDrawer = () => {
            if (sidebar) sidebar.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        window.closeCartDrawer = () => {
            if (sidebar) sidebar.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (headerCartBtn) headerCartBtn.addEventListener('click', window.openCartDrawer);
        if (stickyCheckoutBtn) stickyCheckoutBtn.addEventListener('click', window.openCartDrawer);
        if (closeBtn) closeBtn.addEventListener('click', window.closeCartDrawer);
        if (backdrop) backdrop.addEventListener('click', window.closeCartDrawer);
        if (clearBtn) clearBtn.addEventListener('click', window.clearCart);

        // Escape key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeCartDrawer();
                window.closeQuickViewModal();
            }
        });
    }

    // Quick View Modal
    window.openQuickViewModal = (productId) => {
        const p = allProducts.find(item => item.id === productId);
        const modal = document.getElementById('quick-view-modal');
        if (!p || !modal) return;

        const isOutOfStock = p.stock_quantity <= 0;
        const isLowStock = !isOutOfStock && p.stock_quantity <= p.low_stock_threshold;

        const modalImg = document.getElementById('modal-img');
        if (modalImg) {
            modalImg.src = p.image;
            modalImg.alt = p.name;
            modalImg.decoding = 'async';
            modalImg.setAttribute('referrerpolicy', 'no-referrer');
            modalImg.onerror = function () {
                window.handleImageError(this, p.category);
            };
        }
        document.getElementById('modal-title').textContent = p.name;
        document.getElementById('modal-category').textContent = p.category;
        document.getElementById('modal-unit').textContent = p.unit ? `Pack / Measure: ${p.unit}` : '';
        document.getElementById('modal-desc').textContent = p.description || 'Quality product sourced and stocked by Sri Sai Traders, Kurnool.';

        const priceEl = document.getElementById('modal-price');
        if (p.price_type === 'fixed' && p.price !== null) {
            priceEl.textContent = `₹${p.price} ${p.unit ? `/ ${p.unit}` : ''}`;
        } else if (p.price_type === 'variable') {
            priceEl.textContent = `₹${p.price || '--'} (Daily Market Rate)`;
        } else {
            priceEl.textContent = `Price on Request`;
        }

        const stockEl = document.getElementById('modal-stock');
        if (isOutOfStock) {
            stockEl.innerHTML = `<span class="badge-stock out"><i class="fas fa-circle-xmark"></i> Out of Stock</span>`;
        } else if (isLowStock) {
            stockEl.innerHTML = `<span class="badge-stock low"><i class="fas fa-triangle-exclamation"></i> Low Stock: Only ${p.stock_quantity} left</span>`;
        } else {
            stockEl.innerHTML = `<span style="color: var(--sst-green); font-size: 0.8rem; font-weight: 700;"><i class="fas fa-circle-check"></i> In Stock (${p.stock_quantity} available)</span>`;
        }

        const actionsEl = document.getElementById('modal-actions');
        if (isOutOfStock) {
            actionsEl.innerHTML = `
                <button class="btn-card-out" disabled><i class="fas fa-ban"></i> Out of Stock</button>
                <a href="https://wa.me/${settings.whatsapp_number}?text=Hi%20Sri%20Sai%20Traders,%20when%20will%20${encodeURIComponent(p.name)}%20be%20available?"
                    target="_blank" rel="noopener noreferrer" class="btn-modal-wa">
                    <i class="fab fa-whatsapp"></i> Inquire Availability
                </a>
            `;
        } else {
            actionsEl.innerHTML = `
                <button class="btn-modal-add" onclick="window.addItemToCart('${p.id}'); window.closeQuickViewModal();">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-modal-wa" onclick="window.buySingleWhatsApp('${p.id}'); window.closeQuickViewModal();">
                    <i class="fab fa-whatsapp"></i> Buy on WhatsApp
                </button>
            `;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeQuickViewModal = () => {
        const modal = document.getElementById('quick-view-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', window.closeQuickViewModal);
    const modalBackdrop = document.getElementById('quick-view-modal');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) window.closeQuickViewModal();
        });
    }

    // ========== 9. FILTER & SEARCH CONTROLS ==========
    function setupFilterControls() {
        // Category Chips
        const chips = document.querySelectorAll('.cat-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentCategory = chip.getAttribute('data-category');
                renderProducts();
            });
        });

        // Category Horizontal Arrows
        const scrollTrack = document.getElementById('shop-categories-track');
        const arrowLeft = document.getElementById('cat-scroll-left');
        const arrowRight = document.getElementById('cat-scroll-right');

        if (arrowLeft && scrollTrack) {
            arrowLeft.addEventListener('click', () => {
                scrollTrack.scrollBy({ left: -220, behavior: 'smooth' });
            });
        }
        if (arrowRight && scrollTrack) {
            arrowRight.addEventListener('click', () => {
                scrollTrack.scrollBy({ left: 220, behavior: 'smooth' });
            });
        }

        // Hero Search Input
        const heroInput = document.getElementById('shop-search-input');
        const heroClear = document.getElementById('shop-search-clear');
        const heroSubmit = document.getElementById('shop-search-submit');

        // Header Search Input
        const headerInput = document.getElementById('header-search-input');
        const headerClear = document.getElementById('header-search-clear');

        function syncSearch(value) {
            searchQuery = value;
            if (heroInput && heroInput.value !== value) heroInput.value = value;
            if (headerInput && headerInput.value !== value) headerInput.value = value;

            if (heroClear) heroClear.classList.toggle('hide', value.trim() === '');
            if (headerClear) headerClear.classList.toggle('hide', value.trim() === '');

            renderProducts();
        }

        if (heroInput) {
            heroInput.addEventListener('input', (e) => syncSearch(e.target.value));
        }
        if (heroClear) {
            heroClear.addEventListener('click', () => {
                syncSearch('');
                if (heroInput) heroInput.focus();
            });
        }
        if (heroSubmit) {
            heroSubmit.addEventListener('click', () => renderProducts());
        }

        if (headerInput) {
            headerInput.addEventListener('input', (e) => syncSearch(e.target.value));
        }
        if (headerClear) {
            headerClear.addEventListener('click', () => {
                syncSearch('');
                if (headerInput) headerInput.focus();
            });
        }

        // Suggestion Chips
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const term = chip.getAttribute('data-search');
                syncSearch(term);
                // Scroll to product grid smoothly
                const toolbar = document.querySelector('.shop-toolbar');
                if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // In-Stock Only Toggle
        const inStockBtn = document.getElementById('in-stock-filter-toggle');
        if (inStockBtn) {
            inStockBtn.addEventListener('click', () => {
                inStockOnly = !inStockOnly;
                inStockBtn.classList.toggle('active', inStockOnly);
                inStockBtn.setAttribute('aria-pressed', inStockOnly ? 'true' : 'false');
                renderProducts();
            });
        }

        // Sorting Select
        const sortSelect = document.getElementById('shop-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortMode = e.target.value;
                renderProducts();
            });
        }
    }

    // Global Reset Filters
    window.resetShopFilters = () => {
        currentCategory = 'All';
        searchQuery = '';
        inStockOnly = false;
        sortMode = 'featured';

        const heroInput = document.getElementById('shop-search-input');
        const headerInput = document.getElementById('header-search-input');
        const heroClear = document.getElementById('shop-search-clear');
        const headerClear = document.getElementById('header-search-clear');
        const inStockBtn = document.getElementById('in-stock-filter-toggle');
        const sortSelect = document.getElementById('shop-sort-select');

        if (heroInput) heroInput.value = '';
        if (headerInput) headerInput.value = '';
        if (heroClear) heroClear.classList.add('hide');
        if (headerClear) headerClear.classList.add('hide');
        if (inStockBtn) {
            inStockBtn.classList.remove('active');
            inStockBtn.setAttribute('aria-pressed', 'false');
        }
        if (sortSelect) sortSelect.value = 'featured';

        // Reset category chips
        const chips = document.querySelectorAll('.cat-chip');
        chips.forEach(c => {
            if (c.getAttribute('data-category') === 'All') {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        renderProducts();
    };

    // Global Select Category (e.g. from footer)
    window.selectCategory = (categoryName) => {
        currentCategory = categoryName;
        const chips = document.querySelectorAll('.cat-chip');
        chips.forEach(c => {
            if (c.getAttribute('data-category') === categoryName) {
                c.classList.add('active');
                c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                c.classList.remove('active');
            }
        });
        renderProducts();
        const toolbar = document.querySelector('.shop-toolbar');
        if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ========== 10. TOAST SYSTEM ==========
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'shop-toast';
        toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Animate out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 2200);
    }

    // ========== 11. ROTATING PREMIUM QUOTE TICKER ==========
    function initQuoteTicker() {
        const slides = document.querySelectorAll('.quote-slide');
        if (!slides || slides.length === 0) return;

        let currentIndex = 0;
        let tickerInterval = null;
        const ROTATE_INTERVAL = 4500; // 4.5 seconds

        function showSlide(index) {
            slides.forEach((slide, idx) => {
                if (idx === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        function startTicker() {
            if (!tickerInterval) {
                tickerInterval = setInterval(nextSlide, ROTATE_INTERVAL);
            }
        }

        function stopTicker() {
            if (tickerInterval) {
                clearInterval(tickerInterval);
                tickerInterval = null;
            }
        }

        const container = document.getElementById('quote-ticker-bar');
        if (container) {
            container.addEventListener('mouseenter', stopTicker);
            container.addEventListener('mouseleave', startTicker);
            container.addEventListener('touchstart', stopTicker, { passive: true });
            container.addEventListener('touchend', startTicker, { passive: true });
        }

        startTicker();
    }

    // ========== 12. INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        initQuoteTicker();
        setupFilterControls();
        setupDrawerAndModals();
        setupCheckout();
        loadCatalog();
    });

})();
