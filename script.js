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

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

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

    // ========== REVIEW SYSTEM (LocalStorage) ==========
    const reviewForm = document.getElementById('review-form');
    const starBtnAll = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('rating-value');
    const reviewsFeed = document.getElementById('reviews-feed');
    const avgDisplay = document.getElementById('avg-display');
    const reviewCountText = document.getElementById('review-count-text');
    const formFeedback = document.getElementById('form-feedback');

    // 1. Star Rating Interaction
    starBtnAll.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-value'));
            ratingInput.value = val;
            updateStars(val);
        });

        // Keyboard accessibility
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    function updateStars(val) {
        starBtnAll.forEach(btn => {
            const btnVal = parseInt(btn.getAttribute('data-value'));
            if (btnVal <= val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 2. Load and Render Reviews
    function getReviews() {
        return JSON.parse(localStorage.getItem('sst_reviews') || '[]');
    }

    function saveReviewToStorage(review) {
        const reviews = getReviews();
        reviews.unshift(review); // Add to beginning
        localStorage.setItem('sst_reviews', JSON.stringify(reviews));
        // Spam prevention: set a timestamp
        localStorage.setItem('sst_last_submission', Date.now());
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const options = { month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function renderReviews() {
        const reviews = getReviews();

        if (reviews.length === 0) {
            reviewsFeed.innerHTML = '<div class="review-empty">Be the first to share your experience with us!</div>';
            updateAverageDisplay(0, 0);
            return;
        }

        reviewsFeed.innerHTML = '';
        reviews.forEach(r => {
            const stars = '⭐'.repeat(r.rating);
            const reviewEl = document.createElement('div');
            reviewEl.className = 'review-item';
            reviewEl.innerHTML = `
                <div class="review-item-header">
                    <span class="reviewer-name">${escapeHtml(r.name)} <span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span></span>
                    <span class="review-stars">${stars}</span>
                </div>
                <p class="review-text">${escapeHtml(r.text)}</p>
                <div class="review-date">${formatDate(r.date)}</div>
            `;
            reviewsFeed.appendChild(reviewEl);
        });

        // Calculate and update average
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = (totalRating / reviews.length).toFixed(1);
        updateAverageDisplay(avg, reviews.length);
    }

    function updateAverageDisplay(avg, count) {
        avgDisplay.textContent = count === 0 ? '5.0' : avg;
        reviewCountText.textContent = `Based on ${count} reviews`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 3. Form Submission Handling
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value.trim();
            const text = document.getElementById('review-text').value.trim();
            const rating = parseInt(ratingInput.value);

            // Spam prevention check
            const lastSub = localStorage.getItem('sst_last_submission');
            if (lastSub && (Date.now() - lastSub < 30000)) { // 30 seconds limit
                displayFormFeedback('Please wait a bit before submitting another review.', 'error');
                return;
            }

            if (rating === 0) {
                displayFormFeedback('Please select a star rating.', 'error');
                return;
            }

            if (!name || !text) {
                displayFormFeedback('Please fill in all fields.', 'error');
                return;
            }

            const newReview = {
                name,
                text,
                rating,
                date: Date.now()
            };

            saveReviewToStorage(newReview);
            renderReviews();
            reviewForm.reset();
            ratingInput.value = 0;
            updateStars(0);
            displayFormFeedback('Review posted! Thank you.', 'success');
        });
    }

    function displayFormFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.className = `form-feedback ${type}`;
        setTimeout(() => {
            formFeedback.textContent = '';
        }, 4000);
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
                    image: row.Image || row.image || 'assets/logo.jpg',
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
                { id: 1, name: "Premium Milk", price: 50, category: "Dairy", featured: true, image: "assets/logo.jpg" },
                { id: 2, name: "Traditional Rice", price: 60, category: "Rice & Grains", featured: true, image: "assets/logo.jpg" }
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
                        <span class="product-price" style="display: block; font-size: 1.1rem; font-weight: 800; color: var(--primary-green); margin-bottom: 12px;">
                            ₹${p.price}
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
        const cartSummary = document.getElementById('cart-item-summary');
        const checkoutBtn = document.getElementById('cart-bar-checkout');
        
        if (!cartBar) return;

        const cart = JSON.parse(localStorage.getItem('sst_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartBar.classList.remove('hide');
            if (cartSummary) {
                cartSummary.textContent = `${totalItems} Item${totalItems > 1 ? 's' : ''} Added`;
            }
        } else {
            cartBar.classList.add('hide');
        }

        // Attach listener if not already there
        if (checkoutBtn && !checkoutBtn.onclick) {
            checkoutBtn.onclick = () => {
                const cartSidebar = document.getElementById('cart-sidebar');
                if (cartSidebar) cartSidebar.classList.add('active');
            };
        }
    }

    window.scrollToProducts = () => {
        const productSection = document.getElementById('order-section');
        if (productSection) {
            productSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
            const msg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n1. ${product.name}\n   Qty: 1  |  Price: ₹${product.price}\n------------------------\n*Total Items:* 1\n*Estimated Total:* ₹${product.price}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
            window.open(`https://wa.me/918639602820?text=${msg}`, '_blank');
        }
    };

    function updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotalCount = document.getElementById('cart-total-count');
        const cartContainer = document.getElementById('cart-items-container');

        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotalCount) cartTotalCount.textContent = totalItems;

        if (cartContainer) {
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            } else {
                cartContainer.innerHTML = cart.map((item) => {
                    const qty = item.quantity || 1;
                    return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>₹${item.price}</p>
                        </div>
                        <div class="cart-qty-controls">
                            <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn minus">-</button>
                            <span class="qty-display">${qty}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn plus">+</button>
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
        document.getElementById('modal-price').textContent = `₹${product.price}`;
        document.getElementById('modal-desc').textContent = product.description;

        document.getElementById('modal-add-to-cart').onclick = () => window.addToCart(product.id);
        const baMsg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n1. ${product.name}\n   Qty: 1  |  Price: ₹${product.price}\n------------------------\n*Total Items:* 1\n*Estimated Total:* ₹${product.price}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
        document.getElementById('modal-wa-order').href = `https://wa.me/918639602820?text=${baMsg}`;

        modal.style.display = 'block';
    };

    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.style.display = 'none';
    }

    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');

    if (cartToggle && cartSidebar) {
        cartToggle.onclick = () => cartSidebar.classList.toggle('active');
    }
    if (closeCartBtn && cartSidebar) {
        closeCartBtn.onclick = () => cartSidebar.classList.remove('active');
    }

    const checkoutBtn = document.getElementById('checkout-whatsapp');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            let itemsList = cart.map((item, index) => `${index + 1}. ${item.name}\n   Qty: ${item.quantity || 1}  |  Price: ₹${item.price * (item.quantity || 1)}`).join('\n\n');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const msg = encodeURIComponent(`🛒 *NEW ORDER*\n------------------------\n${itemsList}\n------------------------\n*Total Items:* ${totalItems}\n*Estimated Total:* ₹${totalPrice}\n\n*Customer Details:*\nName: \nMobile: \n\n*Delivery Method:* I will collect from shop.`);
            window.open(`https://wa.me/918639602820?text=${msg}`, '_blank');
        };
    }

    // ========== MISC UI ==========
    const offerBanner = document.getElementById('offer-banner');
    const closeBannerBtn = document.getElementById('close-banner');
    if (closeBannerBtn && offerBanner) {
        closeBannerBtn.onclick = () => offerBanner.style.display = 'none';
    }

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

    // Initialize fetching & UI
    fetchProducts();
    updateCartUI();
    updateStickyCartBar();
    renderReviews();

})();
