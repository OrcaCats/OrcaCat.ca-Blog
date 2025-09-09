/**
 * Self-Contained Footer Component with Dark Mode Support
 * Usage: createFooter(options)
 */

function createFooter(options = {}) {
    // Default configuration
    const config = {
        logoImage: '/assets/logo.png', // Default placeholder image
        logoAlt: 'Orcacat!',
        brandName: 'Orcacat Blog',
        email: 'therealorcacat@gmail.com',
        socialLinks: {
            facebook: '#',
            twitter: '#',
            linkedin: '#',
            instagram: '#',
            github: '#'
        },
        navLinks: {
            home: 'home.html',
            about: 'about.html',
            projects: 'projects.html',
            blog: 'blog.html'
        },
        sitemap: '#sitemap',
        description: 'We create exceptional digital experiences that inspire and engage. Our passion for innovation drives everything we do.',
        containerId: 'footer-container',
        ...options
    };

    // CSS Styles - Updated for Dark Mode Compatibility
    const styles = `
        <style id="footer-styles">
            /* Ensure CSS variables are available */
            :root {
                --footer-bg-light: linear-gradient(135deg, #3b1f6b 0%, #5b21b6 50%, #7c3aed 100%);
                --footer-text-light: #ffffff;
                --footer-accent-light: #c084fc;
                --footer-muted-light: #b0bec5;
                --footer-border-light: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] {
                --footer-bg-dark: linear-gradient(135deg, #2d1b3d 0%, #4c1d95 50%, #6b21a8 100%);
                --footer-text-dark: #e8e6f0;
                --footer-accent-dark: #d8b4fe;
                --footer-muted-dark: #a8a2b8;
                --footer-border-dark: rgba(216, 180, 254, 0.2);
            }

            .footer {
                background: var(--footer-bg-light);
                color: var(--footer-text-light);
                padding: 3rem 0 1rem;
                position: relative;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer {
                background: var(--footer-bg-dark);
                color: var(--footer-text-dark);
            }

            .footer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--footer-border-light), transparent);
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer::before {
                background: linear-gradient(90deg, transparent, var(--footer-border-dark), transparent);
            }

            .footer-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .logo-section {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .logo {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #7c3aed, #a855f7, #c084fc);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
                position: relative;
                overflow: hidden;
                padding: 8px;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .logo {
                box-shadow: 0 4px 20px rgba(216, 180, 254, 0.3);
            }

            .logo::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: conic-gradient(transparent, rgba(255, 255, 255, 0.3), transparent);
                animation: rotate 3s linear infinite;
                z-index: 1;
            }

            [data-theme="dark"] .logo::before {
                background: conic-gradient(transparent, rgba(216, 180, 254, 0.4), transparent);
            }

            .logo-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 50%;
                position: relative;
                z-index: 2;
                background: white;
                padding: 2px;
                transition: all 0.3s ease;
            }

            .logo-text {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--footer-accent-light);
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .logo-text {
                color: var(--footer-accent-dark);
            }

            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .footer-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2.5rem;
                margin-bottom: 2rem;
            }

            .footer-section h3 {
                color: var(--footer-accent-light);
                margin-bottom: 1rem;
                font-size: 1.2rem;
                font-weight: 600;
                position: relative;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer-section h3 {
                color: var(--footer-accent-dark);
            }

            .footer-section h3::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 30px;
                height: 2px;
                background: linear-gradient(90deg, var(--footer-accent-light), #a855f7);
                border-radius: 1px;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer-section h3::after {
                background: linear-gradient(90deg, var(--footer-accent-dark), #c084fc);
            }

            .footer-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .footer-links li {
                margin-bottom: 0.5rem;
            }

            .footer-links a {
                color: var(--footer-muted-light);
                text-decoration: none;
                transition: all 0.3s ease;
                display: inline-block;
                position: relative;
            }

            [data-theme="dark"] .footer-links a {
                color: var(--footer-muted-dark);
            }

            .footer-links a:hover {
                color: var(--footer-accent-light);
                transform: translateX(5px);
            }

            [data-theme="dark"] .footer-links a:hover {
                color: var(--footer-accent-dark);
            }

            .footer-links a::before {
                content: '→';
                opacity: 0;
                margin-right: 5px;
                transition: opacity 0.3s ease;
            }

            .footer-links a:hover::before {
                opacity: 1;
            }

            .footer-description {
                color: var(--footer-muted-light);
                line-height: 1.6;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer-description {
                color: var(--footer-muted-dark);
            }

            .social-links {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .social-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: var(--footer-border-light);
                border-radius: 50%;
                color: var(--footer-muted-light);
                text-decoration: none;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid var(--footer-border-light);
                position: relative;
                overflow: hidden;
            }

            [data-theme="dark"] .social-link {
                background: var(--footer-border-dark);
                border-color: var(--footer-border-dark);
                color: var(--footer-muted-dark);
            }

            .social-link:hover {
                background: rgba(192, 132, 252, 0.2);
                color: var(--footer-accent-light);
                transform: translateY(-2px) scale(1.1);
                box-shadow: 0 5px 15px rgba(192, 132, 252, 0.3);
            }

            [data-theme="dark"] .social-link:hover {
                background: rgba(216, 180, 254, 0.2);
                color: var(--footer-accent-dark);
                box-shadow: 0 5px 15px rgba(216, 180, 254, 0.3);
            }

            .contact-info {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .contact-item {
                display: flex;
                align-items: center;
                color: var(--footer-muted-light);
                gap: 0.5rem;
                transition: color 0.3s ease;
            }

            [data-theme="dark"] .contact-item {
                color: var(--footer-muted-dark);
            }

            .contact-item:hover {
                color: var(--footer-accent-light);
            }

            [data-theme="dark"] .contact-item:hover {
                color: var(--footer-accent-dark);
            }

            .contact-icon {
                width: 16px;
                height: 16px;
                opacity: 0.7;
            }

            .footer-bottom {
                border-top: 1px solid var(--footer-border-light);
                padding-top: 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer-bottom {
                border-top-color: var(--footer-border-dark);
            }

            .footer-bottom-left {
                color: var(--footer-muted-light);
                font-size: 0.9rem;
                flex: 1;
                text-align: center;
                transition: all 0.3s ease;
            }

            [data-theme="dark"] .footer-bottom-left {
                color: var(--footer-muted-dark);
            }

            .footer-bottom-right {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
            }

            .footer-bottom-right a {
                color: var(--footer-muted-light);
                text-decoration: none;
                font-size: 0.9rem;
                transition: color 0.3s ease;
            }

            [data-theme="dark"] .footer-bottom-right a {
                color: var(--footer-muted-dark);
            }

            .footer-bottom-right a:hover {
                color: var(--footer-accent-light);
            }

            [data-theme="dark"] .footer-bottom-right a:hover {
                color: var(--footer-accent-dark);
            }

            .back-to-top {
                position: absolute;
                top: 5px;
                right: 2rem;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #7c3aed, #a855f7);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                border: none;
                color: white;
                opacity: 0;
                visibility: hidden;
            }

            [data-theme="dark"] .back-to-top {
                background: linear-gradient(135deg, #6b21a8, #c084fc);
                box-shadow: 0 4px 15px rgba(216, 180, 254, 0.3);
            }

            .back-to-top:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
            }

            [data-theme="dark"] .back-to-top:hover {
                box-shadow: 0 8px 25px rgba(216, 180, 254, 0.4);
            }

            /* Image loading states */
            .logo-image.loading {
                opacity: 0.5;
            }

            .logo-image.error {
                display: none;
            }

            .logo-fallback {
                width: 100%;
                height: 100%;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                color: white;
                position: relative;
                z-index: 2;
            }

            .logo-image.error + .logo-fallback {
                display: flex;
            }

            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                
                .footer-bottom {
                    flex-direction: column;
                    text-align: center;
                }
                
                .social-links {
                    justify-content: center;
                }
                
                .back-to-top {
                    right: 1rem;
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .footer-section:hover h3 {
                animation: pulse 1s ease-in-out;
            }

            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        </style>
    `;

    // HTML Structure
    const footerHTML = `
        <footer class="footer">
            <button class="back-to-top" onclick="scrollToTop()" aria-label="Back to top">
                ↑
            </button>
            
            <div class="footer-container">
                <div class="logo-section">
                    <div class="logo">
                        <img src="${config.logoImage}" alt="${config.logoAlt}" class="logo-image" />
                        <div class="logo-fallback">${config.brandName.charAt(0)}</div>
                    </div>
                    <div class="logo-text">${config.brandName}</div>
                </div>
                
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Navigation</h3>
                        <ul class="footer-links">
                            <li><a href="${config.navLinks.home}">Home</a></li>
                            <li><a href="${config.navLinks.about}">About</a></li>
                            <li><a href="${config.navLinks.projects}">Projects</a></li>
                            <li><a href="${config.navLinks.blog}">Blog</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h3>About Us</h3>
                        <p class="footer-description">
                            ${config.description}
                        </p>
                        <div class="social-links">
                            <a href="${config.socialLinks.facebook}" class="social-link" aria-label="Facebook">f</a>
                            <a href="${config.socialLinks.twitter}" class="social-link" aria-label="Twitter">𝕏</a>
                            <a href="${config.socialLinks.linkedin}" class="social-link" aria-label="LinkedIn">in</a>
                            <a href="${config.socialLinks.instagram}" class="social-link" aria-label="Instagram">ig</a>
                            <a href="${config.socialLinks.github}" class="social-link" aria-label="GitHub">gh</a>
                        </div>
                    </div>

                    <div class="footer-section">
                        <h3>Get in Touch</h3>
                        <div class="contact-info">
                            <div class="contact-item" data-type="email">
                                <span class="contact-icon">📧</span>
                                <span>${config.email}</span>
                            </div>
                            <div class="contact-item" data-type="phone">
                                <span class="contact-icon">📱</span>
                                <span>${config.phone || ''}</span>
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">📍</span>
                                <span>${config.address || ''}</span>
                            </div>
                            <div class="contact-item">
                                <span class="contact-icon">🕒</span>
                                <span>${config.hours || ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-bottom-left">
                        © ${new Date().getFullYear()} ${config.brandName}. All rights reserved.
                    </div>
                    <div class="footer-bottom-right">
                        <a href="${config.sitemap}">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // JavaScript functionality
    function initFooter() {
        // Handle logo image loading
        const logoImage = document.querySelector('.logo-image');
        if (logoImage) {
            logoImage.addEventListener('load', function() {
                this.classList.remove('loading');
            });

            logoImage.addEventListener('error', function() {
                this.classList.add('error');
                console.warn('Footer logo image failed to load:', config.logoImage);
            });

            // Add loading class initially
            logoImage.classList.add('loading');
        }

        // Back to top functionality
        window.scrollToTop = function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Show/hide back to top button based on scroll position
        function toggleBackToTop() {
            const backToTopBtn = document.querySelector('.back-to-top');
            if (!backToTopBtn) return;
            
            const scrollThreshold = 300;
            
            if (window.pageYOffset > scrollThreshold) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        }

        // Add scroll event listener
        window.addEventListener('scroll', toggleBackToTop);

        // Add interactive effects to social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(192, 132, 252, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = '50%';
                ripple.style.top = '50%';
                ripple.style.width = '40px';
                ripple.style.height = '40px';
                ripple.style.marginLeft = '-20px';
                ripple.style.marginTop = '-20px';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });

        // Contact item click handlers
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const type = item.getAttribute('data-type');
            
            if (type === 'email') {
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const email = this.textContent.trim().split(' ')[1];
                    if (email) window.open(`mailto:${email}`, '_blank');
                });
            } else if (type === 'phone') {
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const phoneText = this.textContent.trim();
                    const phone = phoneText.match(/[\+\d\(\)\-\s]+/);
                    if (phone && phone[0]) {
                        window.open(`tel:${phone[0].replace(/\D/g, '')}`, '_blank');
                    }
                });
            }
        });

        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe footer sections for scroll animations
        const footerSections = document.querySelectorAll('.footer-section');
        footerSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(section);
        });
    }

    // Create and inject the footer
    function render() {
        // Remove existing styles and footer if they exist
        const existingStyles = document.getElementById('footer-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        const existingFooter = document.getElementById(config.containerId);
        if (existingFooter) {
            existingFooter.remove();
        }

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', styles);

        // Add footer to body or specified container
        let container = document.body;
        if (config.containerId && document.getElementById(config.containerId)) {
            container = document.getElementById(config.containerId);
        }

        container.insertAdjacentHTML('beforeend', footerHTML);

        // Initialize functionality
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFooter);
        } else {
            initFooter();
        }
    }

    // Public API
    return {
        render: render,
        update: function(newOptions) {
            Object.assign(config, newOptions);
            render();
        },
        destroy: function() {
            const styles = document.getElementById('footer-styles');
            const footer = document.querySelector('.footer');
            
            if (styles) styles.remove();
            if (footer) footer.remove();
            
            window.removeEventListener('scroll', toggleBackToTop);
        }
    };
}

// Auto-initialize with default footer when loaded via script tag
(function() {
    // Make createFooter globally available
    window.createFooter = createFooter;
    
    // Auto-initialize when DOM is ready if data attributes are found or auto-init is enabled
    function autoInit() {
        // Check if auto-initialization is enabled
        const scriptTag = document.querySelector('script[src*="footer"]') || 
                         document.querySelector('script[data-auto-init]');
        
        if (scriptTag) {
            const autoInit = scriptTag.getAttribute('data-auto-init') !== 'false';
            
            if (autoInit) {
                // Extract configuration from data attributes
                const config = {};
                
                if (scriptTag.getAttribute('data-logo-image')) config.logoImage = scriptTag.getAttribute('data-logo-image');
                if (scriptTag.getAttribute('data-logo-alt')) config.logoAlt = scriptTag.getAttribute('data-logo-alt');
                if (scriptTag.getAttribute('data-brand')) config.brandName = scriptTag.getAttribute('data-brand');
                if (scriptTag.getAttribute('data-email')) config.email = scriptTag.getAttribute('data-email');
                if (scriptTag.getAttribute('data-phone')) config.phone = scriptTag.getAttribute('data-phone');
                if (scriptTag.getAttribute('data-address')) config.address = scriptTag.getAttribute('data-address');
                if (scriptTag.getAttribute('data-description')) config.description = scriptTag.getAttribute('data-description');
                
                // Parse nav links
                if (scriptTag.getAttribute('data-nav-home')) config.navLinks = config.navLinks || {};
                if (scriptTag.getAttribute('data-nav-home')) config.navLinks.home = scriptTag.getAttribute('data-nav-home');
                if (scriptTag.getAttribute('data-nav-about')) config.navLinks.about = scriptTag.getAttribute('data-nav-about');
                if (scriptTag.getAttribute('data-nav-projects')) config.navLinks.projects = scriptTag.getAttribute('data-nav-projects');
                if (scriptTag.getAttribute('data-nav-blog')) config.navLinks.blog = scriptTag.getAttribute('data-nav-blog');
                
                // Parse social links
                if (scriptTag.getAttribute('data-facebook')) config.socialLinks = config.socialLinks || {};
                if (scriptTag.getAttribute('data-facebook')) config.socialLinks.facebook = scriptTag.getAttribute('data-facebook');
                if (scriptTag.getAttribute('data-twitter')) config.socialLinks.twitter = scriptTag.getAttribute('data-twitter');
                if (scriptTag.getAttribute('data-linkedin')) config.socialLinks.linkedin = scriptTag.getAttribute('data-linkedin');
                if (scriptTag.getAttribute('data-instagram')) config.socialLinks.instagram = scriptTag.getAttribute('data-instagram');
                if (scriptTag.getAttribute('data-github')) config.socialLinks.github = scriptTag.getAttribute('data-github');
                
                if (scriptTag.getAttribute('data-sitemap')) config.sitemap = scriptTag.getAttribute('data-sitemap');
                
                // Create and render footer
                const footer = createFooter(config);
                footer.render();
                
                // Make footer instance globally available
                window.footerInstance = footer;
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }
    
    // Export for module systems (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = createFooter;
    }
})();