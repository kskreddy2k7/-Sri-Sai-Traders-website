/**
 * SRI SAI TRADERS — Premium Interactive JavaScript
 * Particles, 3D tilt, scroll reveal, counter animation, smooth scrolling
 */

(function () {
    'use strict';
    
    // ========== SECURITY & STABILITY UTILITIES ==========
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const sanitizeInput = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null || price === '') return 'Market Price';
        const num = parseFloat(price);
        return isNaN(num) ? String(price) : `₹${num}`;
    };

    const getItemPriceTotal = (price, qty) => {
        const num = parseFloat(price);
        return isNaN(num) ? String(price) : `₹${num * (qty || 1)}`;
    };

    const handleFetchError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        const productContainer = document.getElementById('featured-products-container');
        if (productContainer && productContainer.innerHTML.includes('Loading')) {
            productContainer.innerHTML = `
                <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: var(--text-primary);">Unable to load products</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 25px;">Please check your connection and try again.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Retry Loading</button>
                </div>
            `;
        }
        showToast("⚠️ Connection issue. Some data may not load correctly.");
    };

    // ========== LUXURY CSS BACKGROUND ==========
    const canvas = document.getElementById('particle-canvas');
    if (canvas) canvas.remove(); // Remove legacy canvas

    const bgContainer = document.createElement('div');
    bgContainer.className = 'premium-bg-container';
    
    // Warm golden glow
    const glow1 = document.createElement('div');
    glow1.className = 'premium-glow premium-glow-1';
    
    // Cream/Beige secondary ambient glow
    const glow2 = document.createElement('div');
    glow2.className = 'premium-glow premium-glow-2';

    // Soft brown depth glow
    const glow3 = document.createElement('div');
    glow3.className = 'premium-glow premium-glow-3';

    bgContainer.appendChild(glow1);
    bgContainer.appendChild(glow2);
    bgContainer.appendChild(glow3);
    document.body.prepend(bgContainer);

    // Mouse parallax for the luxury glows
    window.addEventListener('mousemove', (e) => {
        // Very subtle opposite movement (luxury feel)
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        requestAnimationFrame(() => {
            glow1.style.transform = `translate(${x}px, ${y}px)`;
            glow2.style.transform = `translate(${-x}px, ${-y}px)`;
            glow3.style.transform = `translate(${x * 0.5}px, ${-y * 0.5}px)`;
        });
    }, { passive: true });

    // Google Analytics Initialization (Placeholder)
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // User should replace with their Measurement ID

    function trackEvent(action, category, label) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log(`Analytics Track: ${action} | ${category} | ${label}`);
    }

    // Welcome Popup
    setTimeout(() => {
        if (!localStorage.getItem('sst_welcomed')) {
            showToast("Welcome! Order easily via WhatsApp 📲");
            localStorage.setItem('sst_welcomed', 'true');
        }
    }, 3000);

    // ========== STICKY NAVBAR ==========
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // ========== ACTIVE NAV LINK HIGHLIGHT ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = navLinks.querySelectorAll('a');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ========== SCROLL REVEAL (Intersection Observer) ==========
    const revealElements = document.querySelectorAll('.reveal');

    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => window.revealObserver.observe(el));

    // ========== 3D TILT EFFECT ON CARDS ==========
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // ========== ANIMATED STAT COUNTER ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    num.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        num.textContent = target;
                    }
                }

                requestAnimationFrame(updateCount);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    // Trigger on load in case hero is visible
    animateCounters();

    // ========== SCROLL-TO-TOP BUTTON ==========
    const scrollTopBtn = document.getElementById('scroll-top');

    function toggleScrollTop() {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleScrollTop, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== LAZY LOADING IMAGES (native + fallback) ==========
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported — images already have loading="lazy"
    } else {
        // Fallback: use Intersection Observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========== GOOGLE SHEETS & DATA SYSTEM ==========
    const SHEET_ID = '1IaEkhjqGrHVi3cL_8Iizdzre06DdgdXdxJMusmk3s6M'; // Placeholder - User should replace with their ID
    const SHEET_URL = "https://opensheet.elk.sh/1IaEkhjqGrHVi3cL_8Iizdzre06DdgdXdxJMusmk3s6M/Sheet1";

    let allProducts = [];

    async function fetchProducts() {
        try {
            // Attempt to fetch from Google Sheets
            const response = await fetch(SHEET_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            // OpenSheet API returns a direct JSON array
            const data = await response.json();
            
            // Map Google Sheets rows to our product structure
            // Supporting both capitalized (from the walkthrough) and lowercase headers
            // 6 Smart Categories as requested
            const SMART_CATEGORIES = ['Dairy', 'Rice & Grains', 'Oils', 'Snacks', 'Drinks', 'Daily Essentials'];
            
            // Re-categorize products into the 6 smart categories
            allProducts = data.map(row => {
                const rawCat = row.Category || row.category || 'General';
                let mappedCat = 'Daily Essentials'; // Default
                
                // Smart mapping logic
                if (rawCat.toLowerCase().includes('milk') || rawCat.toLowerCase().includes('dairy')) mappedCat = 'Dairy';
                else if (rawCat.toLowerCase().includes('rice') || rawCat.toLowerCase().includes('grain')) mappedCat = 'Rice & Grains';
                else if (rawCat.toLowerCase().includes('oil')) mappedCat = 'Oils';
                else if (rawCat.toLowerCase().includes('snack') || rawCat.toLowerCase().includes('chocolate')) mappedCat = 'Snacks';
                else if (rawCat.toLowerCase().includes('drink') || rawCat.toLowerCase().includes('beverage')) mappedCat = 'Drinks';
                else {
                    // Check if the raw category name itself matches one of our smart ones
                    const match = SMART_CATEGORIES.find(c => rawCat.toLowerCase().includes(c.toLowerCase().split(' ')[0]));
                    if (match) mappedCat = match;
                }

                return {
                    id: row.ID || row.id || Math.random(),
                    name: row.Name || row.name || 'Unnamed Product',
                    price: parseFloat(row.Price || row.price || '0'),
                    image: row.Image || row.image || 'assets/srisaitraderskurnoollogo.jpeg',
                    category: mappedCat,
                    featured: row.Featured === 'TRUE' || row.Featured === true || row.featured === 'TRUE' || row.featured === true,
                    description: row.Desc || row.Description || row.desc || row.description || '',
                    badge: row.Badge || row.badge || ''
                };
            });

            renderCategories(SMART_CATEGORIES);
            filterAndRenderProducts(); // Initial render with sorting and featured first

        } catch (error) {
            handleFetchError(error, 'Google Sheets Fetch');
            loadLocalBackup();
        }
    }

    async function loadLocalBackup() {
        // ... (data same as before)
        try {
            const resp = await fetch('products.json');
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            const data = await resp.json();
            allProducts = data.products;
            
            // Re-map backup products to smart categories as well
            const SMART_CATEGORIES = ['Dairy', 'Rice & Grains', 'Oils', 'Snacks', 'Drinks', 'Daily Essentials'];
            allProducts = allProducts.map(p => {
                const rawCat = p.category || 'General';
                let mappedCat = 'Daily Essentials';
                if (rawCat.toLowerCase().includes('milk') || rawCat.toLowerCase().includes('dairy')) mappedCat = 'Dairy';
                else if (rawCat.toLowerCase().includes('rice') || rawCat.toLowerCase().includes('grain')) mappedCat = 'Rice & Grains';
                else if (rawCat.toLowerCase().includes('oil')) mappedCat = 'Oils';
                else if (rawCat.toLowerCase().includes('snack') || rawCat.toLowerCase().includes('chocolate')) mappedCat = 'Snacks';
                else if (rawCat.toLowerCase().includes('drink') || rawCat.toLowerCase().includes('beverage')) mappedCat = 'Drinks';
                return { ...p, category: mappedCat };
            });

            renderCategories(SMART_CATEGORIES);
            filterAndRenderProducts();
        } catch (e) {
            handleFetchError(e, 'Local Backup Fetch');
            // Hardcoded fallback logic
            const backupProducts = [
                { id: 1, name: "Premium Milk", price: 50, category: "Dairy", featured: true, image: "assets/milk.jpg" },
                { id: 2, name: "Traditional Rice", price: 60, category: "Rice & Grains", featured: true, image: "assets/grocery.jpg" }
            ];
            allProducts = backupProducts;
            renderCategories(['Dairy', 'Rice & Grains', 'Oils', 'Snacks', 'Drinks', 'Daily Essentials']);
            filterAndRenderProducts();
        }
    }

    function renderCategories(categories) {
        const categoriesContainer = document.getElementById('product-categories-container');
        if (!categoriesContainer) return;
        categoriesContainer.innerHTML = '';

        const filterChipsContainer = document.getElementById('filter-chips-container');
        if (filterChipsContainer) {
            // Keep the 'All' button, clear the rest
            filterChipsContainer.innerHTML = '<button class="filter-chip active" data-filter="All">All Items</button>';
            categories.forEach(name => {
                const chip = document.createElement('button');
                chip.className = 'filter-chip';
                chip.dataset.filter = name;
                chip.textContent = name;
                filterChipsContainer.appendChild(chip);
            });

            // Attach chip listeners
            filterChipsContainer.querySelectorAll('.filter-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    filterChipsContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    filterAndRenderProducts();
                    
                    // On mobile, scroll the chips container so active is visible
                    if (window.innerWidth < 768) {
                        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                });
            });
        }

        const categoryIconsMap = {
            "Dairy": "fa-cow",
            "Rice & Grains": "fa-wheat-awn",
            "Oils": "fa-oil-can",
            "Snacks": "fa-cookie-bite",
            "Drinks": "fa-bottle-water",
            "Daily Essentials": "fa-house-chimney"
        };

        categories.forEach(cat => {
            const name = typeof cat === 'object' ? cat.name : cat;
            const iconClass = typeof cat === 'object' ? (cat.icon || categoryIconsMap[name]) : (categoryIconsMap[name] || "fa-shopping-basket");

            const card = document.createElement('div');
            card.className = 'app-cat-card reveal';
            card.innerHTML = `
                <div class="app-cat-icon"><i class="fas ${iconClass}"></i></div>
                <h4>${name}</h4>
            `;

            card.addEventListener('click', () => {
                // Find matching chip and activate it
                const chip = document.querySelector(`.filter-chip[data-filter="${name}"]`);
                if (chip) chip.click();

                // Scroll to products
                const productSection = document.getElementById('order-section');
                if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth' });
                }
            });

            categoriesContainer.appendChild(card);
            if (window.revealObserver) revealObserver.observe(card);
        });
    }

    function filterAndRenderProducts() {
        const searchInput = document.getElementById('product-search');
        const sortSelect = document.getElementById('product-sort');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeChip = document.querySelector('.filter-chip.active');
        const currentCategory = activeChip ? activeChip.dataset.filter : 'All';
        const currentSort = sortSelect ? sortSelect.value : 'featured';

        let filtered = [...allProducts];

        // 1. Apply Category Filter
        if (currentCategory !== 'All') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // 2. Apply Search Filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.description.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        // 3. Apply Sorting
        filtered.sort((a, b) => {
            // "Popular First" (Featured) logic - Featured always at top
            if (currentSort === 'featured') {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0; // Maintain order within featured/non-featured
            }
            
            if (currentSort === 'price-low') return a.price - b.price;
            if (currentSort === 'price-high') return b.price - a.price;
            if (currentSort === 'name-az') return a.name.localeCompare(b.name);
            
            return 0;
        });

        // Update UI Text
        const titleEl = document.getElementById('current-category-title');
        const countEl = document.getElementById('search-result-count');

        if (titleEl) {
            titleEl.textContent = searchTerm ? `Search: "${searchTerm}"` : (currentCategory === 'All' ? 'All Items' : currentCategory);
        }

        if (countEl) {
            countEl.textContent = filtered.length > 0 ? `Showing ${filtered.length} products` : 'No products found matching your criteria.';
        }

        renderProducts(filtered);
    }

    // Attach search & sort listeners with debounce for performance/stability
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('product-search');
        const sortSelect = document.getElementById('product-sort');
        
        if (searchInput) {
            const debouncedSearch = debounce(() => {
                // Sanitize before filtering
                searchInput.value = sanitizeInput(searchInput.value).substring(0, 50); // Limit length
                filterAndRenderProducts();
            }, 300);
            
            searchInput.addEventListener('input', debouncedSearch);
        }
        
        if (sortSelect) sortSelect.addEventListener('change', filterAndRenderProducts);
    });

    function renderProducts(products) {
        const productContainer = document.getElementById('featured-products-container');
        if (!productContainer) return;
        
        if (products.length === 0) {
            productContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search-minus" style="font-size: 3rem; color: var(--text-muted); opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: var(--text-secondary);">No products found</h3>
                    <p style="color: var(--text-muted);">Try a different search term or category</p>
                </div>
            `;
            return;
        }

        productContainer.innerHTML = '';

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card reveal';
            
            // 🔥 Best Seller Badge for Featured Items
            const bestSellerBadge = p.featured ? `<div class="best-seller-badge">🔥 Best Seller</div>` : '';
            const otherBadge = (p.badge && !p.featured) ? `<div class="badge-generic" style="position: absolute; top: 12px; left: 12px; background: var(--primary-dark); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.6rem; z-index: 2;">${p.badge}</div>` : '';

            card.innerHTML = `
                <div class="product-image-wrap">
                    ${bestSellerBadge}
                    ${otherBadge}
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    <button class="btn-quick-view-circle" onclick="openQuickView(${p.id})" aria-label="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="product-info" style="padding: 15px; display: flex; flex-direction: column; flex-grow: 1;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 4px; line-height: 1.3; height: 2.6em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${p.name}</h4>
                    <p class="text-muted" style="font-size: 0.75rem; margin-bottom: 12px;">${p.category}</p>
                    <div style="margin-top: auto;">
                        <span class="product-price" style="display: block; font-size: 1.1rem; font-weight: 800; color: var(--color-leather, #7A4726); margin-bottom: 12px;">
                            ${formatPrice(p.price)}
                        </span>
                        <div class="product-actions" style="display: flex; gap: 8px;">
                            <button onclick="addToCart(${p.id})" class="btn btn-primary" style="flex: 1; padding: 8px 5px; font-size: 0.8rem;">
                                <i class="fas fa-plus"></i> Add
                            </button>
                            <button onclick="buyNow(${p.id})" class="btn btn-whatsapp" style="flex: 1; padding: 8px 5px; font-size: 0.8rem;">
                                <i class="fab fa-whatsapp"></i> Buy
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            productContainer.appendChild(card);
            if (window.revealObserver) revealObserver.observe(card);
        });
    }

    // ========== STICKY CART BAR LOGIC ==========
    function updateStickyCartBar() {
        const cartBar = document.getElementById('sticky-cart-bar');
        if (!cartBar) {
            document.body.classList.remove('has-cart-bar');
            return;
        }

        const cartSummary = document.getElementById('cart-item-summary');
        const checkoutBtn = document.getElementById('cart-bar-checkout');

        const cart = JSON.parse(localStorage.getItem('sst_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartBar.classList.remove('hide');
            document.body.classList.add('has-cart-bar');
            if (cartSummary) {
                cartSummary.textContent = `${totalItems} Item${totalItems > 1 ? 's' : ''} Added`;
            }
        } else {
            cartBar.classList.add('hide');
            document.body.classList.remove('has-cart-bar');
        }

        // Attach listener if not already there
        if (checkoutBtn && !checkoutBtn.onclick) {
            checkoutBtn.onclick = () => {
                if (typeof window.openCart === 'function') {
                    window.openCart();
                }
            };
        }
    }

    window.scrollToProducts = () => {
        const productSection = document.getElementById('order-section');
        if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ========== CART DRAWER OPEN / CLOSE CONTROLS ==========
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartToggle = document.getElementById('cart-toggle');
    const navCartBtn = document.getElementById('nav-cart-btn');
    const closeCartBtn = document.getElementById('close-cart');

    window.openCart = () => {
        if (!cartSidebar) {
            window.location.href = 'shop.html';
            return;
        }
        cartSidebar.classList.add('active');
        cartSidebar.setAttribute('aria-hidden', 'false');
        if (cartBackdrop) {
            cartBackdrop.classList.add('active');
            cartBackdrop.setAttribute('aria-hidden', 'false');
        }
        document.body.classList.add('cart-open');
    };

    window.closeCart = () => {
        if (!cartSidebar) return;
        cartSidebar.classList.remove('active');
        cartSidebar.setAttribute('aria-hidden', 'true');
        if (cartBackdrop) {
            cartBackdrop.classList.remove('active');
            cartBackdrop.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('cart-open');
    };

    // Guarantee cart starts strictly closed on initial page load
    window.closeCart();

    if (cartToggle) cartToggle.addEventListener('click', window.openCart);
    if (navCartBtn) navCartBtn.addEventListener('click', window.openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', window.closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', window.closeCart);

    // Escape key closes modal & cart drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                window.closeCart();
            }
            const modalEl = document.getElementById('quick-view-modal');
            if (modalEl && modalEl.style.display === 'block') {
                modalEl.style.display = 'none';
            }
        }
    });

    // ========== CART SYSTEM ==========
    let cart = JSON.parse(localStorage.getItem('sst_cart')) || [];
    let isCartBusy = false; // Spam protection

    window.addToCart = (id) => {
        if (isCartBusy) return;
        isCartBusy = true;
        setTimeout(() => isCartBusy = false, 500); // 500ms block

        const product = allProducts.find(p => p.id == id);
        if (product) {
            const existingItem = cart.find(item => item.id == id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('sst_cart', JSON.stringify(cart));
            updateCartUI();
            updateStickyCartBar(); // Update Instamart bar
            trackEvent('add_to_cart', 'ecommerce', product.name);
            showToast(`Added ${product.name} to cart!`);
        }
    };

    window.updateQuantity = (id, delta) => {
        const itemIndex = cart.findIndex(item => item.id == id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + delta;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('sst_cart', JSON.stringify(cart));
            updateCartUI();
            updateStickyCartBar(); // Update Instamart bar
        }
    };

    window.buyNow = (id) => {
        const product = allProducts.find(p => p.id == id);
        if (product) {
            trackEvent('whatsapp_click', 'conversion', product.name);
            const priceDisplay = formatPrice(product.price);
            const msg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n1. ${product.name}\n   Qty: 1  |  Price: ${priceDisplay}\n------------------------\n*Total Items:* 1\n*Estimated Total:* ${priceDisplay}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
            window.open(`https://wa.me/918639602820?text=${msg}`, '_blank');
        }
    };

    function updateCartUI() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const cartTotalCount = document.getElementById('cart-total-count');
        const cartHeaderCount = document.getElementById('cart-header-count');
        const cartContainer = document.getElementById('cart-items-container');

        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        cartCounts.forEach(el => {
            el.textContent = totalItems;
        });
        if (cartTotalCount) cartTotalCount.textContent = totalItems;
        if (cartHeaderCount) cartHeaderCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

        if (cartContainer) {
            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-cart-state">
                        <div class="empty-cart-icon">
                            <i class="fas fa-shopping-basket"></i>
                        </div>
                        <h4 class="empty-cart-title">Your Cart is Empty</h4>
                        <p class="empty-cart-subtitle">Add farm-fresh buffalo milk or your daily groceries to place an order via WhatsApp.</p>
                        <a href="#order-section" class="btn btn-gold btn-sm empty-browse-btn" onclick="closeCart()">
                            <i class="fas fa-arrow-down"></i> Browse Kirana Store
                        </a>
                    </div>
                `;
            } else {
                cartContainer.innerHTML = cart.map((item) => {
                    const qty = item.quantity || 1;
                    return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">${getItemPriceTotal(item.price, qty)}</p>
                            <span class="cart-item-unit">${formatPrice(item.price)} each</span>
                        </div>
                        <div class="cart-qty-controls">
                            <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn minus" aria-label="Decrease quantity">-</button>
                            <span class="qty-display">${qty}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn plus" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                `}).join('');
            }
        }
    }

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('sst_cart', JSON.stringify(cart));
        updateCartUI();
    };

    // ========== MODAL LOGIC ==========
    const modal = document.getElementById('quick-view-modal');
    window.openQuickView = (id) => {
        const product = allProducts.find(p => p.id == id);
        if (!product || !modal) return;

        document.getElementById('modal-img').src = product.image;
        document.getElementById('modal-title').textContent = product.name;
        document.getElementById('modal-price').textContent = formatPrice(product.price);
        document.getElementById('modal-desc').textContent = product.description;

        document.getElementById('modal-add-to-cart').onclick = () => window.addToCart(product.id);
        const baPriceDisplay = formatPrice(product.price);
        const baMsg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n1. ${product.name}\n   Qty: 1  |  Price: ${baPriceDisplay}\n------------------------\n*Total Items:* 1\n*Estimated Total:* ${baPriceDisplay}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
        document.getElementById('modal-wa-order').href = `https://wa.me/918639602820?text=${baMsg}`;

        modal.style.display = 'block';
    };

    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn && modal) {
        closeModalBtn.onclick = () => modal.style.display = 'none';
    }

    const checkoutBtn = document.getElementById('checkout-whatsapp');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            let itemsList = cart.map((item, index) => {
                const itemQty = item.quantity || 1;
                return `${index + 1}. ${item.name}\n   Qty: ${itemQty}  |  Price: ${getItemPriceTotal(item.price, itemQty)}`;
            }).join('\n\n');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const numericTotal = cart.reduce((sum, item) => {
                const p = parseFloat(item.price);
                return sum + (isNaN(p) ? 0 : p * (item.quantity || 1));
            }, 0);
            const hasMarketItems = cart.some(item => isNaN(parseFloat(item.price)));
            const totalDisplay = numericTotal > 0
                ? `₹${numericTotal}${hasMarketItems ? ' (+ Market Price items)' : ''}`
                : 'Market Price / On Request';
            const msg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n${itemsList}\n------------------------\n*Total Items:* ${totalItems}\n*Estimated Total:* ${totalDisplay}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
            window.open(`https://wa.me/918639602820?text=${msg}`, '_blank');
        };
    }

    // ========== ROTATING PREMIUM QUOTE TICKER ==========
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
    initQuoteTicker();

    function showToast(msg) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast glass';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // ========== CINEMATIC FARM SLIDESHOW ==========
    function initFarmSlideshow() {
        const sliderWrapper = document.getElementById('farm-slider-wrapper');
        if (!sliderWrapper) return;

        const slides = sliderWrapper.querySelectorAll('.farm-slide');
        const indicators = sliderWrapper.querySelectorAll('.nav-label-btn, .indicator-pill');
        const prevBtn = document.getElementById('farm-prev-btn');
        const nextBtn = document.getElementById('farm-next-btn');
        const playPauseBtn = document.getElementById('farm-play-pause-btn');
        const progressBar = document.getElementById('farm-progress-bar');
        const storyCards = document.querySelectorAll('.story-card[data-jump-slide]');
        const exploreBtn = document.getElementById('btn-explore-farm');

        if (!slides.length) return;

        const totalSlides = slides.length;
        let currentIndex = 0;
        let slideTimer = null;
        let isPlaying = true;
        let isHovered = false;
        const SLIDE_DURATION = 5000; // Automatic transition every 5 seconds

        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function resetProgress() {
            if (!progressBar) return;
            progressBar.classList.remove('animate');
            void progressBar.offsetWidth; // Force CSS reflow
            if (isPlaying && !isHovered && !prefersReducedMotion) {
                progressBar.classList.add('animate');
                progressBar.style.animationPlayState = 'running';
            }
        }

        function updateSlides(newIndex) {
            slides.forEach((slide, idx) => {
                const isActive = idx === newIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            indicators.forEach((indicator, idx) => {
                const isActive = idx === newIndex;
                indicator.classList.toggle('active', isActive);
                indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            currentIndex = newIndex;
            resetProgress();
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % totalSlides;
            updateSlides(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlides(prevIndex);
        }

        function goToSlide(index) {
            if (index < 0 || index >= totalSlides) return;
            updateSlides(index);
        }

        function startAutoplay() {
            stopAutoplay();
            if (prefersReducedMotion || !isPlaying || isHovered) return;
            slideTimer = setInterval(() => {
                nextSlide();
            }, SLIDE_DURATION);
            if (progressBar && !progressBar.classList.contains('animate')) {
                resetProgress();
            } else if (progressBar) {
                progressBar.style.animationPlayState = 'running';
            }
        }

        function stopAutoplay() {
            if (slideTimer) {
                clearInterval(slideTimer);
                slideTimer = null;
            }
            if (progressBar) {
                progressBar.style.animationPlayState = 'paused';
            }
        }

        function togglePlayPause() {
            isPlaying = !isPlaying;
            if (isPlaying) {
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
                    playPauseBtn.setAttribute('title', 'Pause slideshow');
                }
                startAutoplay();
                resetProgress();
            } else {
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playPauseBtn.setAttribute('aria-label', 'Play slideshow');
                    playPauseBtn.setAttribute('title', 'Play slideshow');
                }
                stopAutoplay();
            }
        }

        function handleUserInteraction(action) {
            action();
            if (isPlaying) {
                startAutoplay();
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleUserInteraction(nextSlide);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleUserInteraction(prevSlide);
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                togglePlayPause();
            });
        }

        indicators.forEach((indicator) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const targetIdx = parseInt(indicator.getAttribute('data-slide-to'), 10);
                if (!isNaN(targetIdx)) {
                    handleUserInteraction(() => goToSlide(targetIdx));
                }
            });
        });

        // Story Cards click & keyboard handling
        storyCards.forEach((card) => {
            const jumpTo = () => {
                const target = parseInt(card.getAttribute('data-jump-slide'), 10);
                if (!isNaN(target)) {
                    handleUserInteraction(() => goToSlide(target));
                    sliderWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };
            card.addEventListener('click', jumpTo);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    jumpTo();
                }
            });
        });

        // Explore button handling
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sliderWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (!isPlaying) {
                    togglePlayPause();
                }
            });
        }

        // Hover pause behavior
        sliderWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            if (isPlaying) {
                stopAutoplay();
            }
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            if (isPlaying) {
                startAutoplay();
            }
        });

        // Mobile touch swipe
        let touchStartX = 0;
        let touchStartY = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                const diffX = touchStartX - e.changedTouches[0].clientX;
                const diffY = touchStartY - e.changedTouches[0].clientY;
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                    if (diffX > 0) {
                        handleUserInteraction(nextSlide);
                    } else {
                        handleUserInteraction(prevSlide);
                    }
                }
            }
        }, { passive: true });

        // Keyboard arrow navigation
        sliderWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleUserInteraction(nextSlide);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleUserInteraction(prevSlide);
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                togglePlayPause();
            }
        });

        // Initialize first slide and start autoplay
        updateSlides(0);
        if (!prefersReducedMotion) {
            startAutoplay();
        }
    }

    // ========== STORE GALLERY INTERACTIVE LIGHTBOX ==========
    function initStoreGalleryLightbox() {
        const galleryGrid = document.getElementById('store-gallery-grid');
        const lightbox = document.getElementById('gallery-lightbox');
        if (!galleryGrid || !lightbox) return;

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const lightboxCounter = document.getElementById('lightbox-counter');
        const lightboxCategory = document.getElementById('lightbox-category');
        const closeBtn = document.getElementById('lightbox-close-btn');
        const prevBtn = document.getElementById('lightbox-prev-btn');
        const nextBtn = document.getElementById('lightbox-next-btn');
        const backdrop = document.getElementById('lightbox-backdrop');

        const galleryData = [
            {
                src: 'assets/shop front.jpeg',
                num: '01',
                title: 'Our Storefront',
                category: '01 — Our Storefront',
                desc: 'Visit Sri Sai Traders at Kurnool.',
                alt: 'Sri Sai Traders Storefront in Kurnool'
            },
            {
                src: 'assets/grocery.jpg',
                num: '02',
                title: 'Inside Our Store',
                category: '02 — Inside Our Store',
                desc: 'A closer look at our everyday shopping space.',
                alt: 'Inside Sri Sai Traders Everyday Shopping Space'
            },
            {
                src: 'assets/cool-drinks.jpeg',
                num: '03',
                title: 'Cool Drinks & Beverages',
                category: '03 — Cool Drinks & Beverages',
                desc: 'Explore the drinks and beverages available in our store.',
                alt: 'Cool Drinks and Chilled Beverages Section'
            },
            {
                src: 'assets/shop front.jpeg',
                num: '04',
                title: 'Snacks & Chocolates',
                category: '04 — Snacks & Chocolates',
                desc: 'Everyday treats and popular snacks.',
                alt: 'Snacks and Chocolates Display at Sri Sai Traders'
            },
            {
                src: 'assets/grocery.jpg',
                num: '05',
                title: 'Kirana & Groceries',
                category: '05 — Kirana & Groceries',
                desc: 'Daily essentials for your home and kitchen.',
                alt: 'Daily Kirana and Grocery Essentials Shelves'
            },
            {
                src: 'assets/carry-bags.jpeg',
                num: '06',
                title: 'Disposable & Packaging',
                category: '06 — Disposable & Packaging',
                desc: 'Useful disposable and packaging products.',
                alt: 'Disposable Items, Carry Bags and Food Packaging'
            }
        ];

        let currentLightboxIdx = 0;
        let lastFocusedElement = null;

        function updateLightboxView(index) {
            if (index < 0) index = galleryData.length - 1;
            if (index >= galleryData.length) index = 0;
            currentLightboxIdx = index;

            const item = galleryData[currentLightboxIdx];
            if (!item) return;

            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = item.src;
                lightboxImg.alt = item.alt;
                lightboxTitle.textContent = item.title;
                lightboxDesc.textContent = item.desc;
                lightboxCounter.textContent = `${item.num} / 06`;
                lightboxCategory.textContent = item.category;
                lightboxImg.style.opacity = '1';
            }, 100);
        }

        function openLightbox(index) {
            lastFocusedElement = document.activeElement;
            updateLightboxView(index);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }

        function nextSlide() {
            updateLightboxView(currentLightboxIdx + 1);
        }

        function prevSlide() {
            updateLightboxView(currentLightboxIdx - 1);
        }

        // Attach Card Click & Keydown
        const cards = galleryGrid.querySelectorAll('.gallery-card');
        cards.forEach((card) => {
            const idx = parseInt(card.getAttribute('data-index'), 10);
            card.addEventListener('click', () => {
                openLightbox(isNaN(idx) ? 0 : idx);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(isNaN(idx) ? 0 : idx);
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Keyboard Navigation (Escape, ArrowLeft, ArrowRight)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            }
        });

        // Touch Swipe on Mobile
        let touchStartX = 0;
        let touchStartY = 0;
        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                const diffX = touchStartX - e.changedTouches[0].clientX;
                const diffY = touchStartY - e.changedTouches[0].clientY;
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                    if (diffX > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }
        }, { passive: true });
    }

    // Initialize fetching & UI
    if (document.getElementById('featured-products-container')) { fetchProducts(); }
    updateCartUI();
    updateStickyCartBar();
    initFarmSlideshow();
    initStoreGalleryLightbox();

})();
